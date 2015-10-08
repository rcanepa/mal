'use strict';

/**
 * TODO: handle cases where the input start with a number and contains characters (10avc)
 * @param istream
 * @returns {{peek: peek, next: next, eof: eof}}
 */
var tokenStream = function(istream) {
  var current = null;
  var init_identifiers = /^[_a-zA-Z]/;
  var non_string_quotes = '\'\`\~';

  return {
    peek: peek,
    next: next,
    eof: eof
  };

  /**
   *
   * @returns {*}
   */
  function read_next() {
    var char;

    read_until(is_white_space);

    if (istream.eof()) {
      return null;
    }

    char = istream.peek();

    // Lists (...), vectors [...] and hashmaps {...}
    if (is_container(char)) {
      return istream.next();
    }

    // + - / * %
    if (is_math_operator(char)) {
      return read_until(function(char) {
        return !is_white_space(char) && !is_container(char);
      });
    }

    // = > < <= >=
    if (is_logical_operator(char)) {
      return read_logical_operator();
    }

    // Integers and floats
    if (is_number(char)) {
      return read_number();
    }

    // Strings
    if (is_doublequote(char)) {
      return read_string() + istream.next();
    }

    // ' ` ~ ~@
    if (is_quote(char)) {
      return read_quote();
    }

    // :keyword
    if (is_keyword(char)) {
      return read_until(function(char) {
        return !is_white_space(char) && !is_container(char);
      });
    }

    // deref @a
    if (is_deref(char)) {
      return istream.next();
    }

    // ^{"a" 1} [1 2 3]
    if (is_metadata(char)) {
      return istream.next();
    }

    // keywords and identifiers
    var word = read_word();
    if (word !== null) {
      return word;
    }

    istream.error('unrecognized char');

  }

  /**
   * Consume a char and produce true if it is equal to a white space or a new line
   * character.
   * @param char
   * @returns {boolean}
   */
  function is_white_space(char) {
    return ', \n\r'.indexOf(char) >= 0;
  }

  /**
   * Consume a char and produce true if the char is one of: (, ), [ or ].
   * @param char
   * @returns {boolean}
   */
  function is_container(char) {
    return '()[]{}'.indexOf(char) >= 0;
  }

  /**
   * Consume a char and produce true if it is a number or a '.'.
   * @param char
   * @returns {boolean}
   */
  function is_number(char) {
    return (char !== '' && !is_white_space(char) && !isNaN(char)) || is_point(char);
  }

  /**
   * Consume a char and produce true if it is equal to '.'.
   * @param char
   * @returns {boolean}
   */
  function is_point(char) {
    return char === '.';
  }

  /**
   * Consume a char and produce true if it is equal to a double quote.
   * @param char
   * @returns {boolean}
   */
  function is_doublequote(char) {
    return char === '\"';
  }

  /**
   * Consume a char and produce true if it is equal to a non-string quote: ' ` ~ ~@.
   * @param char
   * @returns {boolean}
   */
  function is_quote(char) {
    return non_string_quotes.indexOf(char) >= 0;
  }

  /**
   * Consume a char and produce true if it is equal to a backslash.
   * @param char
   * @returns {boolean}
   */
  function is_backslash(char) {
    return char === '\\';
  }

  /**
   * Consume a char and produce true if it is a math operator.
   * @param char
   * @returns {boolean}
   */
  function is_math_operator(char) {
    return '+-/*%'.indexOf(char) >= 0;
  }

  /**
   * Consume a char and produce true if it is a logical operator.
   * @param char
   * @returns {boolean}
   */
  function is_logical_operator(char) {
    return '><='.indexOf(char) >= 0;
  }

  /**
   * Consume a char and produce true if it is a keyword (starts with :).
   * @param char
   * @returns {boolean}
   */
  function is_keyword(char) {
    return char === ':';
  }

  /**
   * Consume a char and produce true if it is a deref operator (@).
   * @param char
   * @returns {boolean}
   */
  function is_deref(char) {
    return char === '@';
  }

  /**
   * Consume a char and produce true if it is a metadata operator (^).
   * @param char
   * @returns {boolean}
   */
  function is_metadata(char) {
    return char === '^';
  }

  /**
   * Iterate over an inputStream until it found a white space. If the string
   * start with a valid character, the word is returned.
   * @returns {string|null}
   */
  function read_word() {
    var word = '';
    word += read_until(function(char) {
      return !is_white_space(char) && !is_container(char);
    });
    if (!word[0].match(init_identifiers)) {
      return null;
    }
    return word;
  }

  /**
   * Return a logical operator from the inputStream. It check if the operator
   * is two characters long.
   * @returns {string}
   */
  function read_logical_operator() {
    var operator = istream.next();
    if ((operator === '>' || operator === '<') && istream.peek() === '=') {
      operator += istream.next();
    }
    return operator;
  }

  /**
   * Iterate over the inputStream and return a string representing a number (integer or float).
   * @returns {string}
   */
  function read_number() {
    return read_until(is_number);
  }

  /**
   * Iterate over the inputStream and return non string quote (operator): ' ` ~ ~@.
   * @returns {string}
   */
  function read_quote() {
    var quote = istream.next();
    if (quote === '~' && istream.peek() === '@') {
      return quote + istream.next();
    }
    return quote;
  }

  /**
   * Iterate over an inputStream until it found a closing double quote (the end
   * of the string). If a escaped double quote is found, a recursive execution will
   * continue to get the rest of the string.
   * @returns {string}
   */
  function read_string() {
    var str = '';
    str += istream.next();
    str += read_until(function(char) {
      return char !== "\"";
    });

    // Check for an escaped quote
    var idx = str.length - 1;
    var backslashes = 0;
    while (idx >= 0) {
      if (is_backslash(str[idx])) {
        backslashes++;
      }
      else {
        break;
      }
      idx--;
    }
    if (backslashes % 2 === 1) {
      str += read_string();
    }
    return str;
  }

  /**
   * Consume a predicate and iterate over the inputStream until it gets evaluated to
   * false. Return all the character whose were evaluated to true.
   * @param predicate
   * @returns {string}
   */
  function read_until(predicate) {
    var str = '';
    while (!istream.eof() && predicate(istream.peek())) {
      str += istream.next();
    }
    return str;
  }

  /**
   * Return the current stream token.
   * @returns {string}
   */
  function peek() {
    return current || (current = read_next());
  }

  /**
   * Return the current stream token and set the current to null. If current was already null,
   * it will return call read_next() and return a new token.
   * @returns {*}
   */
  function next() {
    var token = current;
    current = null;
    return token || read_next();
  }

  function eof() {
    return peek() === null;
  }

};

module.exports = tokenStream;

'use strict';

/**
 * MAL expression (code) -> inputStream -> tokenStream -> Array
 */

/**
 * Consume a string with a MAL expression and return an inputStream
 * object. This object allows us to iterate over the stream in a
 * char by char basis.
 * @param input
 * @returns {{next: next, peek: peek, eof: eof, error: error}}
 */
var inputStream = function(input) {
  var pos = 0;
  var line = 1;
  var col = 0;

  return {
    next: next,
    peek: peek,
    eof: eof,
    error: error
  };

  /**
   * Return a char (string of size 1) that is in the pos position
   * of the stream and increment pos by one. It also updates the
   * current col position and line position.
   * @returns {String}
   */
  function next() {
    var char = input[pos++];
    if (char === "\n") {
      line++;
      col = 0;
    }
    else {
      col++;
    }
    // console.log('INPUTSTREAM next:', char);
    return char;
  }

  /**
   * Return a char (string of size 1) that is in the pos position
   * of the stream.
   * @returns {String}
   */
  function peek() {
    // console.log('INPUTSTREAM next:', input[pos]);
    return input[pos];
  }

  /**
   * Returns true if the end of the stream was reached.
   * @returns {boolean}
   */
  function eof() {
    return input[pos] === undefined;
  }

  /**
   * Consume a string message a thrown an Error with the message and
   * the current stream position and column.
   * @param msg
   */
  function error(msg) {
    throw new Error(msg + ' (' + line + ':' + col + ') ');
  }

};

/**
 * TODO: handle cases where the input start with a number and contains characters (10avc)
 * @param istream
 * @returns {{peek: peek, next: next, eof: eof}}
 */
var tokenStream = function(istream) {
  var current = null;
  var init_identifiers = /^[_a-zA-Z]/;

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

    // Lists (...) and vectors [...]
    if (is_container(char)) {
      return istream.next();
    }

    // + - / * %
    if (is_math_operator(char)) {
      return istream.next();
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
    return ' \n\r'.indexOf(char) >= 0;
  }

  /**
   * Consume a char and produce true if the char is one of: (, ), [ or ].
   * @param char
   * @returns {boolean}
   */
  function is_container(char) {
    return '()[]'.indexOf(char) >= 0;
  }

  /**
   * Consume a char and produce true if it is a number or a '.'.
   * @param char
   * @returns {boolean}
   */
  function is_number(char) {
    return (char !== '' && !is_white_space(char) && !isNaN(char)) || is_point(char);
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
   * Iterate over an inputStream until it found a closing double quote (the end
   * of the string). If a escaped double quote is found, a recursive execution will
   * continue to get the rest of the string.
   * @returns {string}
   */
  function read_string() {
    var str = '';
    str += istream.next();
    str += read_until(function(char) { return char !== "\""; });

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
    return current || (current = read_next());
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

/**
 * Reader Factory
 * @returns {{add: add, peek: peek, next: next}}
 */
var readerFactory = function() {
  var length = 0;
  var index = 0;
  return {
    add: add,
    peek: peek,
    next: next
  };

  function add(element) {
    Array.prototype.push.call(this, element);
  }

  function peek() {
    return this[index];
  }

  function next() {
    return this[index++];
  }

};

/**
 * Consume a s-expression and produce an AST representation of it.
 * @param sexp
 * @returns {Array}
 */
function read_str(sexp) {
  var ast;
  var istream = inputStream(sexp);
  var tstream = tokenStream(tstream);
  ast = read_form(tstream);
  return ast;
}

/**
 * Consume a s-expression (string) and produce a flat list of tokens.
 * E.g.: '(+ (- 2 3) 4)' -> [ '(', '+', '(', '-', '2', '3', ')', '4', ')' ]
 * @param sexp  {String}
 */
function tokenizer(sexp) {
  sexp = remove_comments(sexp);
  sexp = clean_sexp(sexp);

  var re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/;
  var tokens = [];
  var match = sexp.match(re);

  while (match[0] !== '') {
    tokens.push(match[0].trim());
    sexp = sexp.slice(match.index + match[0].length);
    match = sexp.match(re);
  }

  return tokens;
}

/**
 * Consume a tokenStream with a list of tokens (an unfinished flat structure) and creates
 * an AST (nested lists).
 * E.g.: [ '(', '+', '(', '-', '2', '3', ')', '4', ')' ] -> [ '+', [ '-', '2', '3' ], '4' ]
 * @param tstream  {Object}
 * @returns {String, Number, Boolean, Array}
 */
function read_form(tstream) {

  // console.log(tstream);

  if (tstream.eof()) {
    console.log('unexpected EOF while reading');
    // throw new Error('unexpected EOF while reading');
  }

  var token = tstream.peek();

  if (token === '(') {
    return read_list(tstream);
  }

  if (token === ')') {
    throw new Error('expected \')\', got EOF');
  }

  if (token === '[') {
    return read_vector(tstream);
  }

  if (token === ']') {
    throw new Error('expected \']\', got EOF');
  }

  if (token === '\'') {
    return read_quote(tstream);
  }

  if (token === '`') {
    return read_quasicuote(tstream);
  }

  if (token === '~') {
    return read_unquote(tstream);
  }

  if (token === '~@') {
    return read_splice_unquote(tstream);
  }

  return read_atom(tstream);

}

/**
 * Consume a tokenStream with its next token equal to '(', and return an Array with all
 * the elements that are inside the parenthesis.
 * @param tstream {Object}
 * @returns {Array}
 */
function read_list(tstream) {
  var lst = [];

  // drop the ( parenthesis
  tstream.next();

  while (tstream.peek() !== ')' && tstream.peek() !== undefined) {
    lst.push(read_form(tstream));
  }

  if (tstream.peek() !== ')') {
    // throw Error('expected \')\' got EOF');
    console.log('expected \')\' got EOF');
  }

  // drop the ) parenthesis
  tstream.next();

  return lst;
}

/**
 * Consume a tokenStream with its next token equal to '[', and return an Array with all
 * the elements that are inside the parenthesis.
 * @param tstream {Object}
 * @returns {Array}
 */
function read_vector(tstream) {
  var vec = [];

  // drop the [ bracket
  tstream.next();

  while (tstream.peek() !== ']' && tstream.peek() !== undefined) {
    vec.push(read_form(tstream));
  }

  if (tstream.peek() !== ']') {
    // throw Error('expected \']\' got EOF');
    console.log('expected \']\' got EOF');
  }

  // drop the ] bracket
  tstream.next();

  return vec;
}

/**
 * Consume a tokenStream and check it's next token to return a string if the token is a symbol
 * or an integer if the token is a number.
 * TODO: support for booleans, floats, variables
 * @param tstream {Object}
 * @returns {String | Number}
 */
function read_atom(tstream) {
  var atom = tstream.next();

  if (!isNaN(atom)) {
    return parseInt(atom);
  }

  return atom;
}

/**
 * Consume a quote expression (from the tokenStream) and return a list with the first
 * element equal to "quote" and the second element equal to the evaluation of the
 * tokenStream's next token.
 * @param tstream {Object}
 * @returns {Array}
 */
function read_quote(tstream) {
  var lst = ['quote'];

  // drop the ' from the tokenStream
  tstream.next();

  lst.push(read_form(tstream));
  return lst;
}

/**
 * Consume a quasiquote expression (from the tokenStream) and return a list with the first
 * element equal to "quasiquote" and the second element equal to the evaluation of the
 * tokenStream's next token.
 * @param tstream {Object}
 * @returns {Array}
 */
function read_quasicuote(tstream) {
  var lst = ['quasiquote'];

  // drop the ` from the tokenStream
  tstream.next();

  lst.push(read_form(tstream));
  return lst;
}

/**
 * Consume an unquote expression (from the tokenStream) and return a list with the first
 * element equal to "unquote" and the second element equal to the evaluation of the
 * tokenStream's next token.
 * @param tstream {Object}
 * @returns {Array}
 */
function read_unquote(tstream) {
  var lst = ['unquote'];

  // drop the ~ from the tokenStream
  tstream.next();

  lst.push(read_form(tstream));
  return lst;
}

/**
 * Consume an splice-unquote expression (from the tokenStream) and return a list with the first
 * element equal to "splice-unquote" and the second element equal to the evaluation of the
 * tokenStream's next token.
 * @param tstream {Object}
 * @returns {Array}
 */
function read_splice_unquote(tstream) {
  var lst = ['splice-unquote'];

  // drop the ~@ from the tokenStream
  tstream.next();

  lst.push(read_form(tstream));
  return lst;
}

/**
 * Consume an s-expression and delete all the comments lines (start by ;). This
 * only works with one line comments.
 * @param sexp {String}
 * @returns {String}
 */
function remove_comments(sexp) {
  return sexp.replace(/;.*[\r|\n]$/, '');
}

function clean_sexp(sexp) {
  return sexp.replace(/,/g, '');
}

module.exports = {
  read_str: read_str,
  inputStream: inputStream,
  tokenStream: tokenStream
};

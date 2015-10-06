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
    return char;
  }

  /**
   * Return a char (string of size 1) that is in the pos position
   * of the stream.
   * @returns {String}
   */
  function peek() {
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
 * TODO: support for strings, operators, symbols
 * @param istream
 * @returns {{peek: peek, next: next}}
 */
var tokenStream = function(istream) {
  var current = null;

  return {
    peek: peek,
    next: next
  };

  function read_next() {
    var char;

    read_until(is_white_space);

    if (istream.eof()) {
      return null;
    }

    char = istream.peek();

    if (is_container(char)) {
      return istream.next();
    }

    if (is_number(char)) {
      return read_number();
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
   * Iterate over the inputStream and return a string representing a number (integer or float).
   * @returns {string}
   */
  function read_number() {
    return read_until(is_number);
  }

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
  var ast, reader;
  var tokens = tokenizer(sexp);
  reader = readerFactory();
  // console.log(tokens);
  tokens.forEach(function(element, index, array) {
    reader.add(element);
  });
  // console.log(reader);
  ast = read_form(reader);
  return ast;
}

/**
 * Consume a s-expression (string) and produce a flat list of tokens.
 * E.g.: '(+ (- 2 3) 4)' -> [ '(', '+', '(', '-', '2', '3', ')', '4', ')' ]
 * @param sexp  {String}
 * TODO: implement this as a real lexer (without regular expressions)
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
 * Consume a reader with a list of tokens (an unfinished flat structure) and creates
 * an AST (nested lists).
 * E.g.: [ '(', '+', '(', '-', '2', '3', ')', '4', ')' ] -> [ '+', [ '-', '2', '3' ], '4' ]
 * @param reader  {Object}
 * @returns {String, Number, Boolean, Array}
 */
function read_form(reader) {

  // console.log(reader);

  if (reader.length === 0) {
    console.log('unexpected EOF while reading');
    // throw new Error('unexpected EOF while reading');
  }

  var token = reader.peek();

  if (token === '(') {
    return read_list(reader);
  }

  if (token === ')') {
    throw new Error('expected \')\', got EOF');
  }

  if (token === '[') {
    return read_vector(reader);
  }

  if (token === ']') {
    throw new Error('expected \']\', got EOF');
  }

  if (token === '\'') {
    return read_quote(reader);
  }

  if (token === '`') {
    return read_quasicuote(reader);
  }

  if (token === '~') {
    return read_unquote(reader);
  }

  if (token === '~@') {
    return read_splice_unquote(reader);
  }

  return read_atom(reader);

}

/**
 * Consume a reader with its next token equal to '(', and return an Array with all
 * the elements that are inside the parenthesis.
 * @param reader {Object}
 * @returns {Array}
 */
function read_list(reader) {
  var lst = [];

  // drop the ( parenthesis
  reader.next();

  while (reader.peek() !== ')' && reader.peek() !== undefined) {
    lst.push(read_form(reader));
  }

  if (reader.peek() !== ')') {
    // throw Error('expected \')\' got EOF');
    console.log('expected \')\' got EOF');
  }

  // drop the ) parenthesis
  reader.next();

  return lst;
}

/**
 * Consume a reader with its next token equal to '[', and return an Array with all
 * the elements that are inside the parenthesis.
 * @param reader {Object}
 * @returns {Array}
 */
function read_vector(reader) {
  var vec = [];

  // drop the [ bracket
  reader.next();

  while (reader.peek() !== ']' && reader.peek() !== undefined) {
    vec.push(read_form(reader));
  }

  if (reader.peek() !== ']') {
    // throw Error('expected \']\' got EOF');
    console.log('expected \']\' got EOF');
  }

  // drop the ] bracket
  reader.next();

  return vec;
}

/**
 * Consume a reader and check it's next token to return a string if the token is a symbol
 * or an integer if the token is a number.
 * TODO: support for booleans, floats, variables
 * @param reader {Object}
 * @returns {String | Number}
 */
function read_atom(reader) {
  var atom = reader.next();

  if (!isNaN(atom)) {
    return parseInt(atom);
  }

  return atom;
}

/**
 * Consume a quote expression (from the reader) and return a list with the first
 * element equal to "quote" and the second element equal to the evaluation of the
 * reader's next token.
 * @param reader {Object}
 * @returns {Array}
 */
function read_quote(reader) {
  var lst = ['quote'];

  // drop the ' from the reader
  reader.next();

  lst.push(read_form(reader));
  return lst;
}

/**
 * Consume a quasiquote expression (from the reader) and return a list with the first
 * element equal to "quasiquote" and the second element equal to the evaluation of the
 * reader's next token.
 * @param reader {Object}
 * @returns {Array}
 */
function read_quasicuote(reader) {
  var lst = ['quasiquote'];

  // drop the ` from the reader
  reader.next();

  lst.push(read_form(reader));
  return lst;
}

/**
 * Consume an unquote expression (from the reader) and return a list with the first
 * element equal to "unquote" and the second element equal to the evaluation of the
 * reader's next token.
 * @param reader {Object}
 * @returns {Array}
 */
function read_unquote(reader) {
  var lst = ['unquote'];

  // drop the ~ from the reader
  reader.next();

  lst.push(read_form(reader));
  return lst;
}

/**
 * Consume an splice-unquote expression (from the reader) and return a list with the first
 * element equal to "splice-unquote" and the second element equal to the evaluation of the
 * reader's next token.
 * @param reader {Object}
 * @returns {Array}
 */
function read_splice_unquote(reader) {
  var lst = ['splice-unquote'];

  // drop the ~@ from the reader
  reader.next();

  lst.push(read_form(reader));
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

'use strict';

/**
 * Reader factory
 * @type {{length: number, index: number, add: Function, peek: Function, next: Function}}
 */
var readerFactory = {
  length: 0,
  index: 0,
  add: function(element) {
    Array.prototype.push.call(this, element);
  },
  peek: function() {
    return this[this.index];
  },
  next: function() {
    return this[this.index++];
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
  reader = Object.create(readerFactory);
  // console.log(tokens);
  tokens.forEach(function(element, index, array) {
    reader.add(element);
  });
  ast = read_form(reader);
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
  // console.log(sexp);
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
 * @returns {Array}
 */
function read_form(reader) {

  if (reader.length === 0) {
    throw new Error('unexpected EOF while reading');
  }

  var token = reader.peek();

  if (token === '(') {
    return read_list(reader);
  }

  if (token === ')') {
    throw new Error('unexpected )');
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

  while (reader.peek() !== ')') {
    lst.push(read_form(reader));
  }

  // drop the ) parenthesis
  reader.next();

  return lst;
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
  read_str: read_str
};

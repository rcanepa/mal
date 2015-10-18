'use strict'

var fs = require('fs')
var inputStream = require('./input_stream')
var tokenStream = require('./token_stream')

/**
 * MAL expression (code) -> inputStream -> tokenStream -> Array
 */

/**
 * Consume a s-expression and produce an AST representation of it.
 * @param sexp
 * @returns {Array}
 */
function read_str(sexp) {
  var ast
  var istream = inputStream(sexp)
  var tstream = tokenStream(istream)
  ast = read_form(tstream)
  //fs.appendFileSync(__dirname + '/execution.log', JSON.stringify([istream, tstream, ast]))
  //fs.appendFileSync(__dirname + '/execution.log', '\n')
  return ast
}


/**
 * Consume a tokenStream with a list of tokens (an unfinished flat structure) and creates
 * an AST (nested lists).
 * E.g.: [ '(', '+', '(', '-', '2', '3', ')', '4', ')' ] -> [ '+', [ '-', '2', '3' ], '4' ]
 * @param tstream  {Object}
 * @returns {String, Number, Boolean, Array, Object}
 */
function read_form(tstream) {

  if (tstream.eof()) {
    throw new Error('unexpected EOF while reading')
  }

  var token = tstream.peek()

  if (token === '(') {
    return {type: 'list', value: read_container(tstream, ')')}
  }

  if (token === ')') {
    throw new Error('expected \')\', got EOF')
  }

  if (token === '[') {
    return {type: 'vector', value: read_container(tstream, ']')}
  }

  if (token === ']') {
    throw new Error('expected \']\', got EOF')
  }

  if (token === '{') {
    return {type: 'hashmap', value: read_container(tstream, '}')}
  }

  if (token === '}') {
    throw new Error('expected \'}\', got EOF')
  }

  if (token === '\'') {
    return {type: 'quote', value: read_quote(tstream)}
  }

  if (token === '`') {
    return {type: 'quasiquote', value: read_quote(tstream)}
  }

  if (token === '~') {
    return {type: 'unquote', value: read_quote(tstream)}
  }

  if (token === '~@') {
    return {type: 'splice-unquote', value: read_quote(tstream)}
  }

  if (token === '@') {
    return {type: 'deref', value: read_quote(tstream)}
  }

  if (token === '^') {
    return {type: 'with-meta', value: read_metadata(tstream)}
  }

  return read_atom(tstream)

}

/**
 * Consume a tokenStream with its next token equal to '(', '[' or '{', and returns
 * an Array with all the elements that are inside the parenthesis/brackets.
 * @param tstream {Object}
 * @param close {String}
 * @returns {Array}
 */
function read_container(tstream, close) {
  var container = []

  // drop the ( parenthesis
  tstream.next()

  while (tstream.peek() !== close && !tstream.eof()) {
    container.push(read_form(tstream))
  }

  if (tstream.peek() !== close) {
    throw Error('expected ' + close + ' got EOF')
  }

  // drop the ) parenthesis
  tstream.next()
  return container
}

/**
 * Returns a number, boolean or symbol AST node depending on the value
 * of the tokenStream next token.
 * TODO: support for booleans, floats, variables
 * @param tstream {Object}
 * @returns {Object}
 */
function read_atom(tstream) {
  var atom = tstream.next()
  if (!isNaN(atom)) {
    return {type: 'number', value: parseInt(atom)}
  }

  if (atom === 'true') {
    return {type: 'boolean', value: true}
  }

  if (atom === 'false') {
    return {type: 'boolean', value: false}
  }

  if (atom[0] === '"' && atom[atom.length - 1] === '"')
    return {type: 'string', value: atom}

  return {type: 'symbol', value: atom}
}

/**
 * Consume a quote expression (from the tokenStream) and return a list with the first
 * element equal to "quote", "unquote", "quasiquote", "splice-unquote" or "deref" and
 * the second element equal to the evaluation of the tokenStream's next token.
 * @param tstream {Object}
 * @returns {Array}
 */
function read_quote(tstream) {
  // drop the ' from the tokenStream
  tstream.next()
  return read_form(tstream)
}

/**
 * Consume a metadata expression from the tokenStream and return a list with the
 * data and metadata elements.
 * @param tstream {Object}
 * @returns {Array}
 */
function read_metadata(tstream) {
  // drop the ^ from the tokenStream
  tstream.next()
  return [read_form(tstream), read_form(tstream)]
}

module.exports = {
  read_str: read_str,
  inputStream: inputStream,
  tokenStream: tokenStream
}

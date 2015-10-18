'use strict'

var R = require('ramda')

/**
 * Consume a MAL data structure (AST) and return a string representation of the
 * equivalent s-expression.
 * @param mal_ds
 * @returns {String}
 */
function pr_str (mal_ds) {
  // console.log(mal_ds)
  if (mal_ds.type === 'list' || mal_ds.type === 'vector' || mal_ds.type === 'hashmap') {
    return pr_list(mal_ds)
  }

  if ('quote quasiquote unquote splice-unquote deref'.indexOf(mal_ds.type) >= 0) {
    return pr_quote(mal_ds)
  }

  if (mal_ds.type === 'symbol') {
    return pr_symbol(mal_ds.value)
  }

  if (mal_ds.type === 'with-meta') {
    return pr_metadata(mal_ds)
  }

  if (mal_ds.type === 'boolean') {
    return mal_ds.value
  }

  if (mal_ds.type === 'closure') {
    return '#'
  }

  if (mal_ds.type === 'string') {
    return mal_ds.value
  }

  if (mal_ds.type === 'number') {
    return pr_number(mal_ds.value)
  }

  if (mal_ds.type === 'def') {
    return mal_ds.value
  }

  throw new Error('unrecognized AST node: ' + JSON.stringify(mal_ds))
}

/**
 * Consume a mal_ds Object and return a equivalent s-expression (string).
 * @param elem {Object}
 * @returns {String}
 */
function pr_list (elem) {
  if (elem.type === 'list') {
    return addPrefixSuffix('(', ')', R.join(' ', R.map(pr_str, elem.value)))
  }
  
  if (elem.type === 'vector') {
    return addPrefixSuffix('[', ']', R.join(' ', R.map(pr_str, elem.value)))
  }

  return addPrefixSuffix('{', '}', R.join(' ', R.map(pr_str, elem.value)))
}

/**
 * Consume a string and return a new string with an added prefix and suffix.
 * @param pre {string}
 * @param suf {string}
 * @param str {string}
 * @returns {string}
 */
function addPrefixSuffix (pre, suf, str) {
  return pre + str + suf
}

/**
 * Consume a quote Object and return its string representation.
 * @param elem
 * @returns {string}
 */
function pr_quote (elem) {
  return '(' + elem.type + ' ' + pr_str(elem.value) + ')'
}

/**
 * Consume a symbol (string) and return it.
 * @param elem
 * @returns {String}
 */
function pr_symbol (elem) {
  return elem
}

/**
 * Consume a number and return a string representation.
 * @param elem
 * @returns {String}
 */
function pr_number (elem) {
  return elem + ''
}

/**
 * Consume a metadata object and return its string representation.
 * @param elem
 * @returns {string}
 */
function pr_metadata (elem) {
  return '(' + elem.type + ' ' + pr_str(elem.value[1]) + ' ' + pr_str(elem.value[0]) + ')'
}

/**
 * Console.log wrapper to print results.
 */
var println = function () {
  console.log.apply(console, arguments)
}

module.exports = {
  pr_str: pr_str,
  println: println
}

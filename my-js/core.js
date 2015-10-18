'use strict'

var R = require('ramda')
var astNode = require('./ast').astNode

var slice = Array.prototype.slice

// {arguments} -> [arguments]
var sliceArguments = function () {
  return slice.call(arguments)
}

function add (a, b) { return a + b }
function sub (a, b) { return a - b }
function mul (a, b) { return a * b }
function div (a, b) { return a / b }
function mod (a, b) { return a % b }

// fn -> fn
// Consume a function fn and returns another function
// that consume an array and reduce the arguments
// using fn to a new mal_ds
function reduceMathFn (mathfn) {
  // [{mal_ds}] -> {mal_ds}
  return function closureMathFn (args) {
    var values = R.pluck('value', args)
    return astNode('number', R.reduce(mathfn, values[0], values.slice(1)))
  }
}

var ns = {
  '+': astNode('function', R.pipe(sliceArguments, reduceMathFn(add))),
  '-': astNode('function', R.pipe(sliceArguments, reduceMathFn(sub))),
  '*': astNode('function', R.pipe(sliceArguments, reduceMathFn(mul))),
  '/': astNode('function', R.pipe(sliceArguments, reduceMathFn(div))),
  '%': astNode('function', mod),
  'nil': astNode('string', 'nil'),
  list: astNode('function', R.pipe(sliceArguments, coreList))
}

// [mal_ds] -> mal_ds
// Consume a list of mal_ds (AST nodes) and return a new mal_ds of type 'list'
// with the input list as its value
// E.g. (list 1 2) -> (1 2)
function coreList (args) {
  return astNode('list', args)
}

module.exports = ns

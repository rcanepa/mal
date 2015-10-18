'use strict'

var R = require('ramda')
var astNode = require('./ast').astNode
var helpers = require('./helpers')
var getValue = helpers.getValue
var getFirst = helpers.getFirst
var getValueFromFirstNode = helpers.getValueFromFirstNode
var getTypeFromFirstNode = helpers.getTypeFromFirstNode
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
function lte (a, b) { return a <= b }
function lt (a, b) { return a < b }
function gte (a, b) { return a >= b }
function gt (a, b) { return a > b }

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

function binaryFn (fn, type) {
  return function closureBinaryFn (args) {
    var values = R.pluck('value', args).slice(0, 2)
    return astNode(type, fn.apply(this, values))
  }
}

var ns = {
  '+': astNode('function', R.pipe(sliceArguments, reduceMathFn(add))),
  '-': astNode('function', R.pipe(sliceArguments, reduceMathFn(sub))),
  '*': astNode('function', R.pipe(sliceArguments, reduceMathFn(mul))),
  '/': astNode('function', R.pipe(sliceArguments, reduceMathFn(div))),
  '%': astNode('function', R.pipe(sliceArguments, binaryFn(mod, 'number'))),
  '<=': astNode('function', R.pipe(sliceArguments, binaryFn(lte, 'boolean'))),
  '<': astNode('function', R.pipe(sliceArguments, binaryFn(lt, 'boolean'))),
  '>': astNode('function', R.pipe(sliceArguments, binaryFn(gt, 'boolean'))),
  '>=': astNode('function', R.pipe(sliceArguments, binaryFn(gte, 'boolean'))),
  'nil': astNode('string', 'nil'),
  list: astNode('function', R.pipe(sliceArguments, coreList)),
  'empty?': astNode('function', R.pipe(sliceArguments, isEmptyList)),
  'list?': astNode('function', R.pipe(sliceArguments, isList)),
  'count': astNode('function', R.pipe(sliceArguments, count))
}

// [mal_ds] -> mal_ds
// Consume a list of mal_ds (AST nodes) and return a new mal_ds of type 'list'
// with the input list as its value
// E.g. (list 1 2) -> (1 2)
function coreList (args) {
  return astNode('list', args)
}

// [mal_ds] -> mal_ds
// Consume a list of mal_ds (AST nodes) and returns true
// if the first element holds an empty list
function isEmptyList (mal_ds) {
  return astNode('boolean', getValueFromFirstNode(mal_ds).length === 0)
}

// [mal_ds] -> mal_ds
// Consume a list of mal_ds (AST nodes) and returns true
// if the first element has type equal to 'list'
function isList (mal_ds) {
  return astNode('boolean', getTypeFromFirstNode(mal_ds) === 'list')
}

// [mal_ds] -> mal_ds
// Consume a list of mal_ds (AST nodes) and returns the number of elements
// its hold
function count (mal_ds) {
  return astNode('number', getValueFromFirstNode(mal_ds).length)
}

module.exports = ns

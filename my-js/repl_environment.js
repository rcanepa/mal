'use strict'

var R = require('ramda')

var slice = Array.prototype.slice

var sliceArguments = function () {
  return slice.call(arguments)
}

function add (a, b) { return a + b }
function sub (a, b) { return a - b }
function mul (a, b) { return a * b }
function div (a, b) { return a / b }
function mod (a, b) { return a % b }

function minus (args) {
  return R.reduce(sub, args[0], args.slice(1))
}

function multiplicate (args) {
  return R.reduce(mul, args[0], args.slice(1))
}

function divide (args) {
  return R.reduce(div, args[0], args.slice(1))
}

var env = {
  '+': R.pipe(sliceArguments, R.reduce(add, 0)),
  '-': R.pipe(sliceArguments, minus),
  '*': R.pipe(sliceArguments, multiplicate),
  '/': R.pipe(sliceArguments, divide),
  '%': mod 
}

module.exports = env

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

function reduceMathFn (mathfn) {
  return function (args) { 
    return R.reduce(mathfn, args[0], args.slice(1))
  }
}

var env = {
  '+': R.pipe(sliceArguments, reduceMathFn(add)),
  '-': R.pipe(sliceArguments, reduceMathFn(sub)),
  '*': R.pipe(sliceArguments, reduceMathFn(mul)),
  '/': R.pipe(sliceArguments, reduceMathFn(div)),
  '%': mod 
}

module.exports = env

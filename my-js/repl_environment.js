/*
 * Set the parent REPL's environment
 */

'use strict'

var R = require('ramda')
var env = require('./env')

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

var replEnv = env(null)
replEnv.set('+', R.pipe(sliceArguments, reduceMathFn(add)))
replEnv.set('-', R.pipe(sliceArguments, reduceMathFn(sub)))
replEnv.set('*', R.pipe(sliceArguments, reduceMathFn(mul)))
replEnv.set('/', R.pipe(sliceArguments, reduceMathFn(div)))
replEnv.set('%', mod)

module.exports = replEnv

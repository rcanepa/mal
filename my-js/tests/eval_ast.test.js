'use strict'

var test = require('tape')
var malEval = require('../eval_ast').malEval
var malEnv = require('../repl_environment')

test('testing a number', function (assert) {

  var number = { type: 'number', value: 21 } 
  assert.ok(malEval !== undefined)
  assert.equal(malEval(malEnv, number), 21)
  assert.end()

})

test('testing a list', function (assert) {

  var list = { 
    type: 'list',
    value:  [ 
      { type: 'symbol', value: '+' },
      { type: 'number', value: 3 },
      { type: 'number', value: 21 } 
    ] 
  }
  assert.ok(malEval !== undefined)
  assert.equal(malEval(malEnv, list), 24)
  assert.end()

})

test('testing a vector', function (assert) {

  var vector = { 
    type: 'vector',
    value:  [ 
      { type: 'number', value: 3 },
      { type: 'number', value: 21 } 
    ] 
  }
  assert.ok(malEval !== undefined)
  assert.equal(malEval(malEnv, vector), '[3 21]')
  assert.end()

})

test('testing a hashmap', function (assert) {

  var hashmap = { 
    type: 'hashmap',
    value:  [ 
      { type: 'symbol', value: "a" },
      { type: 'number', value: 21 } 
    ] 
  }
  assert.ok(malEval !== undefined)
  assert.equal(malEval(malEnv, hashmap), '{a 21}')
  assert.end()

})


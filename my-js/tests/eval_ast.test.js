'use strict'

var test = require('tape')
var malEval = require('../eval_ast').malEval
var malCore = require('../core')
var envFactory = require('../env').env
var copyExtendEnv = require('../env').copyExtendEnv
var malEnv = copyExtendEnv(envFactory(null), malCore)

test('testing a number', function (assert) {
  var number = { type: 'number', value: 21 } 
  assert.ok(malEval !== undefined)
  assert.equal(malEval(malEnv, number), number)
  assert.end()
})

test('testing booleans and nil', function (assert) {
  var nil = { type: 'string', value: 'nil' } 
  var _true = { type: 'boolean', value: true } 
  var _false = { type: 'boolean', value: false } 
  assert.equal(malEval(malEnv, nil), nil)
  assert.equal(malEval(malEnv, _true), _true)
  assert.equal(malEval(malEnv, _false), _false)
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
  assert.deepEqual(
    malEval(malEnv, list),
    { type: 'number', value: 24 },
    'it should reduce the list to a number AST node'
  )
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
  assert.deepEqual(
    malEval(malEnv, vector), 
    vector,
    'it should return the same vector AST node'
  )
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
  assert.deepEqual(
    malEval(malEnv, hashmap),            
    { type: 'hashmap', value: [{ type: 'symbol', value: 'a' }, { type: 'number', value: 21 }] },
    'it should return a hashmap AST node with its values (nodes) inverted'
  )
  assert.end()
})

test('testing do special form', function (assert) {
  // (do (def! a 6) 7 (+ a 8))
  var dosf = { 
    type: 'list',
    value:  [ 
      { type: 'symbol', value: "do" },
      { type: 'list', value: [
        { type: 'symbol', value: 'def!' },
        { type: 'symbol', value: 'a' },
        { type: 'number', value: 6 }
      ]},
      { type: 'number', value: 7 },
      { type: 'list', value: [
        { type: 'symbol', value: '+' },
        { type: 'symbol', value: 'a' },
        { type: 'number', value: 8 }
      ]}
    ] 
  }
  assert.deepEqual(
    malEval(malEnv, dosf),
    { type: 'number', value: 14 }, 
    'it should return the result of the last expressions (a number AST node)'
  )
  assert.end()
})

test('testing if special form', function (assert) {
  var ifsf1 = { 
    type: 'list',
    value:  [ 
      { type: 'symbol', value: "if" },
      { type: 'boolean', value: true },
      { type: 'number', value: 10 },
      { type: 'number', value: 20 }
    ] 
  }
  var ifsf2 = { 
    type: 'list',
    value:  [ 
      { type: 'symbol', value: "if" },
      { type: 'boolean', value: false },
      { type: 'number', value: 10 },
      { type: 'number', value: 20 }
    ] 
  }
  assert.deepEqual(
    malEval(malEnv, ifsf1),
    { type: 'number', value: 10 },
    'it should execute the true expression'
  )
  assert.deepEqual(
    malEval(malEnv, ifsf2),
    { type: 'number', value: 20 },
    'it should execute the false expression'
  )
  assert.end()
})


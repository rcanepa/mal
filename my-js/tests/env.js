'use strict'

var test = require('tape')
var R = require('ramda')
var env = require('../env').env
var copyExtendEnv = require ('../env').copyExtendEnv

test('env returns a function', function (assert) {
  assert.ok(typeof env === 'function')
  assert.end()
})

test('environment with null parent', function (assert) {
  
  var e = env(null)
  e.set('+', 'sum')
  e.set('-', 'minus')
  
  assert.equal(e.find('+'), e, 'it should return itself')
  assert.equal(e.find('*'), null, 'it should return null (key not found)')
  assert.equal(e.get('+'), 'sum', 'it should return the value')
  assert.throws(function () { return e.get('*') }, 'it should throw an error')
  assert.end()
})

test('environment with outer/parent environment', function (assert) {

  var outer = env(null)
  outer.set('+', 'sum')
  outer.set('-', 'minus')

  var e = env(outer)
  assert.ok(JSON.stringify(e.data) !== JSON.stringify(outer.data), 'environments should be differents')
  assert.equal(e.find('+'), outer, 'it should return the outer environment')
  assert.equal(e.find('*'), null, 'it should return null')
  assert.equal(e.get('+'), 'sum', 'it should return the string sum')
  assert.equal(e.get('-'), 'minus', 'it should return the string minus')
  assert.throws(function () { return e.get('*') }, 'it should throw an error')
  assert.end()
})

test('environment with two level of depth', function (assert) {

  var gpe = env(null)
  gpe.set('+', 'sum')
  var pe = env(gpe)  
  pe.set('-', 'minus')
  var e = env(pe)
  assert.ok(JSON.stringify(gpe.data) !== JSON.stringify(pe.data), 'environments should be differents')
  assert.ok(JSON.stringify(pe.data) !== JSON.stringify(e.data), 'environments should be differents')
  assert.equal(e.find('+'), gpe, 'it should return the most outer environment')
  assert.equal(e.find('-'), pe, 'it should return the outer environment')
  assert.equal(e.find('*'), null, 'it should return null')
  assert.equal(e.get('+'), 'sum', 'it should return the string sum')
  assert.equal(e.get('-'), 'minus', 'it should return the string minus')
  assert.throws(function () { return e.get('*') }, 'it should throw an error')
  assert.end()
})

test('environment with outer/parent environment and initial bindings', function (assert) {

  var bindings = ['a', 'b']
  var expressions = [4, '(+ 1 2)']
  var outer = env(null, bindings, expressions)
  outer.set('+', 'sum')
  outer.set('-', 'minus')

  var e = env(outer)

  assert.ok(JSON.stringify(e.data) !== JSON.stringify(outer.data), 'environments should be differents')
  assert.equal(e.find('+'), outer, 'it should return the outer environment')
  assert.equal(e.find('*'), null, 'it should return null')
  assert.equal(outer.find('a'), outer, 'it should return itself')
  assert.equal(e.get('a'), 4, 'it should return a value from the parent env')
  assert.equal(e.find('a'), outer, 'it should return the parent env (outer)')
  assert.equal(e.get('b'), '(+ 1 2)', 'it should return a value from the parent env')
  assert.equal(e.get('+'), 'sum', 'it should return the string sum')
  assert.equal(e.get('-'), 'minus', 'it should return the string minus')
  assert.throws(function () { return e.get('*') }, 'it should throw an error')
  assert.end()
})

test('environment with undefined bindings', function (assert) {
  var bindings = ['a', 'b']
  var e = env(null, bindings)
  assert.equal(e.find('a'), e, 'it should return itself')
  assert.equal(e.find('b'), e, 'it should return itself')
  assert.equal(e.find('*'), null, 'it should return null')
  assert.equal(e.get('a'), undefined, 'it should return undefined')
  assert.equal(e.get('b'), undefined, 'it should return undefined')
  assert.throws(function () { return e.get('*') }, 'it should throw an error')
  assert.end()
})

test('environment copyExtendEnv function', function (assert) {
  var bindings = ['a', 'b']
  var expressions = [4, '(+ 1 2)']
  var outer = env(null, bindings, expressions)
  outer.set('+', 'sum')
  outer.set('-', 'minus')
  var e = env(outer)
  e.set('xyz', 100)
  var extendedEnv1 = copyExtendEnv(e, { foo: 'bar' })
  var extendedEnv2 = copyExtendEnv(e)

  assert.notEqual(extendedEnv1, e, 'cloned env1 should not be equal to the original one')
  assert.notEqual(extendedEnv2, e, 'cloned env2 should not be equal to the original one')
  assert.equal(e.find('foo'), null, 'it should not find the key (return null)')
  assert.equal(extendedEnv1.find('foo'), extendedEnv1, 'it should return itself')
  assert.equal(extendedEnv2.find('foo'), null, 'it should return null')
  assert.equal(extendedEnv2.find('xyz'), extendedEnv2, 'it should return itself')
  assert.equal(extendedEnv1.find('a'), outer, 'it should return the outer env')
  assert.equal(extendedEnv2.find('b'), outer, 'it should return the outer env')
  assert.throws(function () { return extendedEnv2.get('foo') }, 'it should throw an error')
  assert.end()
})

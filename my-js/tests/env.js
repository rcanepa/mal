'use strict'

var test = require('tape')
var env = require('../env')

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

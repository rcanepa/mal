'use strict'

var test = require('tape')
var type = require('../type')

test('check all types', function (assert) {
  assert.equal(type({}), 'Object', 'it should return Object')
  assert.equal(type([]), 'Array', 'it should return Array')
  assert.equal(type(true), 'Boolean', 'it should return Boolean')
  assert.equal(type(false), 'Boolean', 'it should return Boolean')
  assert.equal(type(10), 'Number', 'it should return Number')
  assert.equal(type(10.1), 'Number', 'it should return Number')
  assert.equal(type(""), 'String', 'it should return String')
  assert.equal(type(null), 'Null', 'it should return Null')
  assert.equal(type(undefined), 'Undefined', 'it should return Undefined')
  assert.equal(type(function fn () {}), 'Function', 'it should return Function')
  assert.end()
})

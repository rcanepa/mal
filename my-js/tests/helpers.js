'use strict'

var test = require('tape')
var _h = require('../helpers')

test('getProp helper', function (assert) {
  var getValue = _h.getProp('value')
  var getType = _h.getProp('type')
  var obj = { type: 'number', value: 100 }
  var emptyObj = {}
  assert.equal(getValue(obj), 100, 'it should return the value property (100)')
  assert.equal(getType(obj), 'number', 'it should return the type property')
  assert.equal(getValue(emptyObj), undefined, 'it should return undefined upon an object without the property')
  assert.end()
})

test('getNth, getFirst, getSecond and getThird helpers', function (assert) {
  var getFirst = _h.getFirst
  var getSecond = _h.getSecond
  var getThird = _h.getThird
  assert.equal(typeof _h.getNth(0), 'function', 'it should return a curried function')
  assert.equal(_h.getNth(0)([1, 2, 3]), 1, 'it should return the first element (1)')
  assert.equal(getFirst([1, 2, 3]), 1, 'it should return the first element')
  assert.equal(getFirst([]), undefined, 'it should return undefined upon an empty array')
  assert.equal(getSecond([1, 2, 3, 4]), 2, 'it should return the second element (2)')
  assert.equal(getThird([1, 2, 3, 4]), 3, 'it should return the third element (3)')
  assert.end()
})

test('combination between getProp and getNth', function (assert) {
  var o = [{ type: 'foo', value: 100 }, { type: 'bar', value: 33 }, { type: 'abc', value: 77 }]
  assert.equal(_h.getTypeFromFirstNode(o), 'foo', 'it should return the type property of the first element')
  assert.equal(_h.getValueFromFirstNode(o), 100, 'it should return the value property of the first element')
  assert.equal(_h.getValueFromSecondNode(o), 33, 'it should return the value property of the second element')
  assert.equal(_h.getValueFromThirdNode(o), 77, 'it should return the value property of the third element')
  assert.end()
})

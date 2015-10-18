'use strict'

var test = require('tape')
var getProp = require('../helpers').getProp
var getNth = require('../helpers').getNth

test('getProp helper', function (assert) {
  var getValue = getProp('value')
  var getType = getProp('type')
  var obj = { type: 'number', value: 100 }
  var emptyObj = {}
  assert.equal(getValue(obj), 100, 'it should return the value property (100)')
  assert.equal(getType(obj), 'number', 'it should return the type property')
  assert.equal(getValue(emptyObj), undefined, 'it should return undefined upon an object without the property')
  assert.end()
})

test('getNth helper', function (assert) {
  var getFirst = getNth(0)
  var getSecond = getNth(1)
  var getThird = getNth(2)
  
  assert.equal(getFirst([1, 2, 3]), 1, 'it should return the first element')
  assert.equal(getFirst([]), undefined, 'it should return undefined upon an empty array')
  assert.equal(getSecond([1, 2, 3, 4]), 2, 'it should return the second element (2)')
  assert.equal(getThird([1, 2, 3, 4]), 3, 'it should return the third element (3)')
  assert.end()
})

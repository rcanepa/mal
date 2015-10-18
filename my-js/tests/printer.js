'use strict'

var test = require('tape')
var print = require('../printer').pr_str

test('Basic testing', function (assert) {

  assert.ok(print !== undefined, 'printer load successfully')
  assert.equal(print({ type: 'number', value: 1}), '1', 'it should print a number')
  assert.equal(print({ type: 'symbol', value: '"abc"'}), '"abc"', 'it should print a string')
  assert.equal(print({ type: 'list', value: [{ type: 'number', value: 10}, { type: 'number', value: 20}]}), '(10 20)', 'it should print a string')
  assert.equal(print({ type: 'closure' }), '#', 'it should print #')
  assert.end()
})

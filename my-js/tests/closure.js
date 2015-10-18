'use strict'

var test = require('tape')
var closure = require('../closure')

test('', function (assert) {

  var env = { 'a': 10 }
  var args = { type: 'list', value: [
    { type: 'symbol', value: 'x' },
    { type: 'number', value: 5 }
  ]}
  var body = { type: 'symbol', value: 'x' }
  var c = closure(env, body, args)

  assert.ok(c.type === 'closure', 'it should confirm that its type is closure')
  assert.equal(c.env, env, 'it should return the env')
  assert.equal(c.getArgs(), args, 'it should return the args')
  assert.equal(c.getBody(), body, 'it should return the body')
  assert.equal(c.body, undefined, 'it should return undefined')
  assert.end()
})

'use strict'

var test = require('tape')
var astNode = require('../ast').astNode

test('', function (assert) {
  var node1 = astNode('Number', 10)
  var node2 = astNode('String', "abc")
  assert.deepEqual(node1, {type:'Number', value:10}, 'it should have a type and value properties')
  assert.deepEqual(node2, {type:'String', value:"abc"}, 'it should have a type and value properties')
  assert.end()
})

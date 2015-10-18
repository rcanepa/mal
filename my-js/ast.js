'use strict'

var R = require('ramda')
var type = require('./type')

function astNode (type, value) {
  return {
    type: type,
    value: value
  }
}

module.exports = {
  astNode: astNode
}

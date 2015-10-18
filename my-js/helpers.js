'use strict'

var R = require('ramda')

// Number -> Function
// Returns a function that expects an array and
// returns the value of the n element of the array
function getNth (n) {
  return function (array) {
    return array[n]
  }
}

// String -> Function
// Returns a function that expects an object and
// returns the value of the property of that object
function getProp (property) {
  return function (obj) {
    return obj[property]
  }
}

var getFirst = getNth(0)
var getSecond = getNth(1)
var getThird = getNth(2)
var getType = getProp('type')
var getValue = getProp('value')

// [{mal_ds}, ..., {mal_ds}] -> string
// get the type property from the first element of a list of AST nodes 
var getTypeFromFirstNode = R.pipe(getFirst, getType)

// [{mal_ds}, ..., {mal_ds}] -> *
// get the value property from the first element of a list of AST nodes
var getValueFromFirstNode = R.pipe(getFirst, getValue)

// [{mal_ds}, ..., {mal_ds}] -> *
// get the value property from the second element of a list of AST nodes 
var getValueFromSecondNode = R.pipe(getSecond, getValue)

// [{mal_ds}, ..., {mal_ds}] -> *
// get the value property from the third element of a list of AST nodes 
var getValueFromThirdNode = R.pipe(getThird, getValue)

module.exports = {
  getNth: getNth,
  getProp: getProp,
  getType: getType,
  getValue: getValue,
  getFirst: getFirst,
  getSecond: getSecond,
  getThird: getThird,
  getTypeFromFirstNode: getTypeFromFirstNode,
  getValueFromFirstNode: getValueFromFirstNode,
  getValueFromSecondNode: getValueFromSecondNode,
  getValueFromThirdNode: getValueFromThirdNode
}

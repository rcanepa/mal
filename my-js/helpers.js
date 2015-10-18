'use strict'

function getNth (n) {
  return function (array) {
    return array[n]
  }
}

function getProp (property) {
  return function (obj) {
    return obj[property]
  }
}

module.exports = {
  getNth: getNth,
  getProp: getProp
}

'use strict'

var env = function (outer) {
  var data = {}

  return {
    set: set,
    find: find,
    get: get,
    data: data
  }

  function set (key, value) {
    data[key] = value
  }

  function find (key) {
    if (data[key] !== undefined) {
      return this
    }
    else if (outer !== null) {
      return outer.find(key)
    }
    else {
      return null
      // throw new Error('symbol/key ' + key + ' is undefined')
    }
  }

  function get (key) {
    var envHolder = this.find(key)
    if (envHolder !== null) {
      return envHolder.data[key]
    }
    else {
      throw new Error('symbol ' + key + ' not found')
    }
  }
}

module.exports = env

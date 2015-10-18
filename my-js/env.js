'use strict'

var R = require('ramda')

var env = function (outer, binds, exprs) {
  var data = {}
  if (binds !== undefined) {
    if (exprs === undefined) {
      data = R.zipObj(binds, new Array(binds.length))
    }
    else {
      data = R.zipObj(binds, exprs)
    }
  }

  return {
    set: set,
    find: find,
    get: get,
    data: data,
    getOuterEnv: getOuterEnv
  }

  function set (key, value) {
    data[key] = value
  }

  function find (key) {
    if (data.hasOwnProperty(key)) {
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

  function getOuterEnv () {
    return outer
  }
}

// {env} {bindings} -> {env}
function copyExtendEnv (srcEnv, srcBindings) {
  var newEnv = env(srcEnv.getOuterEnv())
  var newBindings = Object.assign({}, srcEnv.data, srcBindings)
  Object.keys(newBindings).forEach(function (key, index, array) {
    newEnv.set(key, newBindings[key])
  })
  return newEnv
}

module.exports = {
  env: env,
  copyExtendEnv: copyExtendEnv
}

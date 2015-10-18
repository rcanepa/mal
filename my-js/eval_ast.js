'use strict'

var R = require('ramda')
var envFactory = require('./env').env
var closureFactory = require('./closure')
var astNode = require('./ast').astNode
var getFirst = require('./helpers').getNth(0)
var getSecond = require('./helpers').getNth(1)
var getThird = require('./helpers').getNth(2)
var getType = require('./helpers').getProp('type')
var getValue = require('./helpers').getProp('value')

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


function malEval (env, mal_ds) {
  if (getType(mal_ds) === 'list') {
   
    /*  Example of a list AST node:
     *
     *  { type: 'list',
     *    value: [          <- list of AST nodes
     *      { 
     *        type: 'xyz',  <- type from the first element of value 
     *        value: 'abc'  <- value from the first element of value
     *      },
     *      {
     *        type: 'xyz'   <- type from the second element of value
     *        value: 'abc'  <- value from the second element of value
     *      }
     *    ]
     *  }
     */

    var nodes = getValue(mal_ds)
    
    if (getValueFromFirstNode(nodes) === 'def!') {
      env.set(getValueFromSecondNode(nodes), malEval(env, getThird(nodes)))
      return astNode('def', getValueFromSecondNode(nodes))
    }
    
    if (getValueFromFirstNode(nodes) === 'let*') {
      var letEnv = createLetEnvBindings(env, malEval, getValueFromSecondNode(nodes))
      var expression = getThird(nodes)
      return malEval(letEnv, expression)
    }

    if (getValueFromFirstNode(nodes) === 'do') {
      return R.map(R.curry(malEval)(env), nodes.slice(1)).pop()
    }

    if (getValueFromFirstNode(nodes) === 'if') {
      if (getValue(malEval(env, mal_ds.value[1]))) {
        return malEval(env, mal_ds.value[2])
      }
      else {
        return malEval(env, mal_ds.value[3])
      }
    }

    if (getValueFromFirstNode(nodes) === 'fn*') {
      return closureFactory(
        envFactory(env, mal_ds.value[1].value), 
        mal_ds.value[2], 
        R.pluck('value', mal_ds.value[1].value)
      )
    }

    var evaluatedNodes = evalAST(env, mal_ds)

    /* evaluatedNodes should have an structure like this:
     * { 
     *    type: 'function' | 'closure'
     *    value: [
     *      {*},
     *      {*}
     *    ]
     * }
     */

    console.log(evaluatedNodes)
    if (getTypeFromFirstNode(evaluatedNodes) === 'function') {
      return getValueFromFirstNode(evaluatedNodes).apply(env, evaluatedNodes.slice(1))
    }

    if (getTypeFromFirstNode(evaluatedNodes) === 'closure') {
      var closure = getFirst(evaluatedNodes)
      var args = evaluatedNodes.slice(1)
      if (closure.getArgs().length !== args.length) {
        throw new Error(
          'the function was expecting ' + 
          closure.getArgs().length + 
          ' and instead got ' + args.length
        )
      }
      closure.getArgs().forEach(function (e, i, a) {
        console.log('closure binding:', e, args[i])
        closure.env.set(e, args[i])
      })
      return malEval(closure.env, closure.getBody())
    }
    
    throw new Error('trying to execute something different than a function, you must provide a function')
  }
  return evalAST(env, mal_ds)
}

function evalAST (env, mal_ds) {
  console.log('evalAST: ', mal_ds)
  if (getType(mal_ds) === 'list') {
    return evalList(R.curry(malEval)(env), mal_ds)
  }
  
  if (getType(mal_ds) === 'vector') {
    return astNode('vector', evalVector(R.curry(malEval)(env), mal_ds))
  }

  if (getType(mal_ds) === 'hashmap') {
    return astNode('hashmap', evalHashmap(R.curry(malEval)(env), mal_ds))
  }

  if (getType(mal_ds) === 'symbol') {
    return env.get(getValue(mal_ds))
  }
  
  // numbers, booleans, strings and nil
  return mal_ds
}

// malEvalFn (curried with env) mal_ds (list) -> [mal_ds]
function evalList (malEvalFn, mal_ds) {
  return R.map(malEvalFn, mal_ds.value)
}

// malEvalFn (curried with env) mal_ds (vector) -> [mal_ds]
function evalVector (malEvalFn, mal_ds) {
  return R.map(malEvalFn, mal_ds.value)
}

// malEvalFn (curried with env) mal_ds (hashmap) -> [symbol, mal_ds]
function evalHashmap (malEvalFn, mal_ds) {
  return [mal_ds.value[0], malEvalFn(mal_ds.value[1])]
}

// env fn [symbol exp] -> env
function createLetEnvBindings (outerEnv, evalASTfn, bindings) {
  var letEnv = envFactory(outerEnv)
  while (bindings.length > 0) {
    var key = bindings.shift().value
    var value = bindings.shift()
    letEnv.set(key, evalASTfn(letEnv, value))
  }
  return letEnv
}

// string -> boolean
// returns true if str is equal to 'true' or 'false'
function isBoolean (str) {
  return str === 'true' || str === 'false'
}

// string -> bolean
// returns true if str is equal to 'nil'
function isNil (str) {
  return str === 'nil'
}

module.exports = {
  malEval: malEval
}

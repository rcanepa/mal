'use strict'

var R = require('ramda')
var envFactory = require('./env')

function malEval (env, mal_ds) {
  if (mal_ds.type === 'list') {
    
    if (mal_ds.value[0].value === 'def!') {
      env.set(mal_ds.value[1].value, malEval(env, mal_ds.value[2]))
      return env.get(mal_ds.value[1].value)
    }
    
    if (mal_ds.value[0].value === 'let*') {
      var letEnv = createLetEnvBindings(env, malEval, mal_ds.value[1].value)
      var expression = mal_ds.value[2]
      return malEval(letEnv, expression)
    }
    
    else {
      var lst_eval = evalAST(env, mal_ds)
      return lst_eval[0].apply(env, lst_eval.slice(1))
    } 
  }
  return evalAST(env, mal_ds)
}

function evalAST (env, mal_ds) {
  if (mal_ds.type === 'symbol') {
      return env.get(mal_ds.value)
  }
  
  if (mal_ds.type === 'list') {
    return evalList(R.curry(malEval)(env), mal_ds)
  }
  
  if (mal_ds.type === 'vector') {
    return evalVector(R.curry(malEval)(env), mal_ds)
  }

  if (mal_ds.type === 'hashmap') {
    return evalHashmap(R.curry(malEval)(env), mal_ds)
  }
  
  return mal_ds.value
}

// malEvalFn (curried with env) mal_ds (list) -> value
function evalList (malEvalFn, mal_ds) {
  return R.map(malEvalFn, mal_ds.value)
}

// malEvalFn (curried with env) mal_ds (vector) -> string
function evalVector (malEvalFn, mal_ds) {
  return '[' + R.map(malEvalFn, mal_ds.value).join(' ') + ']'
}

// malEvalFn (curried with env) mal_ds (hashmap) -> string
function evalHashmap (malEvalFn, mal_ds) {
  return '{' + mal_ds.value[0].value + ' ' + malEvalFn(mal_ds.value[1]) + '}'
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

module.exports = {
  malEval: malEval
}

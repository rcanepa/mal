'use strict'

var map = require('./utils/map')

function mal_eval (mal_ds, env) {
  if (mal_ds.type === 'list') {
    var lst_eval = eval_ast(mal_ds, env)
    var fn = lst_eval[0]
    var args = lst_eval.slice(1)
    return fn.apply(env, args)
  }
  return eval_ast(mal_ds, env)
}

function eval_ast (mal_ds, env) {
  if (mal_ds.type === 'symbol') {
    if (env[mal_ds.value] !== undefined) {
      return env[mal_ds.value]   
    }
    else {
      throw new Error('unrecognized symbol:', mal_ds.value)
    }
  }
  else if (mal_ds.type === 'list') {
    var lst = []
    mal_ds.value.forEach(function (elem, idx, arr) {
      lst.push(mal_eval(elem, env))
    })
    return lst
  }
  else {
    return mal_ds.value
  }
}

module.exports = {
  mal_eval: mal_eval,
  eval_ast: eval_ast
}

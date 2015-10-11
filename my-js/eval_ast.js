'use strict'

function mal_eval (str, env) {
  if (Object.prototype.toString.call(str) === '[object Array]') {
    var lst_eval = eval_ast(str, env)
    var fn = lst_eval[0]
    var args = lst_eval.slice(1)
    return fn.apply(env, args)
  }
  return eval_ast(str, env)
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
    return null
  }
}

module.exports = {
  eval_ast: eval_ast
}

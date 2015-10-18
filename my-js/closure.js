'use strict'

function closure (env, body, args) {
  
  var _body = body
  var _args = args
  var type = 'closure'

  return {
    env: env,
    type: type,
    getBody: getBody,
    getArgs: getArgs
  }  

  function getBody () {
    return _body
  }

  function getArgs () {
    return _args
  }

}

module.exports = closure

'use strict'

var printer = require('./printer')
var reader = require('./reader')
var eval_ast = require('./eval_ast').eval_ast
var mal_eval = require('./eval_ast').mal_eval
var repl_env = require('./repl_environment')

function READ (str) {
  return reader.read_str(str)
}

function PRINT (str) {
  return printer.pr_str(str)
}

function REP (str, env) {
  return mal_eval(READ(str), env)
}

/*
 * Execute this piece of code only if this file was not 
 * required by another file.
 */
if (require.main === module) {

  var readline = require('readline')

  var rli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  rli.setPrompt('user> ')
  rli.prompt()

  rli.on('line', function (data) {
    try {
      printer.println(REP(data, repl_env))
    }
    catch (err) {
      if (err.stack) {
        printer.println(err.stack)
      }
      else {
        printer.println(err)
      }
    }
    rli.prompt()
  }).on('close', function () {
    process.exit(0)
  });
}

module.exports = {
  REP: REP
}

'use strict'

function READ (str) {
  return str
}

function EVAL (str) {
  return str
}

function PRINT (str) {
  return str
}

function REP (str) {
  return PRINT(EVAL(READ(str)))
}

var readline = require('readline')

var rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

rli.setPrompt('user> ')
rli.prompt()

rli.on('line', function (data) {
  console.log(REP(data))
  rli.prompt()
})
  .on('close', function () {
    process.exit(0)
  })

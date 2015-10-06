'use strict';

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

var readline = require('readline');

var rli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rli.setPrompt('user> ');
rli.prompt();

rli.on('line', function (data) {
  console.log(REP(data));
  rli.prompt()
}).on('close', function () {
  process.exit(0)
});

/*
process.stdin.setEncoding('utf8')
process.stdout.write('user> ')
process.stdin.setRawMode(true)

process.stdin.on('data', function (data) {
  switch (data) {
    case '\u001b[A':
      // Up
      break
    case '\u001b[B':
      // Down
      break
    case '\u001b[C':
      // Right
      break
    case '\u001b[D':
      // Left
      break
    case '\u0003':
      process.exit()
      break
    default:
      process.stdout.write(REP(data + '\n'))
      process.stdout.write('user> ')
      break
  }
})

process.stdin.on('end', function () {
  process.stdout.write('end')
})
*/

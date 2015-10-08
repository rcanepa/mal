'use strict';

var printer = require('./printer');
var reader = require('./reader');

function READ (str) {
  return reader.read_str(str);
}

function EVAL (str) {
  return str;
}

function PRINT (str) {
  return printer.pr_str(str);
}

function REP (str) {
  return PRINT(EVAL(READ(str)));
}

/*
Execute this piece of code only if this file was not required
by another file.
 */
if (require.main === module) {

  var readline = require('readline');

  var rli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rli.setPrompt('user> ');
  rli.prompt();

  rli.on('line', function (data) {
    try {
      printer.println(REP(data));
    }
    catch (exc) {
      if (exc.stack) {
        printer.println(exc.stack);
      }
      else {
        printer.println(exc);
      }
    }
    rli.prompt()
  }).on('close', function () {
    process.exit(0);
  });
}

module.exports = {
  REP: REP
};

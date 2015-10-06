var printer = require('../printer');

var ast = ['+', 1, 2];
var sexp = printer.pr_str(ast);
console.log(sexp);

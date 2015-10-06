var reader = require('./../reader');

var sexp = "'1";
var ast = reader.read_str(sexp);
console.log(ast);

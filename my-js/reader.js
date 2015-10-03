/**
 * Reg exp helper:
 * [\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)
 * https://regex101.com
 */
function read_str (sexp) {
  return sexp
}

/**
 * Consume a s-expression and transform it to an array/list
 * of tokens.
 * TODO: implement a function that match a open parenthesis.
 */
function tokenizer (sexp) {
  return sexp
}

function read_list () {

}

function read_atom () {

}

function read_form () {

}

module.exports = {
  read_str: read_str
}

/**
 * Consume a MAL data structure (AST) and return a string representation of the
 * equivalent s-expression.
 * @param mal_ds
 * @returns {String}
 */
function pr_str(mal_ds) {

  if (mal_ds.type === 'list' || mal_ds.type === 'vector' || mal_ds.type === 'hashmap') {
    return pr_list(mal_ds);
  }

  if ('quote quasiquote unquote splice-unquote deref'.indexOf(mal_ds.type) >= 0) {
    return pr_quote(mal_ds);
  }

  if (mal_ds.type === 'symbol') {
    return pr_symbol(mal_ds.value);
  }

  if (mal_ds.type === 'with-meta') {
    return pr_metadata(mal_ds);
  }

  return pr_number(mal_ds.value);
}

/**
 * Consume a mal_ds Object and return a equivalent s-expression (string).
 * @param elem {Object}
 * @returns {String}
 */
function pr_list(elem) {
  var opener = '', values = '', sexp = '';

  if (elem.type === 'list') {
    opener += '(';
  }
  else if (elem.type === 'vector') {
    opener += '[';
  }
  else {
    opener += '{';
  }

  elem.value.forEach(function(element, index, array) {
    values += pr_str(element) + ' ';
  });

  sexp += opener + values;
  sexp = sexp.trim();

  if (elem.type === 'list') {
    sexp += ')';
  }
  else if (elem.type === 'vector'){
    sexp += ']';
  }
  else {
    sexp += '}';
  }

  return sexp;
}

/**
 * Consume a quote Object and return its string representation.
 * @param elem
 * @returns {string}
 */
function pr_quote(elem) {
  return '(' + elem.type + ' ' + pr_str(elem.value) + ')';
}

/**
 * Consume a symbol (string) and return it.
 * @param elem
 * @returns {String}
 */
function pr_symbol(elem) {
  return elem;
}

/**
 * Consume a number and return a string representation.
 * @param elem
 * @returns {String}
 */
function pr_number(elem) {
  return elem + '';
}

/**
 * Consume a metadata object and return its string representation.
 * @param elem
 * @returns {string}
 */
function pr_metadata(elem) {
  return '(' + elem.type + ' ' + pr_str(elem.value[1]) + ' ' + pr_str(elem.value[0]) + ')';
}

/**
 * Console.log wrapper to print results.
 */
var println = function () {
  console.log.apply(console, arguments);
};

module.exports = {
  pr_str: pr_str,
  println: println
};

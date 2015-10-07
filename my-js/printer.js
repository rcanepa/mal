/**
 * Consume a MAL data structure (AST) and return a string representation of the
 * equivalent s-expression.
 * @param mal_ds
 * @returns {String}
 */
function pr_str(mal_ds) {
  // console.log('From printer:', mal_ds);

  if (mal_ds.type === 'list' || mal_ds.type === 'vector') {
    return pr_list(mal_ds);
  }

  if ('quote quasiquote unquote splice-unquote'.indexOf(mal_ds.type) >= 0) {
    return pr_quote(mal_ds);
  }

  if (mal_ds.type === 'symbol') {
    return pr_symbol(mal_ds.value);
  }

  return pr_number(mal_ds.value);
}

/**
 *  Consume a mal_ds Object and return a equivalent s-expression (string).
 * @param elem {Object}
 * @returns {String}
 */
function pr_list(elem) {
  var opener = '', values = '', sexp = '';

  elem.type === 'list' ? opener += '(' : opener += '[';

  elem.value.forEach(function(element, index, array) {
    values += pr_str(element) + ' ';
  });

  sexp += opener + values;
  sexp = sexp.trim();
  (elem.type === 'list') ? sexp += ')' : sexp += ']';

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

module.exports = {
  pr_str: pr_str
};

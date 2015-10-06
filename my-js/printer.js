/**
 * Consume a MAL data structure (AST) and return a string representation of the
 * equivalent s-expression.
 * @param mal_ds
 * @returns {String}
 */
function pr_str(mal_ds) {
  var elementType = identify_type(mal_ds);

  if (elementType === 'list') {
    return pr_list(mal_ds);
  }

  if (elementType === 'symbol') {
    return pr_symbol(mal_ds);
  }

  return pr_number(mal_ds);
}

/**
 * Consume a type/object and return its type in a string.
 * @param elem {String | Array | Number}
 * @returns {String}
 */
function identify_type(elem) {
  if (Object.prototype.toString.call(elem) === '[object Array]') {
    return 'list';
  }

  if (typeof elem === 'string') {
    return 'symbol';
  }

  return 'number';
}

/**
 *  Consume an array and return a equivalent s-expression (string).
 * @param elem {Array}
 * @returns {String}
 */
function pr_list(elem) {
  var sexp = '(';

  elem.forEach(function(element, index, array) {
    sexp += pr_str(element) + ' ';
  });

  sexp = sexp.trim() + ')';
  return sexp;
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

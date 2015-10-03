function pr_str (mal_ds) {
  var elementType = identify_type(mal_ds)
  if (elementType === 'list') {
    return pr_list(mal_ds)
  } else if (elementType === 'symbol') {
    return pr_symbol(mal_ds)
  } else {
    return pr_number(mal_ds)
  }
}

function identify_type (elem) {
  if (Object.prototype.toString.call(elem) === '[object Array]') {
    return 'list'
  } else if (typeof elem === 'string') {
    return 'symbol'
  } else {
    return 'number'
  }
}

function pr_list (elem) {
  var lst = '('
  for (var i = 0; i < elem.length; i++) {
    lst += ' ' + pr_str(elem[i])
  }
  lst += ')'
  return lst
}

function pr_symbol (elem) {
  return elem
}

function pr_number (elem) {
  return elem + ''
}

module.exports = {
  pr_str: pr_str
}

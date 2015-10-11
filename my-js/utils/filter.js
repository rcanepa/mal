/**
 * fn arr => arr
 * fn undefined => fn
 * Filter a collection upon a predicate function. if the collection is missing,
 * it will return a curried function with the predicate.
 */
function filter (predicate, collection) {
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate is not a function', __filename, 10)
  }
  // Return a curried function
  if (collection === undefined) {
    return function (collection) {
      var ret = []
      for (var i = 0; i < collection.length; i++) {
        if (predicate(collection[i])) {
          ret.push(collection[i])
        }
      }
      return ret
    }
  }
  var ret = [];
  for (var i = 0; i < collection.length; i++) {
    if (predicate(collection[i])) {
      ret.push(collection[i])
    }
  }
  return ret
}

module.exports = filter

/**
 * fn arr => arr
 * fn undefined => fn
 * Map a collection upon a transform function. if the collection is missing,
 * it will return a curried function with the transform.
 **/
function map(transform, collection) {
  if (collection === undefined) {
    return function (collection) {
      var result = []
      for (var i = 0; i < collection.length; i++) {
        result.push(transform(collection[i]))
      }
      return result
    }
  }
  var result = []
  for (var i = 0; i < collection.length; i++) {
    result.push(transform(collection[i]))
  }
  return result
}

module.exports = map

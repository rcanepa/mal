'use strict'

// * -> String
// Return the type of an element
function type (element) {
  return Object.prototype.toString.call(element).slice(8, -1)
}

module.exports = type

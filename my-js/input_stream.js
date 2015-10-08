'use strict';

/**
 * Consume a string with a MAL expression and return an inputStream
 * object. This object allows us to iterate over the stream in a
 * char by char basis.
 * @param input
 * @returns {{next: next, peek: peek, eof: eof, error: error}}
 */
var inputStream = function(input) {
  var pos = 0;
  var line = 1;
  var col = 0;

  return {
    next: next,
    peek: peek,
    eof: eof,
    error: error
  };

  /**
   * Return a char (string of size 1) that is in the pos position
   * of the stream and increment pos by one. It also updates the
   * current col position and line position.
   * @returns {String}
   */
  function next() {
    var char = input[pos++];
    if (char === "\n") {
      line++;
      col = 0;
    }
    else {
      col++;
    }
    return char;
  }

  /**
   * Return a char (string of size 1) that is in the pos position
   * of the stream.
   * @returns {String}
   */
  function peek() {
    return input[pos];
  }

  /**
   * Returns true if the end of the stream was reached.
   * @returns {boolean}
   */
  function eof() {
    return input[pos] === undefined;
  }

  /**
   * Consume a string message a thrown an Error with the message and
   * the current stream position and column.
   * @param msg
   */
  function error(msg) {
    throw new Error(msg + ' (' + line + ':' + col + ') ');
  }

};

module.exports = inputStream;

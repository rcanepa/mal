var test = require('tape');
var reader = require('./../reader');

test('tokenStream basic assertions', function(assert) {
  var sexp = '(10.1 2 33)';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek (the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), '10.1', 'next item = 10.1');
  assert.equal(ts.next(), '2', 'next item = 2');
  assert.equal(ts.peek(), '33', 'peek the same item = 33');
  assert.equal(ts.next(), '33', 'next item = 33');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

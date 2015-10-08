var test = require('tape');
var reader = require('./../reader');


test('tokenStream number assertions', function(assert) {
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

test('tokenStream string assertions', function(assert) {
  var sexp = '("abc" "a" "adsad$#as,12.312")';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek (the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), '"abc"', 'next item = "abc"');
  assert.equal(ts.next(), '"a"', 'next item = "a"');
  assert.equal(ts.peek(), '"adsad$#as,12.312"', 'peek the same item = "adsad$#as,12.312"');
  assert.equal(ts.next(), '"adsad$#as,12.312"', 'next item = "adsad$#as,12.312"');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream string (with backslashes) assertions', function(assert) {
  var sexp = '("ab\\\"c" "abc")';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek (the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), '"ab\\\"c"', 'next item = "ab\\\"c"');
  assert.equal(ts.next(), '"abc"', 'next item = "abc"');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream math operators assertions', function(assert) {
  var sexp = '(+ - / * %)';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek (the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), '+', 'next item = +');
  assert.equal(ts.next(), '-', 'next item = -');
  assert.equal(ts.next(), '/', 'next item = /');
  assert.equal(ts.next(), '*', 'next item = *');
  assert.equal(ts.next(), '%', 'next item = %');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream logical operators assertions', function(assert) {
  var sexp = '(= > < >= <=)';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek (the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), '=', 'next item = =');
  assert.equal(ts.next(), '>', 'next item = >');
  assert.equal(ts.next(), '<', 'next item = <');
  assert.equal(ts.next(), '>=', 'next item = >=');
  assert.equal(ts.next(), '<=', 'next item = <=');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream keyword assertions', function(assert) {
  var sexp = '(if cons cond let def)';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek (the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), 'if', 'next item = if');
  assert.equal(ts.next(), 'cons', 'next item = cons');
  assert.equal(ts.next(), 'cond', 'next item = cond');
  assert.equal(ts.next(), 'let', 'next item = let');
  assert.equal(ts.next(), 'def', 'next item = def');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream identifiers assertions', function(assert) {
  var sexp = '(x abc _ax10 ABC 10 $abc !ac)';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek (the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), 'x', 'next item = x');
  assert.equal(ts.next(), 'abc', 'next item = abc');
  assert.equal(ts.next(), '_ax10', 'next item = ax10');
  assert.equal(ts.next(), 'ABC', 'next item = ABC');
  assert.equal(ts.next(), '10', 'next item = 10');
  // Invalid characters (identifiers)
  assert.throws(ts.next);
  assert.throws(ts.next);
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream simple quote assertions', function(assert) {
  var sexp = '(\' ` ~ ~@)';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek (the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), '\'', 'next item = \'');
  assert.equal(ts.next(), '`', 'next item = `');
  assert.equal(ts.next(), '~', 'next item = ~');
  assert.equal(ts.next(), '~@', 'next item = ~@');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream keywords assertions', function(assert) {
  var sexp = '(:key 12 "abc" :another)';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), ':key', 'next item = :key');
  assert.equal(ts.next(), '12', 'next item = 12');
  assert.equal(ts.next(), '"abc"', 'next item = "abc"');
  assert.equal(ts.next(), ':another', 'next item = :another');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream vector assertions', function(assert) {
  var sexp = '[1 2 3]';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '[', 'first peek');
  assert.equal(ts.peek(), '[', 'second peek: the result must be the same)');
  assert.equal(ts.next(), '[', 'next item = [');
  assert.equal(ts.next(), '1', 'next item = 1');
  assert.equal(ts.next(), '2', 'next item = 2');
  assert.equal(ts.peek(), '3', 'peek the same item = 3');
  assert.equal(ts.next(), '3', 'next item = 3');
  assert.equal(ts.next(), ']', 'next item = ]');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream keyword assertions', function(assert) {
  var sexp = '(:k1 :k2 :k3)';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '(', 'first peek');
  assert.equal(ts.peek(), '(', 'second peek: the result must be the same)');
  assert.equal(ts.next(), '(', 'next item = (');
  assert.equal(ts.next(), ':k1', 'next item = :k1');
  assert.equal(ts.next(), ':k2', 'next item = :k2');
  assert.equal(ts.peek(), ':k3', 'peek the same item = :k3');
  assert.equal(ts.next(), ':k3', 'next item = :k3');
  assert.equal(ts.next(), ')', 'next item = )');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream hashmap assertions', function(assert) {
  var sexp = '{"a" 1}';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '{', 'first peek');
  assert.equal(ts.peek(), '{', 'second peek: the result must be the same)');
  assert.equal(ts.next(), '{', 'next item = {');
  assert.equal(ts.next(), '"a"', 'next item = "a"');
  assert.equal(ts.next(), '1', 'next item = 1');
  assert.equal(ts.next(), '}', 'next item = }');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

test('tokenStream deref assertions', function(assert) {
  var sexp = '@a';

  var is = reader.inputStream(sexp);
  var ts = reader.tokenStream(is);

  assert.equal(ts.peek(), '@', 'first peek');
  assert.equal(ts.next(), '@', 'next item = @');
  assert.equal(ts.next(), 'a', 'next item = a');
  assert.equal(ts.next(), null, 'next item = null');
  assert.end();

});

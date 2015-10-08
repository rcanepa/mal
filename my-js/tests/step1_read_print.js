var test = require('tape');
var repl = require('../step1_read_print');

test('', function(assert) {
  assert.equal(repl.REP('(1 2 3)'), '(1 2 3)', 'testing list');
  assert.equal(repl.REP('[1 2 3]'), '[1 2 3]', 'testing vectors');
  assert.equal(repl.REP('\'1'), '(quote 1)', 'testing quote');
  assert.equal(repl.REP('\'(1 2 3)'), '(quote (1 2 3))', 'testing quote with list');
  assert.equal(repl.REP('`(1 2 3)'), '(quasiquote (1 2 3))', 'testing quasiquote');
  assert.equal(repl.REP('~(1 2 3)'), '(unquote (1 2 3))', 'testing unquote');
  assert.equal(repl.REP('~@(1 2 3)'), '(splice-unquote (1 2 3))', 'testing splice unquote');
  assert.equal(repl.REP(':key'), ':key', 'testing keywords');
  assert.equal(repl.REP('(:key 10 "abc")'), '(:key 10 "abc")', 'testing keyword inside a list');
  assert.equal(repl.REP('{"abc" 1}'), '{"abc" 1}', 'testing hashmaps');
  assert.equal(repl.REP('{"abc" {"a" {"b" 12}}}'), '{"abc" {"a" {"b" 12}}}', 'testing nested hashmaps');
  assert.equal(repl.REP('{"abc" {"a" {"b" [1 2 3]}}}'), '{"abc" {"a" {"b" [1 2 3]}}}', 'testing nested hashmaps with a vector');
  assert.end();
});



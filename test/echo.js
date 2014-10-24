var test = require('tape');
var WebSocket = require('ws');
var pull = require('pull-stream');
var messenger = require('..')(require('./helpers/url') + '/echo');
var pushable = require('pull-pushable');

test('echo values', function(t) {
  var expected = ['foo', 'bar', 'baz', 'boop'];
  var queue = [].concat(expected);
  var pending = pushable();
  var timer = setInterval(function() {
    pending.push(queue.shift());
    if (queue.length === 0) {
      clearInterval(timer);
    }
  }, 100);

  t.plan(expected.length + 1);

  messenger(function(err, source, sink) {
    t.ifError(err);

    pull(
      source,
      pull.drain(function(value) {
        t.equal(value, expected.shift());

        if (expected.length === 0) {
          pending.end();
        }
      })
    );

    pull(pending, sink);
  });
});

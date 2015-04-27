var test = require('tape');
var WebSocket = require('ws');
var pull = require('pull-stream');
var messenger = require('..')(require('./helpers/url') + '/brittle-echo');
var pushable = require('pull-pushable');

test('echo values', function(t) {
  var expected = ['foo', 'bar', 'baz', 'boop'];
  var pending;

  function createQueue() {
    var queue = [].concat(expected);
    var next = pushable();
    var timer = setInterval(function() {
      next.push(queue.shift());
      if (queue.length === 0) {
        clearInterval(timer);
      }
    }, 100);

    return next;
  }

  t.plan(expected.length);

  messenger(function(err, source, sink) {
    if (err) {
      return t.fail(err);
    }

    pull(
      source,
      pull.drain(function(value) {
        t.equal(value, expected.shift());

        if (expected.length === 0) {
          pending.end();
        }
      })
    );

    pull(pending = createQueue(), sink);
  });
});

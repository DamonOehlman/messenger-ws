var test = require('tape');
var WebSocket = require('ws');
var pull = require('pull-stream');
var messenger = require('..')(require('./helpers/url') + '/read');

test('use the messenger to read the values from the /read endpoint', function(t) {
  t.plan(3);

  messenger(function(err, source, sink) {
    t.ifError(err);
    pull(source, pull.collect(function(readErr, values) {
      t.ifError(readErr);
      t.deepEqual(values, ['a', 'b', 'c', 'd']);
    }));
  });
});

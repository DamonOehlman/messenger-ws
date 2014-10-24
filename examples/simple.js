var pull = require('pull-stream');
var queue = require('pull-pushable')();
var messenger = require('..')('ws://localhost:3000/echo');

messenger(function(err, source, sink) {
  if (err) {
    return console.error(err);
  }

  // log data coming from the socket
  pull(source, pull.log());

  // wire the queue to sink
  pull(queue, sink);
});

setInterval(function() {
  queue.push('current time: ' + Date.now());
}, 150);

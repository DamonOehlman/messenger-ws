var WebSocket = require('ws');
var wsurl = require('wsurl');
var ps = require('pull-ws');
var defaults = require('cog/defaults');

/**
  # messenger-ws

  This is a simple messaging implementation for sending and receiving data
  via websockets.

  ## Example Usage

  <<< examples/simple.js

**/
module.exports = function(url, opts) {

  // set defaults (close on end = true)
  opts = defaults({}, opts, {
    closeOnEnd: true
  });

  function connect(callback) {
    var socket = new WebSocket(wsurl(url));

    socket.addEventListener('open', function() {
      callback(null, ps.source(socket, opts), ps.sink(socket, opts));
    });
  }

  return connect;
};

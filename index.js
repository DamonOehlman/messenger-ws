var WebSocket = require('ws');
var wsurl = require('wsurl');
var ps = require('pull-ws');
var defaults = require('cog/defaults');
var reTrailingSlash = /\/$/;

/**
  # messenger-ws

  This is a simple messaging implementation for sending and receiving data
  via websockets.

  Follows the [messenger-archetype](https://github.com/DamonOehlman/messenger-archetype)

  ## Example Usage

  <<< examples/simple.js

**/
module.exports = function(url, opts) {
  var timeout = (opts || {}).timeout || 1000;
  var endpoints = ((opts || {}).endpoints || ['/']).map(function(endpoint) {
    return url.replace(reTrailingSlash, '') + endpoint;
  });

  // set defaults (close on end = true)
  opts = defaults({}, opts, {
    closeOnEnd: true
  });

  function connect(callback) {
    var queue = [].concat(endpoints);
    var timer;

    function attemptNext() {
      var socket;

      // if we have no more valid endpoints, then erorr out
      if (queue.length === 0) {
        return callback(new Error('Unable to connect to url: ' + url));
      }

      socket = new WebSocket(wsurl(queue.shift()));
      socket.addEventListener('open', function() {
        clearTimeout(timer);
        callback(null, ps.source(socket, opts), ps.sink(socket, opts));
      });

      timer = setTimeout(attemptNext, timeout);
    }

    attemptNext();
  }

  return connect;
};

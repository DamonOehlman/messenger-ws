var WebSocket = (typeof window !== 'undefined' && window.WebSocket) || require('ws');
var wsurl = require('wsurl');
var ps = require('pull-ws');
var defaults = require('cog/defaults');
var reTrailingSlash = /\/$/;
var DEFAULT_FAILCODES = [];

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
  var failcodes = (opts || {}).failcodes || DEFAULT_FAILCODES;
  var endpoints = ((opts || {}).endpoints || ['/']).map(function(endpoint) {
    return url.replace(reTrailingSlash, '') + endpoint;
  });

  function connect(callback) {
    var queue = [].concat(endpoints);
    var isConnected = false;
    var socket;
    var failTimer;
    var successTimer;
    var removeListener;
    var source;

    function attemptNext() {
      // if we have already connected, do nothing
      // NOTE: workaround for websockets/ws#489
      if (isConnected) {
        return;
      }

      // if we have no more valid endpoints, then erorr out
      if (queue.length === 0) {
        return callback(new Error('Unable to connect to url: ' + url));
      }

      socket = new WebSocket(wsurl(queue.shift()));
      socket.addEventListener('message', connect);
      socket.addEventListener('error', handleError);
      socket.addEventListener('close', handleClose);
      socket.addEventListener('open', handleOpen);

      removeListener = socket.removeEventListener || socket.removeListener;
      failTimer = setTimeout(attemptNext, timeout);
    }

    function connect() {
      // if we are already connected, abort
      // NOTE: workaround for websockets/ws#489
      if (isConnected) {
        return;
      }

      // clear any monitors
      clearTimeout(failTimer);
      clearTimeout(successTimer);

      // remove the close and error listeners as messenger-ws has done
      // what it set out to do and that is create a connection
      // NOTE: issue websockets/ws#489 causes means this fails in ws
      removeListener.call(socket, 'open', handleOpen);
      removeListener.call(socket, 'close', handleClose);
      removeListener.call(socket, 'error', handleError);
      removeListener.call(socket, 'message', connect);

      // trigger the callback
      isConnected = true;
      callback(null, source, ps.sink(socket, opts));
    }

    function handleClose(evt) {
      var clean = evt.wasClean && (
        evt.code === undefined || failcodes.indexOf(evt.code) < 0
      );

      // if this was not a clean close, then handle error
      if (! clean) {
        return handleError();
      }

      clearTimeout(successTimer);
      clearTimeout(failTimer);
    }

    function handleError() {
      clearTimeout(successTimer);
      clearTimeout(failTimer);
      attemptNext();
    }

    function handleOpen() {
      // create the source immediately to buffer any data
      source = ps.source(socket, opts);

      // monitor data flowing from the socket
      successTimer = setTimeout(connect, 100);
    }

    attemptNext();
  }

  return connect;
};

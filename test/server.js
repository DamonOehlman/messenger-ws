var http = require('http');
var WebSocketServer = require('ws').Server;
var mapleTree = require('mapleTree');

module.exports = function() {
  var server = http.createServer();
  var wss = new WebSocketServer({ server: server });
  var router = new mapleTree.RouteTree();

  router.define('/read', function(ws) {
    var values = ['a', 'b', 'c', 'd'];
    var timer = setInterval(function() {
      var next = values.shift();
      if (next) {
        ws.send(next);
      }
      else {
        clearInterval(timer);
        ws.close();
      }
    }, 100);
  });

  router.define('/echo', function(ws) {
    ws.on('message', function(data) {
      console.log('received message: ', data);
      ws.send(data);
    });
  });

  router.define('/brittle-echo', function(ws) {
    ws.on('message', function(data) {
      console.log('received message: ', data);
      ws.send(data);
      ws.close(1002, 'Terminate');
    });
  });

  wss.on('connection', function(ws) {
    var match = router.match(ws.upgradeReq.url);
    if (match && typeof match.fn == 'function') {
      return match.fn(ws);
    }

    ws.close(1002, 'Not found');
  });

  return server;
};

var WebSocketServer = require('ws').Server;
var mapleTree = require('mapleTree');
var port = process.env.ZUUL_PORT || process.env.PORT || 3000;
var wss = module.exports = new WebSocketServer({ port: port });
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

function abortConnection(socket, code, name) {
  try {
    var response = [
      'HTTP/1.1 ' + code + ' ' + name,
      'Content-type: text/html'
    ];
    socket.write(response.concat('', '').join('\r\n'));
  }
  catch (e) { /* ignore errors - we've aborted this connection */ }
  finally {
    // ensure that an early aborted connection is shut down completely
    try { socket.destroy(); } catch (e) {}
  }
}

wss.on('connection', function(ws) {
  var match = router.match(ws.upgradeReq.url);
  if (match && typeof match.fn == 'function') {
    return match.fn(ws);
  }

  ws.close(1002, 'Not found');
});

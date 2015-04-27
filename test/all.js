var test = require('tape');

test('wait for the server to be ready', function(t) {
  t.plan(1);
  setTimeout(t.pass, 1000);
});

require('./read');
require('./echo');
require('./echo-reconnect');
require('./endpoint-failover');

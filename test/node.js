var test = require('tape')
var server

test('create server', function(t) {
  t.plan(1)
  server = require('./server')()
  server.listen(process.env.PORT || 3000, t.ifError)
})

require('./all')

test('teardown', function (t) {
  server.close()
  t.end()
})


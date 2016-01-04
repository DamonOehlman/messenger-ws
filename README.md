# messenger-ws

This is a simple messaging implementation for sending and receiving data
via websockets.

Follows the [messenger-archetype](https://github.com/DamonOehlman/messenger-archetype)


[![NPM](https://nodei.co/npm/messenger-ws.png)](https://nodei.co/npm/messenger-ws/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) [![Build Status](https://img.shields.io/travis/DamonOehlman/messenger-ws.svg?branch=master)](https://travis-ci.org/DamonOehlman/messenger-ws) [![bitHound Score](https://www.bithound.io/github/DamonOehlman/messenger-ws/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/messenger-ws)

## `bufferutil` and `utf-8-validate`

With the release of [`ws@1.0.0`](https://github.com/websockets/ws), both `bufferutil` and `utf-8-validate` are no longer included as dependencies. This is primilarly due to the fact that these are both binary addons, and cause issues when a C++ compiler is not installed or not found, or when a C++11 compliant compiler is not installed (for >= Node 4.0.0 to be compliant, use >= gcc 4.8 or >= clang 3.5).

These optional dependencies extend through to `messenger-ws`. The tests are run using `bufferutil` and `utf-8-validate`, however, these are optional dependencies and will not be installed with `messenger-ws` by default. However, it is highly recommended that you do install these dependencies, as they provide significant benefits.

## Example Usage

```js
var pull = require('pull-stream');
var queue = require('pull-pushable')();
var messenger = require('messenger-ws')('ws://localhost:3000/echo');

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

```

## License(s)

### ISC

Copyright (c) 2015, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.

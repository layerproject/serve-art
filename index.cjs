#!/usr/bin/env node

const liveServer = require('live-server');
const { parseArgs } = require('node:util');

// Define options and flags
const options = {
  port: { type: 'string', short: 'p' },
  host: { type: 'string', short: 'h' },
  root: { type: 'string', short: 'r' },
  sandbox: { type: 'string', short: 's', default: 'https://app.layer.com/submissions/generative/sandbox' },
};

const { values } = parseArgs({ options });

const params = {
  ...values,
  open: false, // When false, it won't load your browser by default.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  middleware: [
    function (req, res, next) {
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      return next();
    }
  ]
};

const server = liveServer.start(params);
server.addListener('listening', function () {
  const address = server.address();
  const openHost = address.address === '0.0.0.0' ? '127.0.0.1' : address.address;
  const url = `${params.sandbox}?url=${encodeURIComponent(`http://${openHost}:${address.port}`)}`;
  console.log(`Opening ${url}`);
  import('open').then(({ default: open }) => open(url));
});

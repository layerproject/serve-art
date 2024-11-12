#!/usr/bin/env node

var liveServer = require("live-server");
const { parseArgs } = require('node:util');

// Define options and flags
const options = {
  port: { type: 'string', short: 'p' },
  host: { type: 'string', short: 'h' },
  root: { type: 'string', short: 'r' }
};

const { values } = parseArgs({ options });

var params = {
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

liveServer.start(params);

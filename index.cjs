#!/usr/bin/env node

const { parseArgs } = require('node:util');
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const liveServer = require('live-server');
const localtunnel = require('localtunnel');

// Define options and flags
const options = {
  port: { type: 'string', short: 'p', default: '8080' },
  host: { type: 'string', short: 'h', default: '127.0.0.1' },
  root: { type: 'string', short: 'r' },
  sandbox: { type: 'string', short: 's', default: 'https://app.layer.com/submissions/generative/sandbox' },
};

const { values } = parseArgs({ options });
const rl = readline.createInterface({ input, output });

const params = {
  ...values,
  open: false, // When false, it won't load your browser by default.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  middleware: [
    function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      return next();
    }
  ]
};

function abort() {
  console.log('Aborting...');
  if (tunnel) tunnel.close();
  process.exit();
}

const opened = import('open').then((mod) => mod.default);
const controller = new AbortController();
controller.signal.addEventListener('abort', abort)

let tunnel;
Promise.resolve(liveServer.start(params))
  .then(async (server) => {
    const address = server.address();
    tunnel = await localtunnel({ port: address.port });

    tunnel.on('close', () => {
      // tunnels are closed
      console.log('Tunnel closed');
    });

    console.log('You will need to provide localtunnel with the password.');
    console.log(`Opening tunnel URL: ${tunnel.url}`);
    return opened;
  })
  .then((open) => open(tunnel.url))
  .then(() => rl.question('Ready to continue? (y)\n', controller))
  .then(answer => {
    if (`${answer}`.toLowerCase().trim().startsWith('n'))
      return abort();
    return opened;
  })
  .then((open) => {
    const url = `${params.sandbox}?url=${encodeURIComponent(tunnel.url)}`;
    console.log(`Sandbox URL: ${url}`);
    return open(url);
  });

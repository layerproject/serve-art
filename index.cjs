#!/usr/bin/env node

const { parseArgs } = require('node:util');

const StaticServer = require('static-server');
const localtunnel = require('localtunnel');

// Define options and flags
const options = {
  port: { type: 'string', short: 'p', default: '8080' },
  host: { type: 'string', short: 'h', default: '127.0.0.1' },
  root: { type: 'string', short: 'r', default: '.' },
  sandbox: { type: 'string', short: 's', default: 'https://app.layer.com/submissions/generative/sandbox' },
  tunnel_host: { type: 'string', short: 't', default: 'https://layerproxy.com' }
};

const { values } = parseArgs({ options });

var server = new StaticServer({
  rootPath: values.root,            // required, the root of the server file tree
  port: values.port,               // required, the port to listen
  host: values.host,       // optional, defaults to any interface
  name: 'serve-art',   // optional, will set "X-Powered-by" HTTP header
  cors: '*',                // optional, defaults to undefined
});

// Wrap the server's `request` event to add headers
server.on('request', (req, res) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
});


let tunnel;
const opened = import('open').then((mod) => mod.default);
new Promise(resolve => server.start(resolve))
  .then(async () => {
    tunnel = await localtunnel({
      port: values.port,
      host: values.tunnel_host
    });
    return opened;
  })
  .then((open) => {
    const url = `${values.sandbox}?url=${encodeURIComponent(tunnel.url)}`;
    console.log(`Sandbox URL: ${url}`);
    return open(url);
  })
  .catch((error) => {
    if (error) console.error(error);
    console.log('Aborting...');
    if (tunnel) tunnel.close();
    process.exit();
  });

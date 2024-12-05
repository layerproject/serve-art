# @layerart/serve-art

A small tool for serving the files in a directory so that they can be displayed in an iframe on the Layer submission platform. This server creates a tunnel in order to provide security compatibility in the browser.

## Command line options

- --port,-p - Set the port for the server, default is 8080.
- --host,-h - Set the host for the server, default is 0.0.0.0 or 127.0.0.1.
- --root,-r - Set the root directory for the server, default is cwd.
- --sandbox,-s - Specify the sandbox url. Default: https://app.layer.com/submissions/generative/sandbox
- --tunnel_host,-t - Specify the tunnel host. Default https://layerproxy.com

## Usage

```shell
npx @layerart/serve-art
```

## Global installation and terminal use

```shell
npm i -g @layerart/serve-art
serve-art
```

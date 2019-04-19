require('dotenv').config();

const ns = (process.env.RelayNamespace || 'relaydemo101') + '.servicebus.windows.net';
const path = process.env.HybridConnectionName || 'hc1';
const keyrule = process.env.SASKeyName || 'SenderSharedAccessKey';
const key = process.env.SASKeyValue;

const WebSocket = require('hyco-ws');
const readline = require('readline')
  .createInterface({
    input: process.stdin,
    output: process.stdout
  });;

WebSocket.relayedConnect(
  WebSocket.createRelaySendUri(ns, path),
  WebSocket.createRelayToken('http://' + ns, keyrule, key),
  function (wss) {
    readline.on('line', (input) => {
      wss.send(input, null);
    });

    console.log('Started client interval.');
    wss.on('close', function () {
      console.log('stopping client interval');
      process.exit();
    });
  }
);
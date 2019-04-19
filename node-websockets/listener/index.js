require('dotenv').config();

const WebSocket = require('hyco-ws');

const ns = (process.env.RelayNamespace || 'relaydemo101') + '.servicebus.windows.net';
const path = process.env.HybridConnectionName || 'hc1';
const keyrule = process.env.SASKeyName || 'ListenerSharedAccessKey';
const key = process.env.SASKeyValue;

var wss = WebSocket.createRelayedServer(
    {
        server : WebSocket.createRelayListenUri(ns, path),
        token: WebSocket.createRelayToken('http://' + ns, keyrule, key)
    }, 
    function (ws) {
        console.log('connection accepted');
        ws.onmessage = function (event) {
            console.log(event.data);
        };
        ws.on('close', function () {
            console.log('connection closed');
        });       
});

console.log('listening');

wss.on('error', function(err) {
    console.log('error' + err);
});
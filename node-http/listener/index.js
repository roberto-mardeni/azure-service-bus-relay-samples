require('dotenv').config();

const https = require('hyco-https');

const ns = (process.env.RelayNamespace || 'relaydemo101') + '.servicebus.windows.net';
const path = process.env.HybridConnectionName || 'hc1';
const keyrule = process.env.SASKeyName || 'ListenerSharedAccessKey';
const key = process.env.SASKeyValue;

var uri = https.createRelayListenUri(ns, path);
var server = https.createRelayedServer(
    {
        server : uri,
        token : () => https.createRelayToken(uri, keyrule, key)
    },
    (req, res) => {
        console.log('request accepted: ' + req.method + ' on ' + req.url);
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><head><title>Hey!</title></head><body>Relayed Node.js Server!</body></html>');
    });

server.listen( (err) => {
        if (err) {
          return console.log('something bad happened', err)
        }
        console.log(`server is listening on ${port}`)
      });

server.on('error', (err) => {
    console.log('error: ' + err);
});
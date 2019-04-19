const https = require('hyco-https');

require('dotenv').config();

const ns = (process.env.RelayNamespace || 'relaydemo101') + '.servicebus.windows.net';
const path = process.env.HybridConnectionName || 'hc1';
const keyrule = process.env.SASKeyName || 'SenderSharedAccessKey';
const key = process.env.SASKeyValue;

https.get({
    hostname : ns,
    path : (!path || path.length == 0 || path[0] !== '/'?'/':'') + path,
    port : 443,
    headers : {
        'ServiceBusAuthorization' : 
            https.createRelayToken(https.createRelayHttpsUri(ns, path), keyrule, key)
    }
}, (res) => {
    let error;
    if (res.statusCode !== 200) {
        console.error('Request Failed.\n Status Code: ${statusCode}');
        res.resume();
    } 
    else {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    };
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
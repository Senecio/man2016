var express = require('express');
var app = express();
var AV = require('leanengine');
var http = require('http').Server(app);

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || 'A4gzB4MkJ2hE5DlRU9eJaFKl-9Nh9j0Va',
  appKey: process.env.LEANCLOUD_APP_KEY || 'uaXPOvBHVJlDmbl6aAGCN0n0',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || 'h7U1NhMTezg6vixpQP7un7Dm'
});

app.use(AV.express());
app.use(express.static(__dirname + "/client"));

http.listen( process.env.LEANCLOUD_APP_PORT, function() {
    console.log('[DEBUG] Listening on *:' + process.env.LEANCLOUD_APP_PORT);
});

//app.listen(process.env.LEANCLOUD_APP_PORT);

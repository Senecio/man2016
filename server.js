var express = require('express');
var AV = require('leanengine');

AV.init({
  appId: process.env.LEANCLOUD_APP_ID || 'A4gzB4MkJ2hE5DlRU9eJaFKl-9Nh9j0Va',
  appKey: process.env.LEANCLOUD_APP_KEY || 'uaXPOvBHVJlDmbl6aAGCN0n0',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || 'h7U1NhMTezg6vixpQP7un7Dm'
});

var app = express();
//app.use(AV.express());
app.listen(process.env.LEANCLOUD_APP_PORT);

app.get('/', function(req, response) {
  /*res.render('index', {title: 'Hello world'});*/
    response.writeHead(200, {"Content-Type": "text/plain"});  
    response.write("Hello World");  
    response.end();
});

app.get('/time', function(req, res) {
  res.json({
    time: new Date()
  });
});

app.get('/todos', function(req, res) {
  new AV.Query('Todo').find().then(function(todos) {
    res.json(todos);
  }).catch(function(err) {
    res.status(500).json({
      error: err.message
    });
  });
});
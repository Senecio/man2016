
var APP_ID = 'A4gzB4MkJ2hE5DlRU9eJaFKl-9Nh9j0Va';
var APP_KEY = 'uaXPOvBHVJlDmbl6aAGCN0n0';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var http = require("http");
http.createServer(function(request, response) {  
    response.writeHead(200, {"Content-Type": "text/plain"});  
    response.write("Hello World");  
    response.end();
}).listen(80);
console.log("nodejs start listen 80 port!");
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

IO = require('socket.io')(http);
Util = require("./common/Utility.js");
GameLog = require('./server/GameLog.js');

var gameServer = new (require('./server/GameServer.js'))();
gameServer.Init();

//--------------------------------------------------
// 常量
//--------------------------------------------------
var c_HeartbeatCheckMS = 1000;          //心跳检测毫秒数
var c_HeartbeatCheckTimeoutCount = 2;   //心跳检测超时数量

//--------------------------------------------------
// 全局变量
//--------------------------------------------------
var clients = [];

IO.on('connection', function (socket) {
    GameLog('Client [' + socket.id + '] connected!');
    
    // 创建一个客户链接信息.
    var client = { 
                    id: socket.id, 
                    socket : socket,
                    timeoutCount : 0,
                    heartbeatTime : new Date().getTime(), 
                    SetHeartbeatTime : function() { this.heartbeatTime = new Date().getTime() },
                };

    clients.push(client);
    
    IO.emit('clientJoin', { name: client.id });
    
    GameLog('Total client: ' + clients.length);
    
    // 心跳响应
    socket.on('heartbeat', function () {
        client.SetHeartbeatTime();
        socket.emit('heartbeatBack');
    });
    
    // 断开链接
    socket.on('disconnect', function () {
        GameLog('Client [' + client.id + '] disconnected!');

        // 通知gameServer 删除client
        gameServer.DeleteClient(client);
        
        client.socket.broadcast.emit('clientDisconnect', { name: client.id  });
            
        var idx = Util.FindIndex(clients, client.id);
        if ( idx >= 0 ) {
            clients.splice(idx, 1);
        }
            
        GameLog('Total players: ' + clients.length);
    });
    
    // 通知gameServer 进入新client
    gameServer.NewClient(client);
});

// 检测客户心跳
function CheckClientHeartbeat()
{
    var now = new Date().getTime();
    
    for (var i = clients.length - 1; i >=0; --i) {
        var client = clients[i];
        if (now - client.heartbeatTime > c_HeartbeatCheckMS) {
            ++client.timeoutCount;
            if (client.timeoutCount > c_HeartbeatCheckTimeoutCount) {
                // 超过超时次数,断开客户链接
                client.socket.disconnect();
            }
        }else {
            client.timeoutCount = 0;
        }
    }
}

setInterval(CheckClientHeartbeat, c_HeartbeatCheckMS);
//app.listen(process.env.LEANCLOUD_APP_PORT);

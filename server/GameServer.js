if(typeof module !== 'undefined')
    module.exports = GameServer;

GC = require("./GlobalConstant.js");
Table = require("./Table.js");
Sprintf = require('./sprintf.js');
Vec2 = require("../common/Vec2.js");

var Map = require("./Map.js");
var Player = require("./Player.js");

var trainingMaps = [];
var maps = [];

function GameServer()
{
    this.LastMapId = 0;
    this._pdte = new Date().getTime();
}

GameServer.prototype.Init = function()
{
    // 设置更新
    setInterval(function(){
        this._pdt = (new Date().getTime() - this._pdte) / 1000.0;
        this._pdte = new Date().getTime();
        if (this._pdt > 0.04) {
            GameLog("!!!###########this._pdt=", this._pdt);
        }
        this.Update(this._pdt);
    }.bind(this), 1000.0/30.0);
}

GameServer.prototype.Update = function(dt)
{
    for (var i = 0; i < trainingMaps.length; ++i) {
        trainingMaps[i].Update(dt);
    }
    
    for (var i = 0; i < maps.length; ++i) {
        maps[i].Update(dt);
    }
}

GameServer.prototype.GenMapId = function(training)
{
    return ++this.LastMapId + (training ?  0 : 10000);
}

GameServer.prototype.NewClient = function(client)
{
    var socket = client.socket;
    var server = this;
    
    socket.on('enterGame', function (data) {
        
        // check nickName is valid.
        var newPlayer = new Player();
        newPlayer.Init(socket.id, data.nickName, socket);
        client.player = newPlayer;
        
        server.AddToTrainingMap(newPlayer);
        GameLog(data.nickName + ' enter game.');
    });
}

GameServer.prototype.DeleteClient = function(client)
{
    var player = client.player;
    if (player) {
        client.player = null;
        if (player.ship) {
            player.ship.map.RemovePlayer(player);
        }
    }
}

GameServer.prototype.AddToTrainingMap = function(newPlayer)
{
    var map = null;
    var maxCount = -1;

    for (var i = 0; i < trainingMaps.length; ++i) {
        var playerCount = trainingMaps[i].players.length;
        if ( playerCount !== GC.MaxPlayerCountTraningMap && playerCount > maxCount ) {
            map = trainingMaps[i];
            maxCount = playerCount;
        }
    }
    
    if (map === null) {
        map = new Map();
        map.Init(this.GenMapId(true), true);
        trainingMaps.push(map);
        
        GameLog("Create training map[" + map.id + "].");
    }
    
    map.AddPlayer(newPlayer);
}



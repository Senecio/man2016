if(typeof module !== 'undefined')
    module.exports = Map;
    
var Player = require("./Player.js");
var Quadtree = require("./Quadtree.js").Quadtree;
var BulletBatch = require("./BulletBatch.js");

var GetNextType = function() {
    var id = -1;
    return function () {
        return GC.ShipTypeArray[++id%3];
    };
}();

function Map()
{
    this.duration = 0;      // 持续时间
    this.players = [];      // 玩家列表
    this.NextPlayerShipType
    this.training = false;  // 练习模式?
    this.width = GC.MapWidth;
    this.height = GC.MapHeight;
    this.notifyCount = 0;
    this.notifyDelay = 0;
    this.quadtree = new Quadtree({x:0,y:0,width:this.width,height:this.height});
    this.bulletBatchs = []; // 子弹列表
    this.BatchAInterval = 1.0;
    this.BatchATime = 0;
    
    this.bulletBatchShooter = [ 
                                { id : 1, interval : 6.0, rot : 0, time :  0 },
                                { id : 1, interval : 6.0, rot : 5, time : -0.5 },
                                { id : 1, interval : 6.0, rot : 15, time : -2.5 },
                            ];

    //----------------------------测试-----------------------------
    this.bulletBatchShooter1 = [ 
                                { id : 1, interval : 6.0, rot : 0, time :  0 },
                                { id : 1, interval : 6.0, rot : 5, time : -0.5 },
                                { id : 1, interval : 6.0, rot : 15, time : -2.5 },
                            ];
    this.bulletBatchShooter2 = [ 
                                { id : 1, interval : 6.0, rot : 0, time :  0 },
                                { id : 1, interval : 6.0, rot : 5, time : -0.5 },
                                { id : 1, interval : 6.0, rot : 15, time : -2.5 },
                            ];
    this.bulletBatchShooter3 = [ 
                                { id : 1, interval : 6.0, rot : 0, time :  0 },
                                { id : 1, interval : 6.0, rot : 5, time : -0.5 },
                                { id : 1, interval : 6.0, rot : 15, time : -2.5 },
                            ];
    this.bulletBatchShooter4 = [ 
                                { id : 1, interval : 6.0, rot : 0, time :  0 },
                                { id : 1, interval : 6.0, rot : 5, time : -0.5 },
                                { id : 1, interval : 6.0, rot : 15, time : -2.5 },
                            ];
    //----------------------------测试-----------------------------
    
    this.BatchId = 0;
}

Map.prototype.Init = function(id, training)
{
    this.id = id;
    this.roomName = "room:"+this.id;
    this.training = training;
}

Map.prototype.GetPositionNewShip = function()
{
    var x = 200 + Util.RandomRange(-50, 50);
    var y = 200 + Util.RandomRange(-50, 50);
    return new Vec2(x, y);
}

Map.prototype.GetBulletBatchId = function()
{
    ++this.BatchId;
    if (this.BatchId > 100000000) {
        this.BatchId = 1;
    }
    return this.BatchId;
}

Map.prototype.AddPlayer = function(player)
{
    var type = GetNextType();
    player.CreateShip(type, this.GetPositionNewShip(), 0);
    player.ship.map = this;
    
    var data = { "mapId" : this.id,
                 "mapWidth": this.width,
                 "mapHeight" : this.height };
    player.socket.emit("enterGameBack", data);
    
    player.socket.on('moveByDirection', function (data) {
        
        if (player.IsShipLive() === false) {
            GameLog("error packet(player ship is dead.)!!!");
            return;
        }
        
        if (typeof player.ship.dirCd !== 'undefined') {
            var now = new Date().getTime();
            if (now - player.ship.dirCd < 30) {
                return;
            }
        }
        
        if (player.ship.GetMoveByDirection() !== data.direction)
        {
            player.ship.SetMoveByDirection(data.direction);
            player.ship.map.BroadcastPlayers(player, "moveByDirectionBack");
            player.ship.dirCd = new Date().getTime();
        } else {
            //GameLog("move duplicate!!!", player.ship.GetMoveByDirection(), "client=", data.direction, this.id);
        }
    });
    
    // 先通知自己创建自己的单位
    player.socket.emit("newPlayer", Player.prototype.SendNewPlayer(player, true));
    // 再通知其他玩家创建自己的单位
    this.BroadcastPlayers(player, "newPlayer");
    // 再自己创建其他玩家的单位 hack!!!
    this.SendPlayersTo(player);
    // 子弹
    this.SendBulletBatchsTo(player);

    player.socket.join(this.roomName);
    this.players.push(player);
    // 添加3秒无敌
    this.PlayerAddBuff(player, 2);
    
    if (this.players.length === GC.MaxPlayerCountTraningMap) {
        this.notfiyCount = 5;
        this.notifyDelay = 2;
        //IO.to(this.roomName).emit("newCompetitionTiming", Map.prototype.SendNewCompetitionTime(this));
        this.BroadcastPlayers(this, "newCompetitionTiming");
    }
}

Map.prototype.RemovePlayer = function(player)
{
    var idx = Util.FindIndex(this.players, player.id);
    if (idx >= 0) {
        player.DestoryShip();
        player.socket.leave("room:"+this.id);
        this.BroadcastPlayers(player, "losePlayer");
        this.players.splice(idx, 1);
        GameLog("map player:", this.players.length);
        
        if (this.players.length < GC.MaxPlayerCountTraningMap) {
            if (this.notfiyCount > 0) {
                this.notfiyCount = 0;
                this.notifyDelay = 0;
                //IO.to(this.roomName).emit("cancelCompetition");
                this.BroadcastPlayers(this, "cancelCompetition");
            }
        }
    }
}

Map.prototype.ClearAllPlayers = function()
{
    for (var i = 0; i < this.players.length; ++i){
        var player = this.players[i];
        player.DestoryShip();
    }
    
    this.players = [];
}

Map.prototype.Update = function(dt)
{
    var player;
    var quadtreeObj;
    this.quadtree.clear();
    for (var i = 0; i < this.players.length; ++i){
        player = this.players[i];
        player.Update(dt);
        quadtreeObj = { x: player.ship.position.x, y : player.ship.position.y, width : GC.ShipRadius, height : GC.ShipRadius, index : i };
        this.quadtree.insert(quadtreeObj);
    }
    
    // 检测玩家间物理碰撞
    var otherPlayer, objs;
    for (var i = 0; i < this.players.length; ++i) {
        player = this.players[i];
        
        if (!player.IsShipLive()) {
            continue;
        }
        // 如果有无敌,不做碰撞
        if (player.HasBuffType("wudi")) {
            continue;
        }
        
        quadtreeObj  = { x: player.ship.position.x, y : player.ship.position.y, width : GC.ShipRadius, height : GC.ShipRadius };
        objs = this.quadtree.retrieve(quadtreeObj);
        for(var j=0; j< objs.length; ++j ) {
            otherPlayer = this.players[objs[j].index];
            if(otherPlayer.id === player.id){
                continue;
            }
            if (!otherPlayer.IsShipLive()) {
                continue;
            }
            
            this.CheckCollide(player, otherPlayer);
        }
    }
    
    /*
    for (var i = 0; i < this.bulletBatchShooter.length; ++i){
        var shooter = this.bulletBatchShooter[i];
        // 刷新子弹A
        shooter.time += dt;
        if ( shooter.time > shooter.interval) {
            shooter.time -= shooter.interval;
            var bb = new BulletBatch();
            bb.Init(this.GetBulletBatchId(), shooter.id, new Vec2(this.width / 2, this.height / 2), shooter.rot);
            this.bulletBatchs.push(bb);
            this.BroadcastPlayers(bb, "bulletBatch");
        }
    }*/
    
    //----------------------------测试-----------------------------
    for (var i = 0; i < this.bulletBatchShooter1.length; ++i){
        var shooter = this.bulletBatchShooter1[i];
        shooter.time += dt;
        if ( shooter.time > shooter.interval) {
            shooter.time -= shooter.interval;
            var bb = new BulletBatch();
            bb.Init(this.GetBulletBatchId(), shooter.id, new Vec2(50, 50), shooter.rot);
            this.bulletBatchs.push(bb);
            this.BroadcastPlayers(bb, "bulletBatch");
        }
    }
    
    for (var i = 0; i < this.bulletBatchShooter2.length; ++i){
        var shooter = this.bulletBatchShooter2[i];
        shooter.time += dt;
        if ( shooter.time > shooter.interval) {
            shooter.time -= shooter.interval;
            var bb = new BulletBatch();
            bb.Init(this.GetBulletBatchId(), shooter.id, new Vec2(this.width - 50, 50), shooter.rot);
            this.bulletBatchs.push(bb);
            this.BroadcastPlayers(bb, "bulletBatch");
        }
    }
    
    for (var i = 0; i < this.bulletBatchShooter3.length; ++i){
        var shooter = this.bulletBatchShooter3[i];
        shooter.time += dt;
        if ( shooter.time > shooter.interval) {
            shooter.time -= shooter.interval;
            var bb = new BulletBatch();
            bb.Init(this.GetBulletBatchId(), shooter.id, new Vec2(50, this.height - 50), shooter.rot);
            this.bulletBatchs.push(bb);
            this.BroadcastPlayers(bb, "bulletBatch");
        }
    }
    
    for (var i = 0; i < this.bulletBatchShooter4.length; ++i){
        var shooter = this.bulletBatchShooter4[i];
        shooter.time += dt;
        if ( shooter.time > shooter.interval) {
            shooter.time -= shooter.interval;
            var bb = new BulletBatch();
            bb.Init(this.GetBulletBatchId(), shooter.id, new Vec2(this.width - 50, this.height - 50), shooter.rot);
            this.bulletBatchs.push(bb);
            this.BroadcastPlayers(bb, "bulletBatch");
        }
    }
    //----------------------------测试-----------------------------
    
    // 子弹更新
    var bb, inst, nx, ny, position = new Vec2(0, 0);
    for (var i = this.bulletBatchs.length - 1; i >= 0; --i) {
        bb = this.bulletBatchs[i];
        bb.duration += dt;
        for (var j = 0; j < bb.instances.length; ++j) {
            inst = bb.instances[j];
            if (inst.state === 0)
                continue;

            nx = bb.position.x + inst.speed.x * bb.duration;
            ny = bb.position.y + inst.speed.y * bb.duration;
            if(nx < 0 || ny < 0 || nx > this.width || ny > this.height) {
                inst.state = 0;
                //GameLog(bb.id, "子弹死亡", nx, ny);
            }else 
            {
                // 碰撞玩家.
                quadtreeObj  = { x: nx, y : ny, width : bb.entry.size, height : bb.entry.size };
                var objs = this.quadtree.retrieve(quadtreeObj);
                for(var idx=0; idx<objs.length; ++idx) {
                    player = this.players[objs[idx].index];
                    if (!player.IsShipLive()) {
                        continue;
                    }
                    
                    if (player.HasBuffType("wudi")) {
                        continue;
                    }
                    
                    position.x = nx;
                    position.y = ny;
                    var distance = position.Sub(player.ship.position).Length();
                    if (distance < GC.ShipRadius + bb.entry.size) {
                        player.DropHp(1);
                        if (player.IsShipLive()) {
                            player.socket.emit("updateShipHp", Player.prototype.SendShipHp(player, "beHit"));
                            this.PlayerAddBuff(player, 1);
                        }else {
                            this.BroadcastPlayers(player, "shipDead");
                        }
                        
                        inst.state = 0;
                        this.BroadcastPlayers(bb, "bulletBatch");
                    }
                }
            }
        }
        if (bb.AllInstanceIsDeath()) {
            this.bulletBatchs.splice(i, 1);
            //GameLog("剩余batch", this.bulletBatchs.length);
        }
    }
    
    
    if( this.notfiyCount > 0) {
        this.notifyDelay -= dt;
        if(this.notifyDelay < 0) {
            this.notifyDelay = 2.0;
            --this.notfiyCount;
            //IO.to(this.roomName).emit("newCompetitionTiming", Map.prototype.SendNewCompetitionTime(this));
            this.BroadcastPlayers(this, "newCompetitionTiming");
            if(this.notfiyCount === 0) {
                GameLog("new Game for competition!!!");
            }
        }
    }
}

Map.prototype.CheckCollide = function(playerA, playerB)
{
    // 排除无敌
    if (playerA.HasBuffType("wudi") || playerB.HasBuffType("wudi")) {
        return;
    }
    
    var distance = playerB.ship.position.Sub(playerA.ship.position).Length();
    if (distance < 2.0 * GC.ShipRadius) {
        //GameLog(playerA.nickName +" 与 " + playerB.nickName + "相碰!!");
        playerA.DropHp(1);
        playerB.DropHp(1);
        
        if (playerA.IsShipLive()) {
            playerA.socket.emit("updateShipHp", Player.prototype.SendShipHp(playerA, "dropHp"));
            this.PlayerAddBuff(playerA, 1);
        }else {
            this.BroadcastPlayers(playerA, "shipDead");
        }
        
        if (playerB.IsShipLive()) {
            playerB.socket.emit("updateShipHp", Player.prototype.SendShipHp(playerB, "dropHp"));
            this.PlayerAddBuff(playerB, 1);
        }else {
            this.BroadcastPlayers(playerB, "shipDead");
        }
    }
}

Map.prototype.PlayerAddBuff = function(player, id)
{
    if (player.AddBuff(id)) {
        this.BroadcastPlayers(player, "addBuff", player.GetBuffById(id));
    }
}

Map.prototype.PlayerShipRebron = function(player)
{
    if (!player.IsShipLive()) {
        player.ship.Rebron(this.GetPositionNewShip());
        this.BroadcastPlayers(player, "shipReborn");
        player.socket.emit("updateShipHp", Player.prototype.SendShipHp(player, "reborn"));
        this.PlayerAddBuff(player, 2);
    }
}

Map.prototype.BroadcastPlayers = function(who, action, argument)
{
    if (action === "moveByDirectionBack"){
        IO.to(this.roomName).emit(action, Player.prototype.SendMoveByDirection(who));
    }else if(action === "newPlayer") {
        IO.to(this.roomName).emit(action, Player.prototype.SendNewPlayer(who));
    }else if(action === "losePlayer") {
        IO.to(this.roomName).emit(action, Player.prototype.SendLosePlayer(who));
    }else if(action === "addBuff") {
        IO.to(this.roomName).emit(action, Player.prototype.SendAddBuff(who, argument));
    }else if(action === "shipDead") {
        IO.to(this.roomName).emit(action, Player.prototype.SendShipDead(who));
    }else if(action === "shipReborn") {
        IO.to(this.roomName).emit(action, Player.prototype.SendShipReborn(who));
    }else if(action === "newCompetitionTiming") {
        IO.to(this.roomName).emit(action, Map.prototype.SendNewCompetitionTime(who));
    }else if(action === "cancelCompetition") {
        IO.to(this.roomName).emit(action);
    }else if (action === "bulletBatch") {
        IO.to(this.roomName).emit(action, BulletBatch.prototype.SendBulletBatch(who));
    }else if (action === "RemoveBullet") {
        for (var key in this.players) {   
            if(this.players[key]){
                who.SendRemoveBullet(this.players[key]);
            }
        }
    }
}

Map.prototype.SendPlayersTo = function(who)
{
    var player = null;
    datas = [];
    for (var i = 0; i < this.players.length; ++i){
        player = this.players[i];
        datas.push(Player.prototype.SendPlayerInfo(player));
    }
    if (datas.length > 0) {
        who.socket.emit("playerList", datas);
    }
}

Map.prototype.SendBulletBatchsTo = function(who)
{
    var bb = null;
    datas = [];
    for (var i = 0; i < this.bulletBatchs.length; ++i){
        bb = this.bulletBatchs[i];
        datas.push(BulletBatch.prototype.SendBulletBatch(bb));
    }
    if (datas.length > 0) {
        who.socket.emit("bulletBatchList", datas);
    }
}

Map.prototype.SendNewCompetitionTime = function(map)
{
    data = { "second" : map.notfiyCount };
    return data;
}

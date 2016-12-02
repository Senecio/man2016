if(typeof module !== 'undefined')
    module.exports = Player;
    
var PlayerShip = require("./PlayerShip.js");
var Buff = require("./Buff.js");

function Player()
{

}

Player.prototype.Init = function(id, nickName, socket)
{
    this.id = id;
    this.nickName = nickName;
    this.socket = socket;
}

Player.prototype.Update = function(dt)
{
    if (this.ship.live) {
        this.ship.Update(dt);
        this.buff.Update(dt);
    }
    else {
        this.rebornTime += dt;
        if (this.rebornTime > this.rebornInterval) {
            this.rebornTime = 0;
            this.ship.map.PlayerShipRebron(this);
            GameLog(this.nickName+"复活");
        }
    }
}

Player.prototype.CreateShip = function(shipType, shipPosition, shipRotation)
{
    this.ship = new PlayerShip();
    this.ship.Init(shipType, shipPosition, shipRotation);
    this.rebornInterval = 1.0;
    this.rebornTime = 0.0;
    this.buff = new Buff();
    this.buff.Init(this);
}

Player.prototype.DestoryShip = function(shipType, shipPosition, shipRotation)
{
    this.ship = null;
    this.buff.Clear();
    this.buff = null;
}

Player.prototype.AddBuff = function(id)
{
    if (this.ship.live) {
        return this.buff.Add(id);
    }
    return false;
}

Player.prototype.GetBuffById = function(id)
{
    return this.buff.GetById(id);
}

Player.prototype.HasBuffType = function(buffType)
{
    return this.buff.HasType(buffType);
}

Player.prototype.ClearBuffs = function()
{
    this.buff.Clear();
}

Player.prototype.DropHp = function(damage)
{
    if (this.ship.live) {
        this.ship.hp -= damage;
        if (this.ship.hp <= 0) {
            this.ship.live = false;
            this.rebornTime = 0.0;
            this.ClearBuffs();
        }
    }
}

Player.prototype.IsShipLive = function()
{
    return this.ship.live;
}

Player.prototype.SendNewPlayer = function(player, toSelf)
{
    var data = {    "id"                : player.socket.id,
                    "nickName"          : player.nickName,
                    "ship_type"         : player.ship.type,
                    "ship_position_x"   : player.ship.position.x,
                    "ship_position_y"   : player.ship.position.y,
                    "ship_rotation"     : player.ship.rotation,
                    "ship_moveDirection": player.ship.GetMoveByDirection() };
                    
    if (toSelf) {
        data.ship_hp = player.ship.hp;
    }

    return data;
}

Player.prototype.SendPlayerInfo = function(player) 
{
    var data = {    "id"                : player.socket.id,
                    "nickName"          : player.nickName,
                    "ship_type"         : player.ship.type,
                    "ship_position_x"   : player.ship.position.x,
                    "ship_position_y"   : player.ship.position.y,
                    "ship_rotation"     : player.ship.rotation,
                    "ship_moveDirection": player.ship.GetMoveByDirection() };
    
    var buffListData = Player.prototype.SendBuffList(player);
    if (buffListData) {
        data.buffList = buffListData;
    }
    
    return data;
}


Player.prototype.SendShipDead = function(player)
{
    var data = {    "id"                : player.socket.id,
                    "ship_position_x"   : player.ship.position.x,
                    "ship_position_y"   : player.ship.position.y,
                    "ship_live_time"    : player.ship.liveTime };
    return data;
}

Player.prototype.SendShipReborn = function(player)
{
    var data = {    "id"                : player.socket.id,
                    "ship_type"         : player.ship.type, 
                    "ship_position_x"   : player.ship.position.x,
                    "ship_position_y"   : player.ship.position.y,
                    "ship_rotation"     : player.ship.rotation,
                    "ship_moveDirection": player.ship.GetMoveByDirection() };

    return data;
}

Player.prototype.SendMoveByDirection = function(player)
{
    var data = {    "id"              : player.socket.id,
                    "ship_position_x" : player.ship.position.x,
                    "ship_position_y" : player.ship.position.y,
                    "ship_rotation"   : player.ship.rotation,
                    "ship_moveDirection" : player.ship.GetMoveByDirection() };

    return data;
}

Player.prototype.SendLosePlayer = function(player)
{
    var data = { "id"       : player.socket.id,
                 "nickName" : player.nickName };

    return data;
}


Player.prototype.SendShipHp = function(player, reason)
{
    var data = { "id"       : player.socket.id,
                 "reason"   : reason,
                 "ship_hp"  : player.ship.hp };

    return data;
}

Player.prototype.SendAddBuff = function(player, buff)
{
    var data = { "id"       : player.socket.id,
                 "buff_id"  : buff.id,
                 "buff_time": buff.time };

    return data;
}

Player.prototype.SendBuffList = function(player)
{
    var data = [];
    if (player.buff.items.length > 0) {
        for (var i = 0; i < player.buff.items.length; ++i) {
            var buff = player.buff.items[i];
            data.push( { "buff_id"  : buff.id, "buff_time": buff.time} );
        }
        return data;
    }
    
    return null;
}
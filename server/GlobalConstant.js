//--------------------------------------------------
// 全局常量
//--------------------------------------------------

var GlobalConstant = {
    // 练习场景最大人数.
    MaxPlayerCountTraningMap : 5,
    // 地图宽
    MapWidth : 1440,
    // 地图高
    MapHeight : 960,
    // 飞船类型
    ShipTypeArray : new Array("ship", "enemy_bee", "enemy_ship"),
    // 飞船半径,用于碰撞
    ShipRadius : 15,
    // 飞船最大血量
    ShipMaxHp : 3,
}

if(typeof module !== 'undefined')
    module.exports = GlobalConstant;
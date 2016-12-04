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
    // 一个子弹节奏到下一个子弹节奏的cd(单位秒)
    NextShootInterval : 5,
    // 简单子弹发射模式时间(单位秒)
    EasyShootModeTime : 60, 
    // 普通子弹发射模式时间(单位秒)
    NormalShootModeTime : 60,
    // 困难子弹发射模式时间(单位秒)
    HardShootModeTime : 60,
    // 一个模式到下一个模式的cd(单位秒)
    NextModeTime : 10,
}

if(typeof module !== 'undefined')
    module.exports = GlobalConstant;
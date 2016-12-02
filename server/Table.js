// 游戏数据表
; (function() {

    var Table = {
        // buff表
        'Buff' : [
            { 'id' : 1,     'name' : '无敌1秒', 'type' : 'wudi',   'time' : 1.0,   'data' : {} },  
            { 'id' : 2,     'name' : '无敌3秒', 'type' : 'wudi',   'time' : 3.0 },
            { 'id' : 3,     'name' : '加速',    'type' : 'jiasu',  'time' : 2.0 },
            { 'id' : 4,     'name' : '减速',    'type' : 'jiansu', 'time' : 2.0 },
            { 'id' : 5,     'name' : '回血',    'type' : 'huixue', 'time' : 2.0 },
        ],
        
        // 子弹表
        'Bullet' : [
            { 'id' : 1,     'type' : 'circular',        'speed' : 80,  'size' : 2,  'data' : { 'number' : 20 } },       // 圆形
            { 'id' : 2,     'type' : 'fan',             'speed' : 80,  'size' : 2,  'data' : { 'angle' : 30, 'number' : 11 } }, // 扇形
        ],
        
        GetEntry : function(tableName, id)
        {
            if (typeof(this[tableName]) !== 'undefined') {
                return this[tableName][id-1];
            }
            return null;
        }
    }
    
    if(typeof module !== 'undefined')
        module.exports = Table;
    
    if(typeof window !== 'undefined')
        window.Table = Table;

})();



var bulletBatchShooter = function () {
    var data = [
        {
            id : 1,
            x  : 50,
            y  : 50,
            dir : 0,
            easy : [
                        [{"id":1,"time":1,"rot":0},{"id":2,"time":2,"rot":45}],
                        [{"id":1,"time":1,"rot":0},{"id":1,"time":1,"rot":8}],
                   ],
            normal : [
                        [{"id":3,"time":1,"rot":0},{"id":4,"time":2,"rot":-30},{"id":4,"time":2.5,"rot":0},{"id":4,"time":3,"rot":30}],
                    ],
            hard : [
                        [{"id":1,"time":1,"rot":0},{"id":1,"time":1.5,"rot":15},{"id":1,"time":2,"rot":30},{"id":1,"time":2.5,"rot":45},{"id":4,"time":5,"rot":15},{"id":4,"time":5.5,"rot":15},{"id":4,"time":6,"rot":0},{"id":4,"time":6.5,"rot":0},{"id":4,"time":7,"rot":-15},{"id":4,"time":7.5,"rot":-15}],
                    ],
                
        },
        {
            id : 2,
            x : GC.MapWidth - 50,
            y : 50,
            dir : 0,
            easy : [
                        [{"id":1,"time":1,"rot":0},{"id":2,"time":2,"rot":45}],
                        [{"id":1,"time":1,"rot":0},{"id":1,"time":1,"rot":8}],
                   ],
            normal : [
                        [{"id":3,"time":1,"rot":0},{"id":4,"time":2,"rot":-30},{"id":4,"time":2.5,"rot":0},{"id":4,"time":3,"rot":30}],
                    ],
            hard : [
                        [{"id":1,"time":1,"rot":0},{"id":1,"time":1.5,"rot":15},{"id":1,"time":2,"rot":30},{"id":1,"time":2.5,"rot":45},{"id":4,"time":5,"rot":15},{"id":4,"time":5.5,"rot":15},{"id":4,"time":6,"rot":0},{"id":4,"time":6.5,"rot":0},{"id":4,"time":7,"rot":-15},{"id":4,"time":7.5,"rot":-15}],
                    ],
        },
        {
            id : 3,
            x : 50,
            y : GC.MapHeight - 50,
            dir : 90,
            easy : [
                        [{"id":1,"time":1,"rot":0},{"id":2,"time":2,"rot":45}],
                        [{"id":1,"time":1,"rot":0},{"id":1,"time":1,"rot":8}],
                   ],
            normal : [
                        [{"id":3,"time":1,"rot":0},{"id":4,"time":2,"rot":-30},{"id":4,"time":2.5,"rot":0},{"id":4,"time":3,"rot":30}],
                    ],
            hard : [
                        [{"id":1,"time":1,"rot":0},{"id":1,"time":1.5,"rot":15},{"id":1,"time":2,"rot":30},{"id":1,"time":2.5,"rot":45},{"id":4,"time":5,"rot":15},{"id":4,"time":5.5,"rot":15},{"id":4,"time":6,"rot":0},{"id":4,"time":6.5,"rot":0},{"id":4,"time":7,"rot":-15},{"id":4,"time":7.5,"rot":-15}],
                    ],
        },
        {
            id : 4,
            x  : GC.MapWidth - 50,
            y  : GC.MapHeight - 50,
            dir : 0,
            easy : [
                        [{"id":1,"time":1,"rot":0},{"id":2,"time":2,"rot":45}],
                        [{"id":1,"time":1,"rot":0},{"id":1,"time":1,"rot":8}],
                   ],
            normal : [
                        [{"id":3,"time":1,"rot":0},{"id":4,"time":2,"rot":-30},{"id":4,"time":2.5,"rot":0},{"id":4,"time":3,"rot":30}],
                    ],
            hard : [
                        [{"id":1,"time":1,"rot":0},{"id":1,"time":1.5,"rot":15},{"id":1,"time":2,"rot":30},{"id":1,"time":2.5,"rot":45},{"id":4,"time":5,"rot":15},{"id":4,"time":5.5,"rot":15},{"id":4,"time":6,"rot":0},{"id":4,"time":6.5,"rot":0},{"id":4,"time":7,"rot":-15},{"id":4,"time":7.5,"rot":-15}],
                    ],
        }
    ];
    return data;
}

if(typeof module !== 'undefined')
    module.exports = bulletBatchShooter;
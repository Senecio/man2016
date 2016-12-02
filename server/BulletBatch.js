if(typeof module !== 'undefined')
    module.exports = BulletBatch;

// 子弹批
function BulletBatch()
{
    this.duration = 0.0;
}

BulletBatch.prototype.Init = function(id, tid, position, rotation)
{
    if (typeof rotation === 'undefined') rotation = 0;
    var entry = Table.GetEntry("Bullet", tid);
    if (entry) {
        this.id = id;
        this.entry = Table.GetEntry("Bullet", tid);
        this.position = position;
        this.rotation = rotation;
        this.instances = [];
        if (entry.type === 'circular') {
            var angle = 360 / entry.data.number;
            var initDir = new Vec2(0, 1);
            for(var a = 0; a < 360; a += angle) {
                var speed = initDir.Rotation(a + rotation);
                speed.MulSelf(entry.speed);
                var instance = { 'state' : 1, 'speed' : speed };
                this.instances.push(instance);
            }
        }
    }
}

BulletBatch.prototype.SendBulletBatch = function(bulletBatch)
{
    var instancesState = []
    for (var i = 0; i < bulletBatch.instances.length; ++i) {
        instancesState.push(bulletBatch.instances[i].state);
    }
    
    var data = {    "id"        : bulletBatch.id, 
                    "tid"       : bulletBatch.entry.id, 
                    "x"         : bulletBatch.position.x,
                    "y"         : bulletBatch.position.y,
                    "duration"  : bulletBatch.duration,
                    "rotation"  : bulletBatch.rotation,
                    "instances" : instancesState };
    
    return data;
}

BulletBatch.prototype.AllInstanceIsDeath = function(dt)
{
    for (var i = 0; i < this.instances.length; ++i) {
        if (this.instances[i].state !== 0)
            return false;
    }
    
    return true;
}

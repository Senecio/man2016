
function Notify()
{
    this.system = [];
    this.local = [];
    this.systemDelay = 0;
    this.localDelay = 0;
    this.DelayTime = 2.0;
}

Notify.prototype.System = function(msg)
{
    if(this.system.length === 0) {
        this.systemDelay = this.DelayTime;
    }
    this.system.push(msg);
}

Notify.prototype.Local = function(msg)
{
    if(this.local.length === 0) {
        this.localDelay = this.DelayTime;
    }
    this.local.push(msg);
}

Notify.prototype.Update = function(dt)
{
    this.systemDelay -= dt;
    if(this.systemDelay < 0) {
        this.system.shift();
        this.systemDelay = this.DelayTime;
    }
    
    this.localDelay -= dt;
    if(this.localDelay < 0) {
        this.local.shift();
        this.localDelay = this.DelayTime;
    }
}

Notify.prototype.Draw = function(ctx)
{
    if(this.system.length > 0) {
        var opaque = engine.commom.Util.Clamp(this.systemDelay, 0, 1);
        ctx.textAlign="center";
        ctx.font="bold 24px sans-serif";
        ctx.fillStyle="rgba(255, 32, 32, " + opaque + ")";
        ctx.fillText(this.system[0], engine.designCanvasWidth / 2, 90);
    }
    
    if(this.local.length > 0) {
        var opaque = engine.commom.Util.Clamp(this.localDelay, 0, 1);
        //ctx.globalAlpha = opaque;
        ctx.textAlign="center";
        ctx.font="18px sans-serif";
        ctx.fillStyle="rgba(255, 255, 32, " + opaque + ")";
        ctx.fillText(this.local[0], engine.designCanvasWidth / 2, 60);
    }
}
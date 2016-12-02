// 飞船
function PlayerShip()
{
    this.position = new Vec2(0, 0);
    this.direction = 0;
    this.velocity = 100;
    this.inputDirection = 0;
    this.moveDirection = "none";
    this.flashDelay = 0.0;
    this.flashAlpha = 1.0;
    this.radius = 15;
    this.buff = new Buff();
    this.buff.Init(this);
    this.live = true;
}

PlayerShip.prototype.Init = function(id, localhost, spriteSheet, type, position, direction)
{
    this.id = id;
    this.position = position;
    this.serverPosition = new Vec2(position.x, position.y);;
    this.direction = direction;
    this.inputDirection = direction;
    this.localhost = localhost;
    
    this.sprite = new Sprite();
    this.sprite.UseSpriteSheet(type, spriteSheet);
}

PlayerShip.prototype.SetMoveByDirection = function(moveDirection)
{
    this.moveDirection = moveDirection;
}

PlayerShip.prototype.GetMoveByDirection = function()
{
    return this.moveDirection;
}

PlayerShip.prototype.SetServerPosition = function(serverPositionX, serverPositionY)
{
    this.serverPosition.x = serverPositionX;
    this.serverPosition.y = serverPositionY;
}

PlayerShip.prototype.SetFlashDelay = function(delay)
{
    this.flashDelay = delay;
}

PlayerShip.prototype.Update = function(dt)
{
    if (!this.live) {
        return;
    }
    
    var moveX = 0, moveY = 0;
    var velocity = this.velocity;
    
    if (this.moveDirection == "left") {
        this.inputDirection = 270;
        moveX = -velocity * dt;
    }else if (this.moveDirection == "right") {
        this.inputDirection = 90;
        moveX = velocity * dt;
    }else if (this.moveDirection == "up") {
        this.inputDirection = 0;
        moveY = velocity * dt;
    }else if (this.moveDirection == "down") {
        this.inputDirection = 180;
        moveY = -velocity * dt;
    }else if (this.moveDirection == "left-up") {
        this.inputDirection = 315;
        moveX = -velocity * dt;
        moveY = velocity * dt;
    }else if (this.moveDirection == "left-down") {
        this.inputDirection = 225;
        moveX = -velocity * dt;
        moveY = -velocity * dt;
    }else if (this.moveDirection == "right-up") {
        this.inputDirection = 45;
        moveX = velocity * dt;
        moveY = velocity * dt;
    }else if (this.moveDirection == "right-down") {
        this.inputDirection = 135;
        moveX = velocity * dt;
        moveY = -velocity * dt;
    }
    
    else if (this.moveDirection == "right-less-up") {
        this.inputDirection = 67.5;
        moveX = velocity * dt;
        moveY = velocity * dt * 0.5;
    }else if (this.moveDirection == "right-less-down") {
        this.inputDirection = 112.5;
        moveX = velocity * dt;
        moveY = -velocity * dt * 0.5;
    }else if (this.moveDirection == "right-more-up") {
        this.inputDirection = 22.5;
        moveX = velocity * dt * 0.5;
        moveY = velocity * dt;
    }else if (this.moveDirection == "right-more-down") {
        this.inputDirection = 157.5;
        moveX = velocity * dt * 0.5;
        moveY = -velocity * dt;
    }
    
    else if (this.moveDirection == "left-less-up") {
        this.inputDirection = 292.5;
        moveX = -velocity * dt;
        moveY = velocity * dt * 0.5;
    }else if (this.moveDirection == "left-less-down") {
        this.inputDirection = 247.5;
        moveX = -velocity * dt;
        moveY = -velocity * dt * 0.5;
    }else if (this.moveDirection == "left-more-up") {
        this.inputDirection = 337.5;
        moveX = -velocity * dt * 0.5;
        moveY = velocity * dt;
    }else if (this.moveDirection == "left-more-down") {
        this.inputDirection = 202.5;
        moveX = -velocity * dt * 0.5;
        moveY = -velocity * dt;
    }
    
    if (Math.abs(this.inputDirection - this.direction) > 180) {
        if (this.direction > this.inputDirection) {
            this.direction -= 360;
        }else{
            this.direction += 360;
        }
    }
    
    this.direction = this.direction + (this.inputDirection - this.direction) * dt * 10.0;
    this.direction = this.direction;
    if (this.sprite) {
        this.sprite.rotation = this.direction;
    }
    
    this.serverPosition.x += moveX;
    this.serverPosition.y += moveY;
    
    this.serverPosition.x = engine.commom.Util.Clamp(this.serverPosition.x, 0, game.map.width);
    this.serverPosition.y = engine.commom.Util.Clamp(this.serverPosition.y, 0, game.map.height);
    
    var delta = this.serverPosition.Sub(this.position);       
    if (!(Math.abs(delta.x) < 1 && Math.abs(delta.y) < 1)) {
        var damping = 0.1;
        delta.MulSelf(damping);
        this.position.AddSelf(delta);
    }
    
    if (this.flashDelay > 0.0) {
        this.flashDelay -= dt;
        this.flashAlpha = (this.flashDelay % 0.2) / 0.2;
    }
    else {
        this.flashAlpha = 1.0;
    }
}

PlayerShip.prototype.Draw = function(ctx)
{
    if (!this.live) {
        return;
    }
    
    // 保存当前画布状态
    ctx.save();
    // 平移到坐标点
    ctx.translate(this.position.x, this.position.y);
    
    if (this.radius) {
        ctx.beginPath();
        ctx.strokeStyle = '#FFF';
        ctx.arc(0, 0, 15, 0, 2.0*Math.PI);
        ctx.stroke();
    }
    
    if (this.sprite) {
        this.sprite.alpha = this.flashAlpha;
        this.sprite.Draw(ctx);
    }
    
    if (this.nickName) {
    
        ctx.font="12px sans-serif";
        ctx.textAlign="center";
        
        //ctx.lineWidth = 1;
        //ctx.strokeStyle = '#444';
        //ctx.strokeText(this.nickName, 1, 30 - 1);
        
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = 'rgba(255,255,255,0.5)';
        ctx.shadowBlur = 1.5;
        
        ctx.fillStyle= this.localhost ? "#0ff" : "#ccc";
        ctx.fillText(this.nickName, 0, -30);
        
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'rgba(0,0,0,0)';
    }
    
    // 恢复画布状态
    ctx.restore();
}




if(typeof module !== 'undefined')
    module.exports = PlayerShip;

// 飞船
function PlayerShip()
{
    this.position = null;
    this.rotation = 0;
    this.velocity = 100;
    this.inputDirection = 0;
    this.moveDirection = "none";
    this.hp = GC.ShipMaxHp;
    this.live = true;
    this.liveTime = 0.0;
}

PlayerShip.prototype.Init = function(type, position, rotation)
{
    this.type = type;
    this.position = position;
    this.rotation = rotation;
}

PlayerShip.prototype.Rebron = function(position)
{
    this.position = position;
    this.rotation = 0;
    this.moveDirection = "none";
    this.inputDirection = this.moveDirection;
    this.hp = GC.ShipMaxHp;
    this.live = true;
    this.liveTime = 0.0;
}

PlayerShip.prototype.SetMoveByDirection = function(moveDirection)
{
    this.moveDirection = moveDirection;
}

PlayerShip.prototype.GetMoveByDirection = function()
{
    return this.moveDirection;
}

PlayerShip.prototype.Update = function(dt)
{
    var moveX = 0, moveY = 0;
    var velocity = this.velocity;
    
    if (this.live === true) {
        this.liveTime += dt;
    }
    
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
    
    
    if (Math.abs(this.inputDirection - this.rotation) > 180) {
        if (this.rotation > this.inputDirection) {
            this.rotation -= 360;
        }else{
            this.rotation += 360;
        }
    }
    
    this.rotation = this.rotation + (this.inputDirection - this.rotation) * dt * 10.0;
    
    if (!(moveX === 0 && moveY === 0))
    {
        this.position.x += moveX;
        this.position.y += moveY;
    
        this.position.x = Util.Clamp(this.position.x, 0, this.map.width);
        this.position.y = Util.Clamp(this.position.y, 0, this.map.height);
    }
}


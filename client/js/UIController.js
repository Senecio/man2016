// ingame ui控制
function UIController()
{
    this.size = { 'width' : 150, 'height' : 120 };
    this.position = new Vec2(0, engine.designCanvasHeight - this.size.height);
    this.touchIndex = 4;
    this.target = undefined;
    this.touchIndexMap = new Array("left-up", "up", "right-up", "left", "none", "right", "left-down", "down", "right-down");
}

UIController.prototype.Update = function(dt)
{
    var blockWidth = this.size.width / 3;
    var blockHeight = this.size.height / 3;
    
    this.touchIndex = 4;
    var touches = Input.GetTouches();
    for (var key in touches){
        if(touches[key]) {
            var touchX = touches[key].pageX / engine.canvasScaleX;
            var touchY = touches[key].pageY / engine.canvasScaleY;
            if (touchX >= this.position.x && touchX <= this.position.x + this.size.width && 
                touchY >= this.position.y && touchY <= this.position.y + this.size.height )
            {
                var h = Math.floor((touchX - this.position.x) / blockWidth);
                var v = Math.floor((touchY - this.position.y) / blockHeight);
                
                this.touchIndex = v * 3 + h;
                break;
            }
        }
    }
}

UIController.prototype.GetDirection = function()
{
    this.Update(0);
    return this.touchIndexMap[this.touchIndex];
}

UIController.prototype.Draw = function()
{
    var ctx = engine.context;
    ctx.save();
    
    // 透明度
    ctx.globalAlpha = 0.1;
    ctx.fillStyle="#ccc";
    ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    
    var blockWidth = this.size.width / 3;
    var blockHeight = this.size.height / 3;
    ctx.beginPath();
    for (var i = 1; i < 3; ++i) {
        // 竖线
        ctx.moveTo(this.position.x + i * blockWidth, this.position.y);
        ctx.lineTo(this.position.x + i * blockWidth, this.position.y + this.size.height);
        // 横线
        ctx.moveTo(this.position.x, this.position.y + i * blockHeight);
        ctx.lineTo(this.position.x + this.size.width, this.position.y + i * blockHeight);
    }
    ctx.stroke();
    
    ctx.restore();
}


// ÔË¶¯Ä£ºý
function MotionBlur()
{

}

MotionBlur.prototype.Init = function(numberOfFrams, width, height)
{
    this.frameIndex = 0;
    this.frames = [];
    for (var i = 0; i < numberOfFrams; ++i) {
        var frame = { canvas: document.createElement('canvas'), };
        frame.canvas.width = width;
        frame.canvas.height = height;
        frame.context = frame.canvas.getContext('2d');
        this.frames.push(frame);
    }
}

MotionBlur.prototype.Begine = function()
{
    var frame = this.frames[this.frameIndex];
    //frame.context.clearRect(0, 0, frame.canvas.width, frame.canvas.height); // user clear by himself
    return frame.context;
}

MotionBlur.prototype.End = function(screenContext, x, y)
{
    for (var i = 1; i <= this.frames.length; ++i) {
        var frame = this.frames[(this.frameIndex + i) % this.frames.length];
        var alpha = (i / this.frames.length);
        if (i < this.frames.length) alpha *= 0.15;
        screenContext.globalAlpha = alpha;
        screenContext.drawImage(frame.canvas, x, y);
    }
    
    this.frameIndex = (this.frameIndex + 1) % this.frames.length;
}
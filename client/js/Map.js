// 地图
function Map()
{
    this.bg = new Sprite();
    this.bg.image = Resource.GetImage("./images/map.jpg");
    this.bg.anchorPointX = 0;
    this.bg.anchorPointY = 1;
}

Map.prototype.Init = function(id, width, height)
{
    this.id = id;
    this.width = width;
    this.height = height;
    this.bg.width = width;
    this.bg.height = height;
}

Map.prototype.Draw = function(ctx)
{
    this.bg.Draw(ctx);
}


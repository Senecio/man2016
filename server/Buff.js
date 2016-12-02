if(typeof module !== 'undefined')
    module.exports = Buff;

var BuffItem = function(entry)
{
    this.id = entry.id;
    this.entry = entry;
    this.time = entry.time;
}
    
// buff 不能叠加,只能覆盖
function Buff()
{
    this.items = [];
}

Buff.prototype.Init = function(player)
{
    this.player = player;
}

Buff.prototype.Add = function(id)
{
    var entry = Table.GetEntry("Buff", id);
    if(entry) {
        this.items.push(new BuffItem(entry));
        return true;
    }
    return false;
}

Buff.prototype.HasType = function(type)
{
    var i = this.items.length;
    var item;
    while (--i >= 0)
    {
        item = this.items[i];
        if(item.entry.type === type){
            return true;
        }
    }
    return false;
}

Buff.prototype.GetById = function(id)
{
    var index = Util.FindIndex(this.items, id);
    if (index >= 0) {
        return this.items[index];
    }
    return null;
}

Buff.prototype.Remove = function(id)
{
    var idx = Util.FindIndex(this.items, id);
    this.items.splice(idx, 1);
}

Buff.prototype.Clear = function()
{
    this.items = [];
}

Buff.prototype.Update = function(dt)
{
    var i = this.items.length;
    var item;
    while (--i >= 0)
    {
        item = this.items[i];
        item.time -= dt;
        if (item.time < 0) {
            this.items.splice(i, 1);
        }
    }
}


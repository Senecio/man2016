if(typeof module !== 'undefined')
    module.exports = Buff;

var BuffItem = function(entry, time)
{
    this.id = entry.id;
    this.entry = entry;
    this.time = time;
}
    
// buff 不能叠加,只能覆盖
function Buff()
{
    this.items = [];
}

Buff.prototype.Init = function(ship)
{
    this.ship = ship;
}

Buff.prototype.Add = function(id, time)
{
    var entry = Table.GetEntry("Buff", id);
    if(entry) {
        var buffItem = new BuffItem(entry, time);
        this.items.push(buffItem);
        
        this.OnAdd(buffItem);
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
            var buffItem = this.items.splice(i, 1);
            this.OnRemove(buffItem);
        }
    }
}

Buff.prototype.OnAdd = function(item)
{
    if (item.entry.type === 'wudi') {
        this.ship.SetFlashDelay(item.time);
    }
}


Buff.prototype.OnRemove = function(item)
{
    if (item.entry.type === 'wudi') {
        this.ship.SetFlashDelay(0);
    }
}


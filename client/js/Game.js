function IsMobile() {
    return navigator.userAgent.match(/android|iphone|ipod|blackberry|meego|symbianos|windowsphone|ucbrowser/i)
}
  
function IsIOS() {
    return navigator.userAgent.match(/iphone|ipod|ios/i)
}

function _checkAudio (device) {

    device.audioData = !!(window['Audio']);
    device.webAudio = !!(window['AudioContext'] || window['webkitAudioContext']);
    var audioElement = document.createElement('audio');
    var result = false;

    try {
        if (result = !!audioElement.canPlayType)
        {
            if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''))
            {
                device.ogg = true;
            }

            if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '') || audioElement.canPlayType('audio/opus;').replace(/^no$/, ''))
            {
                device.opus = true;
            }

            if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, ''))
            {
                device.mp3 = true;
            }

            // Mimetypes accepted:
            //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //   bit.ly/iphoneoscodecs
            if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''))
            {
                device.wav = true;
            }

            if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, ''))
            {
                device.m4a = true;
            }

            if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''))
            {
                device.webm = true;
            }
        }
    } catch (e) { }
}

var device = {}
_checkAudio (device);
function json2str(o) {
    var arr = []; 
    var fmt = function(s) { 
        if (typeof s == 'object' && s != null) 
            return json2str(s);
            
        return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s; 
    } 
    for (var i in o) 
        arr.push("'" + i + "':" + fmt(o[i]));

    return '{' + arr.join(',') + '}'; 
}

//alert(json2str(device));

voices = [];
if(window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = function() {
        voices = window.speechSynthesis.getVoices();
    }
}

// 为简单使用库,声明常用全局函数
Vec2 = engine.commom.Vec2;
Util = engine.commom.Util;
Sprite = engine.core.Sprite;
Input = engine.core.Input;
Resource = engine.core.Resource;
GameLog = engine.commom.Logger;
//GameLog.socket = io('http://192.168.1.222:38086');

// 开启socket.io日志
//localStorage.debug = '*';

var shipImage = engine.core.Resource.GetImage("./images/sprites.png");

var shipSheet = new engine.core.SpriteSheet();
shipSheet.SetImage(shipImage);
shipSheet.Add("ship", 0, 0, 37, 42);
shipSheet.Add("enemy_purple", 37, 0, 42, 43);
shipSheet.Add("enemy_bee", 79, 0, 36, 43);
shipSheet.Add("enemy_ship", 116, 0, 41, 43);
shipSheet.Add("enemy_circle", 158, 0, 32, 33);
shipSheet.Add("explosion1", 0, 64, 64, 64);
shipSheet.Add("explosion2", 64, 64, 64, 64);
shipSheet.Add("explosion3", 128, 64, 64, 64);
shipSheet.Add("explosion4", 192, 64, 64, 64);
shipSheet.Add("explosion5", 256, 64, 64, 64);
shipSheet.Add("explosion6", 320, 64, 64, 64);
shipSheet.Add("explosion7", 384, 64, 64, 64);
shipSheet.Add("explosion8", 448, 64, 64, 64);
shipSheet.Add("explosion9", 512, 64, 64, 64);
shipSheet.Add("explosion10", 576, 64, 64, 64);
shipSheet.Add("explosion11", 640, 64, 64, 64);
shipSheet.Add("explosion12", 704, 64, 64, 64);

var bulletImage = engine.core.Resource.GetImage("./images/turbo.png");
var bulletSheet = new engine.core.SpriteSheet();
bulletSheet.SetImage(bulletImage);
bulletSheet.Add("1", 0, 0, 5, 20);
bulletSheet.Add("2", 5, 0, 5, 20);
bulletSheet.Add("3", 10, 0, 5, 20);

//var joystickBgImage = engine.core.Resource.GetImage("./images/Joystick_bg.png");
//var joystickBtnImage = engine.core.Resource.GetImage("./images/Joystick_bt.png");

var explosionSound = new Howl({
  src: ['./sound/sound_dead1.mp3', './sound/sound_dead1.ogg']
});

var dropHpSound = new Howl({
  src: ['./sound/noo.mp3', './sound/noo.ogg']
});

function DropHpVibrate()
{
    if ("vibrate" in navigator) {
        // vibration API supported
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
        if (navigator.vibrate) {
            navigator.vibrate(0);
            navigator.vibrate([200, 200, 200, 200, 200]);
        }
    }
}

function GameSpeech(cn_talk, en_talk)
{
    if ('speechSynthesis' in window) {
        // Synthesis support. Make your web apps talk!
        var synth = window.speechSynthesis;
        for(i = 0; i < voices.length ; i++) {
            if(voices[i].lang === "zh-CN") {
                var utterThis = new SpeechSynthesisUtterance(cn_talk);
                utterThis.voice = voices[i];
                utterThis.pitch = 1;
                utterThis.rate = 1;
                synth.cancel();
                synth.speak(utterThis);
                return;
            }
        }
        
        for(i = 0; i < voices.length ; i++) {
            if(voices[i].lang === "en_US") {
                var utterThis = new SpeechSynthesisUtterance(en_talk);
                utterThis.voice = voices[i];
                utterThis.pitch = 1;
                utterThis.rate = 1;
                synth.cancel();
                synth.speak(utterThis);
                return;
            }
        }
    }
}

function GameSpeechDorpHp()
{
    GameSpeech("看路,傻逼!", "he he,SB!");
}

function GameSpeechBeHit()
{
    var array = ["大意了!", "好疼!", "没关系!"];
    var idx = Math.floor(Math.random() * 3) ;
    GameSpeech(array[idx], "sorry!");
}

function GameSpeechStart()
{
    GameSpeech("我说开始游戏啊,大爷!", "come on, baby!");
}

function Game()
{
    this.initialization = false;

    if ('SpeechRecognition' in window) {
      // Speech recognition support. Talk to your apps!
      alert(" recognition support. Talk to your apps!");
    }
}

Game.prototype.Init = function(canvas, net)
{
    if (this.initialization === true) {
        return;
    }
    
    this.initialization = true;
    engine.InitCanvas(canvas, true);
    
    this.net = net;
    var nickNameInput = document.getElementById('nickNameInput');
    net.socket.emit('enterGame', { nickName : nickNameInput.value });
    
    if(IsMobile()) {
        //engine.showStats = true;
    }
    
    this.camera = new engine.core.Camera();
    //this.camera.x = engine.designCanvasWidth / 2;
    //this.camera.y = engine.designCanvasHeight / 2;
    //this.camera.zoom = 0.5;
    this.cameraFllower = new CameraFllow();
    this.cameraFllower.Init(this.camera);
    
    //this.motionBlur = new MotionBlur();
    //this.motionBlur.Init(8, engine.designCanvasWidth, engine.designCanvasHeight);
    
    this.Notify = new Notify();
    
    this.myShip = undefined;
    this.playerData = {};
    this.ships = {};
    this.guns = {};
    this.bulletBatchs = [];
    
    this.effects = [];
    this.removeEffects = [];
    this.pingStartTime = 0;
    this.pingValue = -1;
    this.pingInterval = 1.0;
    this.pingDuration = 0.0;
    this.drawBulletNumber = 0;

    this.controller = undefined;
    this.joystick = undefined;
    if (IsMobile()) {
        //this.controller = new UIController();
        this.joystick = new UIJoystick();
    }
    
    engine.onFrame = function(game) {
        return function(dt) { 
            game.Frame(dt); 
        }; 
    }(this);
    
    engine.Start();
    
    // 开启网络连接
    this.PacketHandler();
    
    GameSpeechStart();
}

Game.prototype.FullScreen = function(enter)
{
    if (enter) {
        if(!isWindows && screenfull.enabled && !screenfull.isFullscreen){ screenfull.request(); }
    }else {
        if(!isWindows && screenfull.enabled && screenfull.isFullscreen){ screenfull.exit(); }
    }
}

Game.prototype.AddShip = function(ship)
{
    this.ships[ship.id] = ship;
}

Game.prototype.RemoveShipById = function(id)
{
    delete this.ships[id];
}

Game.prototype.UpdateShips = function(dt)
{
    for (var key in this.ships) {
        this.ships[key].Update(dt);
    }
}

Game.prototype.DrawShips = function(context)
{
    for (var key in this.ships) {
        this.ships[key].Draw(context);
    }
}

Game.prototype.AddGun = function(gun)
{
    this.guns[gun.id] = gun;
}

Game.prototype.RemoveGun = function(gun)
{
    delete this.guns[gun.id];
}

Game.prototype.UpdateGuns = function(dt)
{
    for (key in this.guns) {
        var gun = this.guns[key];
        gun.Update(dt);
    }
}

Game.prototype.DrawGuns = function(dt)
{
    for (key in this.guns) {
        this.guns[key].Draw();
    }
}

Game.prototype.AddBulletBatch = function(bulletBatch)
{
    this.bulletBatchs.push(bulletBatch);
}

Game.prototype.RemoveBulletBatchById = function(bulletBatchId)
{
    var idx = Util.FindIndex(this.bulletBatchs, bulletBatchId);
    if (idx >= 0) {
        this.bulletBatchs.splice(idx, 1);
    }
}

Game.prototype.UpdateBullets = function(dt)
{
    var bb, inst, nx, ny;
    for (var i = this.bulletBatchs.length - 1; i >= 0; --i) {
        bb = this.bulletBatchs[i];
        bb.duration += dt;
        
        for (var j = 0; j < bb.instances.length; ++j)
        {
            inst = bb.instances[j];
            if (inst.state === 0)
                continue;
            
            nx = bb.position.x + inst.speed.x * bb.duration;
            ny = bb.position.y + inst.speed.y * bb.duration;
            if(nx < 0 || ny < 0 || nx > game.map.width || ny > game.map.height) {
                inst.state = 0;
            }
        }
            
        if (bb.AllInstanceIsDeath()) {
            this.bulletBatchs.splice(i, 1);
            //console.log("剩余子弹批", this.bulletBatchs.length);
        }
    }
}

Game.prototype.DrawBullets = function(ctx)
{
    for (var i = this.bulletBatchs.length - 1; i >= 0; --i) {
        var bb = this.bulletBatchs[i];
        bb.Draw(ctx);
    }
}

Game.prototype.PlayExplosion = function(x, y)
{
    var animation = new engine.core.SpriteAnimation();
    animation.SetAnimation(["explosion1","explosion2","explosion3","explosion4",
                            "explosion5","explosion6","explosion7","explosion8",
                            "explosion9","explosion10","explosion11","explosion12"], shipSheet);
    
    animation.x = x;
    animation.y = y;
    animation.Play(false, function(game) {
        return function(anim) {
            game.RemoveEffect(anim);
        }
    }(this));
    this.AddEffect(animation);
}

Game.prototype.AddEffect = function(effect)
{
    this.effects.push(effect);
}

Game.prototype.RemoveEffect = function(effect)
{
    for (var i = 0; i < this.effects.length; ++i) {
        if (this.effects[i] == effect) {
            this.removeEffects.push(i);
            break;
        }
    }
}

Game.prototype.UpdateEffects = function(dt)
{
    for (var i = 0; i < this.removeEffects.length; ++i) {
        this.effects.splice(this.removeEffects[i], 1);
    }
    
    this.removeEffects = [];
    
    for (var i = 0; i < this.effects.length; ++i){
        this.effects[i].Update(dt);
    }
}

Game.prototype.DrawEffects = function()
{
    for (var i = 0; i < this.effects.length; ++i){
        this.effects[i].Draw(engine.context);
    }
}

Game.prototype.ClearAll = function()
{
    this.myShip = undefined;
    this.ships = {};
    this.guns = {};
    this.bullets = {};
    this.removeBullets = [];
    
    this.effects = [];
    this.removeEffects = [];
}

Game.prototype.IsVisible = function(x, y, width, height)
{
    if (typeof width === 'undefined') width = 1;
    if (typeof width === 'undefined') height = 1;
    
    var r1 = new engine.commom.Rect(0, 0, engine.designCanvasWidth, engine.designCanvasHeight);
    r1.CenterPointAt(this.camera.x, this.camera.y);
    var r2 = new engine.commom.Rect(0, 0, width, height);
    r2.CenterPointAt(x, y);
    return r1.IntersectRect(r2) !== null;
}

Game.prototype.Frame = function(dt)
{
    this.Update(dt);
    this.Draw();
}

Game.prototype.DrawBloodBoard = function(ctx)
{
    var drawRoundRect = function(ctx, x, y, width, height, radius, fill, stroke) {  
        if (typeof stroke == "undefined") {  
            stroke = true;  
        }  
        if (typeof radius === "undefined") {  
            radius = 5;  
        }  
        ctx.beginPath();  
        ctx.moveTo(x + radius, y);  
        ctx.lineTo(x + width - radius, y);  
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);  
        ctx.lineTo(x + width, y + height - radius);  
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y+ height);  
        ctx.lineTo(x + radius, y + height);  
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);  
        ctx.lineTo(x, y + radius);  
        ctx.quadraticCurveTo(x, y, x + radius, y);  
        ctx.closePath();  
        if (stroke) {  
            ctx.stroke();
        }  
        if (fill) {  
            ctx.fill();  
        }
    }
    
    if (typeof this.playerData.hp !== 'undefined') {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        drawRoundRect(ctx, 4, 10, 60, 20, 4, false);
        
        var colorTable = ['red', 'red','yellow','white']
        ctx.fillStyle = colorTable[this.playerData.hp];
        
        for(var i = 0; i < this.playerData.hp; ++i) {
            ctx.fillRect(6 + i * 19, 12, 18, 16);
        }
    }
}

Game.prototype.DrawPingText = function(ctx)
{
    ctx.font="10px Verdana";
    ctx.fillStyle="rgb(255,255,255)";
    var text = 'Ping: ' + this.net.pingInterval + 'ms';
    ctx.fillText(text, engine.designCanvasWidth - 80, 20);
    if (this.myShip) {
        text = "地图id: " + this.map.id;
        ctx.fillText(text, engine.designCanvasWidth - 80, 40);
        text = "位置x: " + Math.ceil(this.myShip.position.x);
        ctx.fillText(text, engine.designCanvasWidth - 80, 60);
        text = "位置y: " + Math.ceil(this.myShip.position.y);
        ctx.fillText(text, engine.designCanvasWidth - 80, 80);
        text = "画子弹数: " + this.drawBulletNumber;
        ctx.fillText(text, engine.designCanvasWidth - 80, 100);
        this.drawBulletNumber = 0;
    }
}

Game.prototype.Draw = function()
{
    var ctx = engine.context;
    ctx.save();
    
    // motion blur. but not general enough.
    //ctx.fillStyle="rgba(0,0,0,0.1)";
    //ctx.fillRect(0,0, engine.designCanvasWidth, engine.designCanvasHeight);
    
    ctx.clearRect(0,0, engine.designCanvasWidth, engine.designCanvasHeight);
    
    // 使用相机
    this.camera.Begin(ctx, engine.designCanvasWidth, engine.designCanvasHeight);
    
    if (this.map) { this.map.Draw(ctx); }
    
    //this.DrawGuns(ctx);
    this.DrawBullets(ctx);
    
    if (this.motionBlur) {
        var blurCtx = this.motionBlur.Begine();
        blurCtx.clearRect(0,0, engine.designCanvasWidth, engine.designCanvasHeight);
        this.camera.Begin(blurCtx, engine.designCanvasWidth, engine.designCanvasHeight);
        this.DrawShips(blurCtx);
        this.camera.End(blurCtx);
        this.motionBlur.End(ctx, this.camera.x - engine.designCanvasWidth/2 , this.camera.y + engine.designCanvasHeight /2);
    }else {
        this.DrawShips(ctx);
    }
    
    //this.DrawShips(ctx);
    this.DrawEffects(ctx);
    
    // 结束相机
    this.camera.End(ctx);
    
    this.DrawBloodBoard(ctx);
    this.DrawPingText(ctx);
    
    this.Notify.Draw(ctx);
    
    if (this.controller) {
        this.controller.Draw();
    }
    if (this.joystick) {
        this.joystick.Draw(ctx);
    }
/*
var context = ctx;
var Red = "#ff5e99";
var Blue = "#29a1f1";
var Black = "#000";
var x = 10;
var y = 40;
var txt_p1 = "I like ";
var txt_p2 = "玩家";
var txt_p3 = " color but I also like ";
var txt_p4 = "pink";
var txt_p5 = " color!";
var txt_p6 = "Nevermind, I prefer ";
var txt_p7 = " to ";
var txt_p8 = "... ;)!";

context.font = '14px Verdana';
context.fillStyle = "#ffffff";
context.fillText(txt_p1,x,y);
x += context.measureText(txt_p1).width;

context.save();
context.font = 'normal 24px Impact';
context.fillStyle = Blue;
context.fillText(txt_p2,x,y);
x += context.measureText(txt_p2).width;
context.restore();

context.fillText(txt_p3,x,y);
x += context.measureText(txt_p3).width;

context.save();
context.font = 'bold px Times New Roman';
context.fillStyle = Red;
context.fillText(txt_p4,x,y);
x += context.measureText(txt_p4).width;
context.restore();

context.fillText(txt_p5,x,y);
x += context.measureText(txt_p5).width;

y+= 24;
x = 10;

context.fillText(txt_p6,x,y);
x += context.measureText(txt_p6).width;

context.save();
context.font = 'bold 20px Impact';
context.fillStyle = Blue;
context.fillText(txt_p2,x,y);
x += context.measureText(txt_p2).width;
context.restore();

context.fillText(txt_p7,x,y);
x += context.measureText(txt_p7).width;

context.save();
context.font = 'bold 24px Times New Roman';
context.fillStyle = Red;
context.fillText(txt_p4,x,y);
x += context.measureText(txt_p4).width;
context.restore();

context.fillText(txt_p8,x,y);
*/

    ctx.restore();
}

Game.prototype.Update = function(deltaTime)
{
    this.Notify.Update(deltaTime);
    
    if (this.net.disconnected) {
        return;
    }
    
    var socket = this.net.socket;
    var sendDir = false;
    var direction = 'none'
    if (this.myShip && this.myShip.live) {
        if (this.controller) {
            if (this.myShip.GetMoveByDirection() !== this.controller.GetDirection())
            {
                direction = this.controller.GetDirection();
                sendDir = true;
            }
        } else if (this.joystick) {
            if (this.myShip.GetMoveByDirection() !== this.joystick.GetDirection())
            {
                direction = this.joystick.GetDirection();
                sendDir = true;
            }
        } else {
            var moveDirection = this.myShip.GetMoveByDirection()
            if (Input.KeyboardIsDown("left")) {
                    direction = "left";

                if (Input.KeyboardIsDown("up")) {
                    direction = "left-up";
                }else if (Input.KeyboardIsDown("down")) {
                    direction = "left-down";
                }
            }else if (Input.KeyboardIsDown("right")) {
                    direction = "right";
                    
                if (Input.KeyboardIsDown("up")) {
                    direction = "right-up";
                    
                }else if (Input.KeyboardIsDown("down")) {
                    direction = "right-down";
                }
            }else if (Input.KeyboardIsDown("up")) {
                direction = "up";
                        
            }else if (Input.KeyboardIsDown("down")) {
                direction = "down";
            }
            
            if (direction != moveDirection) {
                sendDir = true;
            }
        }
    }
    
    if (sendDir === true) {
        var now = new Date().getTime();
        if (typeof this.dirCd === 'undefined' || now - this.dirCd > 30) {
            var data = { "direction" : direction };
            socket.emit('moveByDirection',  data);
            this.dirCd = now;
        }
    }
    
    //this.UpdateGuns(deltaTime);
    this.UpdateBullets(deltaTime);
    this.UpdateShips(deltaTime);
    this.UpdateEffects(deltaTime);
    
    if (this.cameraFllower) {
        this.cameraFllower.Update(deltaTime);
    }
    
    if (this.joystick) {
        this.joystick.Update(deltaTime);
    }
}

Game.prototype.PacketHandler = function()
{
    var game = this;
    var socket = this.net.socket;
    
    socket.on('enterGameBack', function (data) {
        ShowLoginUI(false);
        ShowGameContent(true);
        
        //console.log(data);
        game.map = new Map();
        game.map.Init(data.mapId, data.mapWidth, data.mapHeight);
    });
    
    socket.on('newPlayer', function (data) {
        if (game.myShip === undefined)
        {
            game.myShip = new PlayerShip();
            game.myShip.Init(data.id, true, shipSheet, data.ship_type, new Vec2(data.ship_position_x , data.ship_position_y), data.ship_rotation);
            game.myShip.nickName = data.nickName;
            game.playerData.hp = data.ship_hp;
            game.myShip.SetMoveByDirection(data.ship_moveDirection);
            game.AddShip(game.myShip);
            game.cameraFllower.Init(game.camera,
                                    new engine.commom.AABB(new Vec2(engine.designCanvasWidth/2, engine.designCanvasHeight/2), 
                                                           new Vec2(game.map.width - engine.designCanvasWidth/2, game.map.height - engine.designCanvasHeight/2))
                                    );
            game.cameraFllower.Attach(game.myShip, new Vec2(0, 0));
        }
        else{
            var otherPlayerShip = new PlayerShip();
            otherPlayerShip.Init(data.id, false, shipSheet, data.ship_type, new Vec2(data.ship_position_x , data.ship_position_y), data.ship_rotation);
            otherPlayerShip.nickName = data.nickName;
            otherPlayerShip.SetMoveByDirection(data.ship_moveDirection);
            game.AddShip(otherPlayerShip);
        }
        game.Notify.Local("[" + data.nickName + "]进入游戏!!!");
    });
    
    socket.on('playerList', function (array) {
        var data, otherPlayerShip;
        for (var i = 0; i < array.length; ++i) {
            data = array[i];
            otherPlayerShip = new PlayerShip();
            otherPlayerShip.Init(data.id, false, shipSheet, data.ship_type, new Vec2(data.ship_position_x , data.ship_position_y), data.ship_rotation);
            otherPlayerShip.nickName = data.nickName;
            otherPlayerShip.SetMoveByDirection(data.ship_moveDirection);
            game.AddShip(otherPlayerShip);
            
            if (data.buffList) {
                for (var j = 0; j < data.buffList.length; ++j) {
                    otherPlayerShip.buff.Add(data.buffList[j].buff_id, data.buffList[j].buff_time);
                }
            }
        }
    });
    
    socket.on('losePlayer', function(socket) { return function (data) {
        game.RemoveShipById(data.id);
        game.Notify.Local("[" + data.nickName + "]离开了游戏!!!");
    }}(game.socket));
    
    socket.on('moveByDirectionBack', function (data) {
        var ship = game.ships[data.id];
        if (ship) {
            ship.SetServerPosition(data.ship_position_x, data.ship_position_y);
            ship.SetMoveByDirection(data.ship_moveDirection);
        }
    });
    
    socket.on('newCompetitionTiming', function (data) {
        game.Notify.System(data.second + "秒后进入正式模式!!!");
    });
    
    socket.on('cancelCompetition', function (data) {
        game.Notify.System("取消进入正式模式!!!");
    });
    
    socket.on('addBuff', function (data) {
        var ship = game.ships[data.id];
        if (ship) {
            ship.buff.Add(data.buff_id, data.buff_time);
        }
    });
    
    socket.on('updateShipHp', function (data) {
        if (game.myShip) {
            game.playerData.hp = data.ship_hp;
            if (data.reason === 'dropHp') {
                dropHpSound.play();
                DropHpVibrate();
                GameSpeechDorpHp();
            }
            if (data.reason === 'beHit') {
                dropHpSound.play();
                DropHpVibrate();
                GameSpeechBeHit();
            }
        }
    });
    
    socket.on('shipDead', function (data) {
        var ship = game.ships[data.id];
        if (ship) {
            ship.live = false;
            game.PlayExplosion(data.ship_position_x , data.ship_position_y);
            if (game.myShip.id === data.id){
                game.playerData.hp = 0;
                explosionSound.play();
                game.Notify.Local("你坚持了" + data.ship_live_time.toFixed(2)+"秒!");
            }
        }
    });
    
    socket.on('shipReborn', function (data) {
        var ship = game.ships[data.id];
        if (ship) {
            ship.live = true;
            ship.Init(data.id, game.myShip.id === data.id, shipSheet, data.ship_type, new Vec2(data.ship_position_x , data.ship_position_y), data.ship_rotation);
            ship.SetMoveByDirection(data.ship_moveDirection);
            ship.SetServerPosition(data.ship_position_x, data.ship_position_y);
        }
    });
    
    socket.on('bulletBatch', function (data) {
        //console.log(data);
        var bb;
        var idx = Util.FindIndex(game.bulletBatchs, data.id);
        if (idx >= 0) {
            bb = game.bulletBatchs[idx]
            bb.duration = data.duration;
            bb.position.x = data.x;
            bb.position.y = data.y;
            bb.rotation = data.rotation;
            for (var i = 0; i < data.instances.length; ++i) {
                bb.instances[i].state = data.instances[i];
            }
        }else {
            bb = new BulletBatch();
            bb.Init(data.id, data.tid, bulletSheet, new Vec2(data.x, data.y), data.duration, data.rotation);
            game.AddBulletBatch(bb);
        }
    });
    
    socket.on('bulletBatchList', function (array) {
        var data, bb;
        for (var i = 0; i < array.length; ++i) {
            data = array[i];
            //console.log(data);
            bb = new BulletBatch();
            bb.Init(data.id, data.tid, bulletSheet, new Vec2(data.x, data.y), data.duration, data.rotation);
            game.AddBulletBatch(bb);
        }
    });
}

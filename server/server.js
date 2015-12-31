var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();

var options = {
    key: fs.readFileSync('/etc/apache2/ssl/private.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/ssl.crt')
};

var serverPort = 3030;

var server = https.createServer(options, app);
var io = require('socket.io')(server);
var Weapon = require("./objects.js").Weapon;
var Player = require("./objects.js").Player;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var connected_users= {};

var d = new Date();

io.on('connection', function(socket) {
    
    socket.on('user click',function(coords){
        
        var player = connected_users[socket.id];
        var dT = Math.sqrt(Math.pow(coords.x - player.getX(), 2) + Math.pow(coords.y - player.getY(), 2)) / player.vel;
        
        var count = 0;
        while(!(player.getX() >= coords.x - 1 && player.getX() <= coords.x + 1)){
            player.moveX((coords.x - player.getX()) / dT);
            player.moveY((coords.y - player.getY()) / dT);
            io.to(socket.id).emit('update player', player.getX(), player.getY());
        }
        
        player.setX(coords.x);
        player.setY(coords.y);
        
        io.to(socket.id).emit('update player', player.getX(), player.getY());
    }); 
    
    socket.on('user type',function(keys){
        var player = connected_users[socket.id];
        
        if(player){ 
            if(keys.space){
                if(!player.getAtkStart()){
                    player.setAtkStart((new Date()).getTime());
                }
            }else{
                if(player.getAtkStart() > 0){
                    player.setAtkStart((new Date()).getTime() - player.getAtkStart());
                    
                    if(player.getAtkStart() > 250){
                        //swing
                        player.weapon.swing({x:player.getX(), y:player.getY()}, player.facing);
                    }else{
                        //thrust
                        player.weapon.thrust({x:player.getX(), y:player.getY()}, player.facing);
                    }
                    player.setAtkStart(0);
                }
            }
            
            var test = player.update(keys);
            if(test){
                io.to(socket.id).emit('update player', player.getX(), player.getY(), player.weapon.getX(), player.weapon.getY());
            }
        }
        
    });
    
    socket.on('player color',function(color){
        var player = connected_users[socket.id];
        player.color = color;
    });
    
    socket.on('player connect', function(name){
        connected_users[socket.id] = new Player();
        console.log(name+" logged in with socket: " + socket.id);
    });
});

server.listen(serverPort, function() {
    console.log('listening on *:' + serverPort);
});
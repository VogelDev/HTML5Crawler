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

var room = 'chat';


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var connected_users= [];


var KEYS = {
    LEFT:37,
    UP:38,
    RIGHT:39,
    DOWN:40
};

io.on('connection', function(socket) {
    
    socket.on('user input',function(coords){
        
        var player = connected_users[socket.id];
        console.log(player, coords);
        
        var deltaT = Math.sqrt(Math.pow(coords.x - player.x, 2) + Math.pow(coords.y - player.y, 2)) / player.vel;
        
        var count = 0;
        while(!(player.x >= coords.x - 1 && player.x <= coords.x + 1)){
            player.x += (coords.x - player.x) / deltaT;
            player.y += (coords.y - player.y) / deltaT;
            io.to(socket.id).emit('update player', player);
        }
        player.x = coords.x;
        player.y = coords.y;
        console.log(count, player, coords);
    }); 
    
    socket.on('player color',function(color){
        var player = connected_users[socket.id];
        player.color = color;
    });
    
    socket.on('player connect', function(name){
        connected_users[socket.id] = {x:0, y:0, vel: 2, moving: true, color:"white", name:name};
        console.log(name+" logged in with socket: " + socket.id);
    });
});

server.listen(serverPort, function() {
    console.log('listening on *:' + serverPort);
});
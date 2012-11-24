var express, app, io, server, request;

express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);
request = require('request');

app.enable('trust proxy');

app.configure('development', function(){
  io.configure(function(){
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.enable('browser client gzip');
    io.set('log level', 1);
  });
});

app.configure('production', function(){
  io.configure(function(){
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 20);
  });
});

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

app.get("/*", function(req, res){
  res.sendfile(__dirname + '/public/app.html');
});

app.use(app.router);

server.listen(process.env.PORT || 3000, function(){
  var addr = server.address();
  console.log("    ⚡ app listening on http://" + addr.address + ":" + addr.port);
});


io.sockets.on('connection', function(socket) {
  
  socket.on('subscribe', function(data) {
    socket.set('room', data.room, function() { console.log('room ' + data.room + ' saved')});
    socket.join(data.room);
  });
    
  socket.on('navigate', function(url) {
    socket.get('room', function(err, room) {
      request.head(url, function (error, response, body) {
        if (!('x-frame-options' in response.headers)) {
          io.sockets.in(room).emit('navigate', url);
        } else {
          io.sockets.in(room).emit('error', url);
        }
      });
    });
  });
  
});



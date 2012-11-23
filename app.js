var express, app, io, server;

express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));
app.use(app.router);

server.listen(process.env.PORT || 3000, function(){
  var addr = server.address();
  console.log("    ⚡ app listening on http://" + addr.address + ":" + addr.port);
});


io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 20);
});

io.sockets.on('connection', function(socket) {
    
  socket.on('navigate', function(url) {
    if (/^http/i.test(url)) {
      io.sockets.emit('navigate', url);
    }
  });
  
});

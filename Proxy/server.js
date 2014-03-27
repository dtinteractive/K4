var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    //engine = require('engine.io'),
    nconf = require('nconf'),
    //RedisStore = require('socket.io/lib/stores/redis'),
    //redis = require('socket.io/node_modules/redis'),
    //pub = redis.createClient(),
    //sub = redis.createClient(),
    //client = redis.createClient(),
    sugar = require('sugar'),
    swig = require('swig'),
    sockets;

app.configure(function(){
    app.set('port', 8000);
});

server.listen(app.get('port'));

/*
sockets = engine.attach(server);

sockets.on('connection', function(socket) {
    console.log('got connection');

    socket.on('message', function (data) {
        console.log('got message: ', data);

        socket.send('OMGZ it worked!!');
    });
});
*/

var clients = [];

/*
// Setup redis store for socket.io
io.set('store', new RedisStore({
    redisPub: pub,
    redisSub: sub,
    redisClient: client
}));
*/

// Setup config
nconf.file({file: 'conf/config.json'});
nconf.load();

io.of('/robot').on('connection', function (socket) {
    console.log('got robot connnection');

    socket.on('message', function (data) {
        console.log('got message: ', data);

        socket.send('OMGZ it worked!!!');
    });
});

io.of('/remote').on('connection', function(socket){
    clients.push(socket);

    console.log('Got connection');

    socket.on('response', function(data){
        console.log(data);
    });

    socket.on('disconnect', function(){
        console.log('Disconnecting');
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
    });

    // Up Action
    socket.on('up', function(data){
        console.log('Up - ' + data.action);
    });

    // Down Action
    socket.on('down', function(data){
        console.log('Down - ' + data.action);
    });

    // Left Action
    socket.on('left', function(data){
        console.log('Left - ' + data.action);
    });

    // Right Action
    socket.on('right', function(data){
        console.log('Right - ' + data.action);
    });
});

/*******************************
------ Setup for Express -------
********************************/
app.use(express.bodyParser());
app.use('/static', express.static('static'));
// Swig Templating Engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({cache: false});

/*******************************
------ Express routes ----------
********************************/
require('./lib/routes.js')(app);

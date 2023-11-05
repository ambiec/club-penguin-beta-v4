let express = require('express');
let app = express();

app.use(express.static('public'));

let http = require('http');
let server = http.createServer(app);

let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening on localhost: " + port);
});

let io = require('socket.io');
io = new io.Server(server);
let connects = []
let newClient;

io.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    //Only emit if socket.id is new
    if (!connects.includes(socket.id)) {
        newClient = socket.id;
        io.emit('newConnect', newClient);
        connects.push(socket.id);
    }

    socket.on('existingSprites', (data) => {
        io.emit('existingSprites', data);

    })

    //Sprite position data from client
    socket.on('mouse',(data) => {
        io.emit('mouse', data); //Emit position to all clients
    })

    //Message data from client
    socket.on('msg', (data) => {
        console.log("Received a 'msg' event");
        io.emit('msg', data); //Emit message to all clients
    })


    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
        


        //Remove disconnected client from list #Source: https://sentry.io/answers/remove-specific-item-from-array/
        let dcClient = socket.id
        io.emit('clientSplice', dcClient);
    })
})
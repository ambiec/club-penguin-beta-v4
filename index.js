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

io.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    //Receive msgObj from client
    socket.on('msg', (data) => {
        console.log("Received a 'msg' event");

        //Emit message to all clients
        io.emit('msg', data);
    })


    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
    })
})
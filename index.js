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
let connects = [];
let newClient;

let allSpritesObj = {};

io.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    //Only emit if socket.id is new
    if (!connects.includes(socket.id)) {
        newClient = socket.id;
        io.emit('newConnect', newClient);
        connects.push(socket.id);
    }

    // [B] 'mouse' event
    // Update allSpritesObj so dupes are most updated position, then emit back to ALL CLIENTS
    socket.on('mouse',(data) => {
        for(let client in allSpritesObj){
            if (data.id == client){
                allSpritesObj[client].sprX = data.x;
                allSpritesObj[client].sprY = data.y;
            }
        }
        io.emit('mouse', data); //Emit position to ALL CLIENTS
    })

    // [A] 'allSprites' event
    // Receiving & storing all sprObjs in allSpritesObj, then emit back to ALL CLIENTS
   socket.on('allSprites', (data) => {
        allSpritesObj = Object.assign(allSpritesObj, data);
        console.log(allSpritesObj);
        io.emit('allSprites', allSpritesObj); 
   })

    // [C] 'msg' event  
    // Receive & emit data to/from CLIENT
    socket.on('msg', (data) => {
        io.emit('msg', data); //Emit message to ALL CLIENTS
    })


    socket.on('disconnect', () => {
        let delSprite;
        console.log('Client disconnected: ' + socket.id);
        for(let client in allSpritesObj) {
            if (socket.id == allSpritesObj[client].id) {
                delSprite = allSpritesObj[client].id;
                delete allSpritesObj[client];
            }
        }
        //Remove disconnected client from list #Source: https://sentry.io/answers/remove-specific-item-from-array/
        io.emit('delSprite', delSprite);
    })
})
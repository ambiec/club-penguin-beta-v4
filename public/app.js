let msgInput = document.getElementById('msg-input');
let chatFeed = document.getElementById('chat-feed');
let sendButton = document.getElementById('send-button');
let chatContainer = document.getElementById('chat-container');

let spr = [];
let sprObj = {};
let key;

let r;
let g;
let b;

let spriteMove=false;

let coords = [];
let x;
let y;
let targetX;
let targetY;
let clicked = false;

let clickID;
let msgData;
let msgId;

let spriteDupes = {};
let newKey;
let delSpr;

let socket = io();

    socket.on('connect',() => {
        console.log('client connected');
    })

    // Receiving 'newConnect' event from SERVER
    socket.on('newConnect', (newClient)=> {

        r = random(255);
        g = random(255);
        b = random(255);

        // Create sprite unique to newClient socket.id
        spr[newClient] = createSprite(
            width/2, height/2, 40, 40);
        spr[newClient].shapeColor = color(r,g,b);
        spr[newClient].rotateToDirection = true;
        spr[newClient].maxSpeed = 4;
        spr[newClient].friction = 0.1;

        // Create sprite data object sprObj - different from spr array
        key = newClient;
        sprObj[key] = {
            id: newClient,
            sprX: spr[newClient].position.x,
            sprY: spr[newClient].position.y,
            r: r,
            g: g,
            b: b
        }

        if (socket.id == newClient) {
            socket.emit('allSprites', sprObj);
        }
        // for (let client in spr) {
        //     console.log(spr[client].index);
        // }
        
    })

    socket.on('allSprites', (data) => {
        for (let client in data) {
            let clientId = data[client].id;
         if (clientId !== key && socket.id == key) {
                newKey = clientId; //if 'clicked' then use xy from mouse? access target xy?
                // console.log(clientId); //targetted new client
                spr[newKey] = createSprite(
                    data[client].sprX, data[client].sprY, 40, 40);
                spr[newKey].shapeColor = color(data[client].r, data[client].g, data[client].b);
                spr[newKey].rotateToDirection = true;
                spr[newKey].maxSpeed = 4;
                spr[newKey].friction = 0.1;

                spriteDupes[newKey] = {
                    id: newKey,
                    sprX: spr[newKey].position.x,
                    sprY: spr[newKey].position.y,
                    r: data[client].r,
                    g: data[client].g,
                    b: data[client].b
                }

                
            }
        }
    })

    // Receiving 'mouse' event from SERVER
    socket.on('mouse', (data) => {
        targetX = data.x;
        targetY = data.y;
        clickID = data.id;

        // console.log(clickID + ' clicked'); // which client clicked
        
        storeCoordinate(targetX, targetY, coords);

        // Loop through coordinate values
        for (let i = 0; i < coords.length; i+=2) {
            x = coords[i];
            y = coords[i+1];
        } 
        
        // Keep sprite out of chat box area
        if(y>inputRect.bottom + 30){
            spriteMove = true;
        }
    })


    socket.on('msg', (data) => {
        console.log("Message arrived!");
        // console.log(data);

        //Receive message from server
        //need to get text to pop up above sprite
        msgData = data.msg;
        msgId = data.id;

        //I tried JSON.stringify, data.data, data.value lol

        /* Original code from socket example - append to HTML
            let msgEl = document.createElement('p');
            msgEl.innerHTML = data.msg;
            chatFeed.appendChild(msgEl);*/

    })

    socket.on('delSprite',(data) => { //data = disconnected socket
        //if data is in spritedupes, delete spritedupe with the id = data
        //can i access spritedupes here?
        // if (socket.id != data) {
        //     console.log(socket.id);
        // }
        
        for (let i = 0; i < spr.length; i++) {
            console.log(spr[i]);
        }
        
        //delete object but actual drawn sprites are in spr array   
        // for (let client in sprObj) {
        //     if(sprObj[client].id == data){
        //         delete sprObj[client];
        //         // console.log(sprObj[client]);
        //     }
        // }

        // for (let client in spriteDupes) {
        //     if(spriteDupes[client].id == data){
        //         delete spriteDupes[client];
        //         // console.log(spriteDupes[client]);
        //     }
        // }
        
        
    })


    //'Enter' key to submit message
    msgInput.addEventListener('keydown', function (e) { // 
        if (e.key === 'Enter' || e.key === 13) {
            sendButton.click();
            console.log('clicked');
        }
    });

    sendButton.addEventListener('click', () => {
        sendMessage();
    })

    //
    function sendMessage() {
        let curMsg = msgInput.value;
        let msgObj = {
            "msg": curMsg,
            "id": socket.id
        };

        //Socket: send msgObj to server
        socket.emit('msg', msgObj);

        //Clear the message input field
        msgInput.value = "";
    }

//#Source - HTML element coordinates: https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
let inputRect = chatContainer.getBoundingClientRect();
// console.log(inputRect.top, inputRect.right, inputRect.bottom, inputRect.left);


/////////////////
// P5 | P5Play //
/////////////////
let logOnce = false;

//#Source - sprites: https://creative-coding.decontextualize.com/making-games-with-p5-play/
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);

    //p5.play sprite
    //Step 1. Draw sprite
    //Step 2. If mousePressed, set sprite x,y
}

function draw() {
    background(255);

    // Match clickID to sprObj.id #Source: ChatGPT
    for (let client in sprObj) {
        if (sprObj[client].id == clickID) {
            if (spriteMove === true) {
                spr[client].attractionPoint(0.5, x, y);
            }

            let distance = dist(spr[client].position.x, spr[client].position.y, x, y);
            if (distance < 5) { // Stop the sprite when it's close to the mouse
                spr[client].setSpeed(0);
                spriteMove = false;

            }
        }
    }

    for (let client in spriteDupes) {
        if (spriteDupes[client].id == clickID) {
            if (spriteMove === true) {
                spr[client].attractionPoint(0.5, x, y);
            }

            let distance = dist(spr[client].position.x, spr[client].position.y, x, y);
            if (distance < 5) { // Stop the sprite when it's close to the mouse
                spr[client].setSpeed(0);
                spriteMove = false;
            }
        }
    }
  
  drawSprites();
  printMessage();
}


//#Source: https://stackoverflow.com/questions/7030229/storing-coordinates-in-array-in-javascript
function storeCoordinate(x, y, array) {
    array.push(x);
    array.push(y);
}

function mouseClicked() {
    //send sprite position to server
    let mousePos = {
        id: socket.id,
        x: mouseX,
        y: mouseY
    }
    clicked = true;
    socket.emit('mouse', mousePos); 
}

function printMessage() {
    textSize(16);
    textAlign(CENTER);

    for(let client in sprObj) {
        if (sprObj[client].id == msgId) {
            text(msgData, spr[client].position.x, spr[client].position.y - 40);
        }
    }

    for(let client in spriteDupes) {
        if (spriteDupes[client].id == msgId) {
            text(msgData, spr[client].position.x, spr[client].position.y - 40);
        }
    }

    // 
    // console.log('text stored');
}





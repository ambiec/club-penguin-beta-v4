let msgInput = document.getElementById('msg-input');
let chatFeed = document.getElementById('chat-feed');
let sendButton = document.getElementById('send-button');
let chatContainer = document.getElementById('chat-container');

let spr =[];
let sprObj = {};
let spriteMove=false;

let coords = [];
let x;
let y;
let targetX;
let targetY;
let updated = false;

let clickID;
let msgData;
let key;

let socket = io();

    socket.on('connect',() => {
        console.log('client connected');
    })

    // Receiving 'newConnect' event from SERVER
    socket.on('newConnect', (newClient)=> {

        // Create sprite unique to newClient socket.id
        spr[newClient] = createSprite(
            width/2, height/2, 40, 40);
        spr[newClient].shapeColor = color(0);
        spr[newClient].rotateToDirection = true;
        spr[newClient].maxSpeed = 4;
        spr[newClient].friction = 0.1;

        // Create sprite data object sprObj - different from spr array
        key = newClient;
        sprObj[key] = {
            id: newClient,
            sprX: spr[newClient].position.x,
            sprY: spr[newClient].position.y,
        }

        // console.log(spr);
        socket.emit('existingSprites', sprObj);

    })

    socket.on('existingSprites', (data) => {
        for (let clientId in data) {
            if (clientId != socket.id) {
                
                console.log(socket.id);
                // console.log(data[clientId].sprX + ', '+ data[clientId].sprY);

                if(!spr[clientId]) {
                    let existingX = data[clientId].sprX;
                    let existingY = data[clientId].sprY;

                    console.log(existingX + ', ' + existingY);

                    spr[clientId] = createSprite(
                        existingX, existingY, 40, 40);
                    spr[clientId].shapeColor = color(0);
                    spr[clientId].rotateToDirection = true;
                    spr[clientId].maxSpeed = 4;
                    spr[clientId].friction = 0.1;
                }
                // } else {
                //     let mousePos = {
                //         id: clientId,
                //         x: data[clientId].sprX,
                //         y: data[clientId].sprY
                //         }
                
                //         socket.emit('mouse', mousePos);
                // }
                
            }
        }
    })


    /*socket.on('clientSplice',(dcClient) => {
        // console.log(sprites.clientId);
        // console.log(dcClient);
        for (let i = 0; i < sprites.length; i++) {
            if (sprites[i].clientId === dcClient) {
                sprites[i].sprite.remove();
                sprites.splice(i, 1);
                // console.log(sprites);
            }
        }
    })*/

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
        //I tried JSON.stringify, data.data, data.value lol



        /* Original code from socket example - append to HTML
            let msgEl = document.createElement('p');
            msgEl.innerHTML = data.msg;
            chatFeed.appendChild(msgEl);*/

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
        let msgObj = {"msg": curMsg};

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
    for (let clientId in sprObj) {
        if (sprObj.hasOwnProperty(clientId) && sprObj[clientId].id === clickID) {
            // console.log(clickID + " exists in the object");

            if (spriteMove === true) {
                spr[clientId].attractionPoint(0.5, x, y);
            }

            let distance = dist(spr[clientId].position.x, spr[clientId].position.y, x, y);
            if (distance < 5) { // Stop the sprite when it's close to the mouse
                spr[clientId].setSpeed(0);

                sprObj[clientId].sprX = spr[clientId].position.x;
                sprObj[clientId].sprY = spr[clientId].position.y; 

                if (spriteMove === true) {
                    socket.emit('existingSprites', sprObj);
                    console.log (sprObj);
                    spriteMove = false;
                }
            }
        }
    }

    
  
  drawSprites();
//   printMessage();
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

        socket.emit('mouse', mousePos); 
}

function printMessage() {
    textSize(16);
    textAlign(CENTER);
    text(msgData, spr.position.x, spr.position.y - 40);
    // console.log('text stored');
}





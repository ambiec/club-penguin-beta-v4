let msgInput = document.getElementById('msg-input');
let chatFeed = document.getElementById('chat-feed');
let sendButton = document.getElementById('send-button');
let chatContainer = document.getElementById('chat-container');

let msgData;


window.addEventListener('load', ()=>{
    console.log('loaded');
    let socket = io();

    socket.on('connect',() => {
        console.log('client connected');
    })

    socket.on('msg', (data) => {
        console.log("Message arrived!");
        console.log(data);
        

        //Receive message from server
        //need to get text to pop up above sprite

        msgData = data.msg;
        //I tried JSON.stringify, data.data, data.value lol

        //original appending code from socket example
        // let msgEl = document.createElement('p');
        // msgEl.innerHTML = data.msg;
        // chatFeed.appendChild(msgEl);

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
})

//#Sources - HTML element coordinates: https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
let inputRect = chatContainer.getBoundingClientRect();
console.log(inputRect.top, inputRect.right, inputRect.bottom, inputRect.left);

let spriteDrawn=false;
let coords = [];
let x;
let y;

//#Source - sprites: https://creative-coding.decontextualize.com/making-games-with-p5-play/
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    spr = createSprite(
        width/2, height/2, 40, 40);
    spr.shapeColor = color(255,0,0);
    spr.rotateToDirection = true;
    spr.maxSpeed = 4;
    spr.friction = 0.1;

    //p5.play sprite
    //Step 1. Draw sprite
    //Step 2. If mousePressed, set sprite x,y
}

function draw() {
    background(255);
  if (spriteDrawn === true) {
    console.log(x);
    spr.attractionPoint(0.5, x, y);
  }
  let distance = dist(spr.position.x, spr.position.y, x, y);
        if (distance < 5) { // Stop the sprite when it's close to the mouse
            spr.setSpeed(0);
            spriteDrawn = false;
        }
  drawSprites();
  printMessage();
    
    // console.log("sprite drawn");
}

//#Source: https://stackoverflow.com/questions/7030229/storing-coordinates-in-array-in-javascript
function storeCoordinate(x, y, array) {
    array.push(x);
    array.push(y);
}

function mouseClicked() {
    storeCoordinate(mouseX, mouseY, coords);
    // to loop through coordinate values
    for (let i = 0; i < coords.length; i+=2) {
        x = coords[i];
        y = coords[i+1];
    } 
    
    //inputRect.top, inputRect.right, inputRect.bottom, inputRect.left
    if(y>inputRect.bottom){
        spriteDrawn = true;
    }
}

function printMessage() {
    textSize(16);
    textAlign(CENTER);
    text(msgData, spr.position.x, spr.position.y - 40);
    // console.log('text stored');
}





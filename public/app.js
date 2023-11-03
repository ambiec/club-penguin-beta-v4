window.addEventListener('load', ()=>{
    console.log('loaded');



})



let spriteDrawn=false;
let coords = [];
let x;
let y;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    spr = createSprite(
        width/2, height/2, 40, 40);
    spr.shapeColor = color(0);
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
        if (distance < 5) {
            // Stop the sprite when it's close to the mouse
            spr.setSpeed(0);
            spriteDrawn = false;
        }
  drawSprites();
    
    // console.log("sprite drawn");
}

function storeCoordinate(x, y, array) {
    array.push(x);
    array.push(y);
}

function mouseClicked() {
    spriteDrawn = true;
    storeCoordinate(mouseX, mouseY, coords);
    // to loop through coordinate values
    for (let i = 0; i < coords.length; i+=2) {
        x = coords[i];
        y = coords[i+1];
    } 
}







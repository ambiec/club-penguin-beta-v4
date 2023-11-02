window.addEventListener('load', ()=>{
    console.log('loaded');
})



let spriteDrawn=false;
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
    spr.attractionPoint(0.5, mouseX, mouseY);
  }
  let distance = dist(spr.position.x, spr.position.y, mouseX, mouseY);
        if (distance < 5) {
            // Stop the sprite when it's close to the mouse
            spr.setSpeed(0);
            spriteDrawn = false;
        }
  drawSprites();
    
    // console.log("sprite drawn");
}

function mouseClicked() {
    spriteDrawn = true;
}
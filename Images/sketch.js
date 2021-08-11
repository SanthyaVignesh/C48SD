var mario, bg, tower, towerGroup;
var ob, ob1, ob2, obGroup, obImg, iOb, IobGrp;
var bb, bbImg, bbGrp;
var iTower, iTowerGrp;
var cloud, cloudImg, cGroup;
var bush, bushImg, bGroup;
var iGround;
var randomNum;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var hitScore = 2;
var fc;
var life, life2, lifeImg;
var bgMusic, lifeLost, marioJump, dieSnd;
var gameOver, gameOverImg;
var reset, resetImg;

function preload(){
  bgImg = loadImage("/Images/bg1.jpg");
  bbImg = loadImage("/Images/ob.png");
  m_running = loadAnimation("/Images/m1.png","/Images/m2.png","/Images/m3.png","/Images/m4.png","/Images/m5.png");
  m_crash = loadAnimation("/Images/m1.png");
  obImg = loadAnimation("Images/BlueOb.png", "Images/blueob1.png");
  flatOb = loadImage("/Images/flatob.png");
  towerImg = loadImage("/Images/tower.PNG");
  cloudImg = loadImage("/Images/cloud.png");
  bushImg = loadImage("/Images/bush.png");
  lifeImg = loadImage("/Images/life.png");
  bgMusic = loadSound("/Music/bgMusic.mp3");
  marioJump = loadSound("/Music/marioJump.mp3");
  dieSnd = loadSound("/Music/die.mp3");
  gameOverImg = loadImage("/Images/gameOver.png");
  resetImg = loadImage("/Images/reset.png");
}

function setup(){
 createCanvas(windowWidth, windowHeight);
 bg = createSprite(600,330,400,20);
 bg.addImage("bi",bgImg);
 bg.scale =1.2;
 bg.x = bg.width /2;

 bgMusic.play();

 mario = createSprite(200,493,20,20);
 mario.addAnimation("run", m_running); 
 mario.addAnimation("xyz", m_crash);

 iGround = createSprite(mario.x, mario.y+90,height,5);
 iGround.visible = false;

 life = createSprite(mario.x-50, height - 600,20,20);
 life.addImage(lifeImg);
 life.scale = 0.05;

 life2 = createSprite(mario.x-30, height - 600,20,20);
 life2.addImage(lifeImg);
 life2.scale = 0.05;
 
 gameOver= createSprite(width/2, height/2-150, 20,20);
 gameOver.addImage(gameOverImg);
 gameOver.scale = 0.3;

 reset = createSprite(width/2,height/2-80,20,20);
 reset.addImage(resetImg);
 reset.scale = 0.15;

 mario.setCollider("rectangle",0,0,mario.width, mario.height);
 mario.debug = true;

 hitScore = 2;
 
 obGroup = new Group();     
 towerGroup = new Group(); 
 bbGrp = new Group(); 
 bGroup = new Group();
 iTowerGrp = new Group();
 iObGrp = new Group();
}




function draw(){
  background(rgb(94, 145, 254));

  camera.position.x = mario.x+500;
  life.x = mario.x-50;
  life2.x = mario.x-25;
  gameOver.x = mario.x+450; 
  reset.x = mario.x+450;

  if(gameState === PLAY){
    gameOver.visible = false;
    reset.visible = false;
    mario.velocityX = (5+score/120);
    iGround.x = mario.x;
    score = score+Math.round(getFrameRate()/60);
  if (mario.x+300 > bg.x){
    bg.x = mario.x + bg.width/2-150;
  }
  mario.velocityY = 0;
  if(keyDown("UP_ARROW") && mario.y>height/2-20){
    mario.velocityY = -20;
    marioJump.play();
  }
  mario.velocityY = mario.velocityY+5;
  mario.collide(iGround);

  var x = Math.round(random(1,3));
  switch(x){
    case 1: x = 60;
    break;
    case 2: x = 100;
    break;
    case 3: x = 140;
    break;
    default: break;
  }
  console.log(x);

  if(frameCount%x === 0){
  randomNum = Math.round(random(1,4));
  if(randomNum === 1){
    spawnObstacles();
  }

  if(randomNum === 2){
    spawnTowers();
  }

  if(randomNum === 3){
    spawnbb();
  }

  if(randomNum === 3){
  spawnBushes();
  }
      }
  }

  mario.collide(towerGroup);
  mario.collide(iObGrp);

  if (obGroup.isTouching(mario) || iTowerGrp.isTouching(mario) || bbGrp.isTouching(mario)) {
    fc = frameCount;
    dieSnd.play();
  }
  if (fc + 5 === frameCount) {
    hitScore = hitScore-1;
  }

  if(hitScore === 1){
    life2.visible = false;
  }

  if(hitScore === 0){
    gameState = END;
    life.visible = false;
  }

  if(gameState === END){
    gameOver.visible = true;
    reset.visible = true;
    mario.setVelocity(0,0);
    mario.changeAnimation("xyz", m_crash);
    iGround.velocityX = 0;   
    obGroup.velocityX = 0;
    iTowerGrp.velocityX = 0;
    iObGrp.velocityX = 0;
    towerGroup.velocityX = 0;
    bGroup.velocityX = 0;
    if(mousePressedOver(reset)){
      gameReset();
    }
  }


  drawSprites();
  textSize(20);
  fill("black");
  text("Score: "+score,life.x+1000,life.y+20);
  text("Life: ", life.x-50,life.y+10);
}

function spawnBushes(){
  bush = createSprite(mario.x+width,540,20,20);
  bush.addImage(bushImg);
  bush.scale = 0.4;
  mario.depth = bush.depth;
  mario.depth = mario.depth+1;
  bush.lifetime = width/bush.velocityX;
  bGroup.add(bush);
}

function spawnObstacles(){
    ob = createSprite(mario.x+width,height-100,20,20);
    ob.addAnimation("xyz",obImg);
    ob.scale = 3;
    ob1 = createSprite(mario.x+width, height-150,20,20);
    ob1.addAnimation("xyz", obImg);
    ob1.scale = 3;
    ob2 = createSprite(mario.x+width, height-200,20,20);
    ob2.addAnimation("xyz", obImg);
    ob2.scale = 3;
    iOb = createSprite(mario.x+width, height-250,30,10);
    iOb.visible = false;
    ob.lifetime = width/ob.velocityX;
    iOb.lifetime = width/ob.velocityX;
    ob1.lifetime = width/ob.velocityX;
    ob2.lifetime = width/ob.velocityX;
    iObGrp.add(iOb);
    obGroup.add(ob1);
    obGroup.add(ob2);
    obGroup.add(ob);
}

function spawnTowers(){
    tower = createSprite(mario.x+width, height-135,20,20);
    tower.addImage(towerImg);
    tower.depth = tower.depth;
    iTower = createSprite(tower.x-34, tower.y+10, 10, 100);
    iTower.visible = false;
    tower.scale = 1.5;
    tower.lifetime = width/tower.velocityX;
    iTower.lifetime = width/iTower.velocityX;
    towerGroup.add(tower);
    iTowerGrp.add(iTower);
}

function spawnbb(){
    var y = Math.round(random(1,2));
    switch(y){
      case 1: y = height-160;
      break;
      case 2: y = height-240; 
      break;
      default: break;
    }
    bb = createSprite(mario.x+width, y,20,20);
    bb.addImage(bbImg);
    bb.scale = 0.15;
    bb.lifetime = width/bb.velocityX;
    bbGrp.add(bb);
}

function gameReset(){
    gameState = PLAY;
    hitScore = 2;
    mario.changeAnimation("run", m_running);
    score = 0;
    life.visible = true;
    life2.visible = true;
    towerGroup.destroyEach();
    iTowerGrp.destroyEach();
    bbGrp.destroyEach();
    obGroup.destroyEach();
    iObGrp.destroyEach();
    bGroup.destroyEach();
  }
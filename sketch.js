//Create variables here
var database;
var dog,dogimg,doghappy;
var dataref;
var foodstock,foodstockimg;
var fedTime,lastFed;
var feed,add;
var food;
var state;
var gameState;
var dogdead,doglazy,dogvaccination,dogrunning,runningleft;
var bedroom,washroom,livingroom,garden;
var injection,vaccination,time;

function preload()
{
  //load images here
  dogimg = loadImage("Dog.png");
  doghappy = loadImage("happydog.png");
  //dogSad = loadImage();
  dogdead = loadImage("deadDog.png");
  doglazy = loadImage("Lazy.png");
  bedroom = loadImage("Bed Room.png");
  washroom = loadImage("Wash Room.png");
  injection = loadImage("Injection.png");
  vaccination = loadImage("Vaccination.jpg");
  dogrunning = loadImage("running.png");
  runningleft = loadImage("runningLeft.png");
  livingroom = loadImage("Living Room.png");
  garden = loadImage("Garden.png");
  dogvaccination = loadImage("dogVaccination.png");
  foodstockimg = loadImage("Food Stock.png");
}

function setup() {
  createCanvas(800, 700);
  database = firebase.database();

  dataref = database.ref("food");

  dataref.on("value",function(data){
    foodstock= data.val();
    food.updatestock(foodstock);
  });

  state = database.ref("gamestate");

  state.on("value",function(data){
    gameState = data.val();
  });

  fedTime = database.ref("LastFed");

  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  food = new Food();
  
  dog = createSprite(400,350,50,50);
  dog.addImage(dogimg);

  feed = createButton("Feed Dog");
   feed.position(350,50);
   

   add = createButton("add food");
   add.position(480,50);
  
  
  
}


function draw() {  
  background(46,139,87);

  getFeedTime();

  time = hour();

  if(time===(lastFed+1)){
    update("notHungry");
    food.Garden();
  }

  else if(time===(lastFed+2)){
    update("toiletTime");
    food.washRoom();
  }

  else if(time>(lastFed+2)&&time<(lastFed+3)){
    update("resting");
    food.livingRoom();
  }

  else if(time>(lastFed+3)&&time<(lastFed+4)){
    update("sleepy");
    food.bedRoom();
  }

  else{
    update("hungry");
    food.display();
  }


  if(gameState!="hungry"){
    feed.hide();
    add.hide();
    dog.remove();
  }

  if(foodstock!==0){
    dog.addImage(doghappy);
    textSize(20);
    fill("black");
    stroke(70);
    text("Looks Tasty !",50,200);
    //function getFeedTime();
  }

  else{
    dog.addImage(dogimg);
    textSize(20);
    fill("black");
    stroke(70);
    text("I am Hungry",50,200);
  }

  if(foodstock<=0){
    foodstock= 0;
    database.ref("/").update({
      food:foodstock
    })
    food.updatestock(foodstock);
  }

  feed.mousePressed(feedDog);

  add.mousePressed(addfoodstock);

  food.display();

  
  
  //textSize(30);
 // fill("red");
  //text("food: "+food,660,100);

  drawSprites();
  //add styles here
  textSize(30);
  fill("yellow");
  stroke(40);
  text("Last Fed: "+lastFed+":00",320,650)

}

 function getFeedTime(){
  if(feedDog){
    lastFed=hour();
  }
  database.ref("/").update({
    LastFed:lastFed
  })
  
}


function feedDog(){

  if(foodstock!==0){
    foodstock--;
    database.ref("/").update({
      food:foodstock
    })

    textSize(20);
    fill("black");
    stroke(70);
  
    text("hmm Yummy!",50,250);

    

  food.updatestock(foodstock);

  
}
}

function addfoodstock(){
 foodstock++;
  database.ref("/").update({
    food:foodstock
  })
  food.updatestock(foodstock);
}

function update(State){
  database.ref("/").update({
    gamestate:State
  })
}





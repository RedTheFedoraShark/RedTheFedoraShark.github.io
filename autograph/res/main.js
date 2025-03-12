const Camera = {
  x: 0,
  y: 0,
  zoom: 1
}

const scaleWidth = 80;
const axisWeight = 2.5;
const numberSize = 16;
const numberOffset = numberSize;

function setup() 
{
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(2)
  colorMode(RGB)
  
  // Set Camera Position
  Camera.x = windowWidth/2;
  Camera.y = windowHeight/2;  
  
  noLoop();
}

function draw() {
  background(200);
  strokeWeight(axisWeight)
  textSize(numberSize);
  

  // x and y axis
  // x positive
  line(0+Camera.x, 0+Camera.y, windowWidth+Camera.x, 0+Camera.y);

  // x negative
  line(0+Camera.x, 0+Camera.y, -(windowWidth+Camera.x), (0+Camera.y));
  
  // y positive
  line(0+Camera.x, 0+Camera.y, 0+Camera.x, -(windowHeight+Camera.y)); 
  
  // y negative
  line(0+Camera.x, 0+Camera.y, 0+Camera.x, windowHeight+Camera.y); 

  // scale grid 
  strokeWeight(axisWeight*0.1)
  drawingContext.setLineDash([4])
  textAlign(CENTER)
  // x vals positive
  for (i = 0+Camera.x+scaleWidth; i < windowWidth; i += scaleWidth)
    { line(i, 0, i, windowHeight) // line
      text(((i-Camera.x)/scaleWidth).toString(), i, 0+Camera.y+numberOffset) // number
    }
  // x vals negative
  for (i = 0+Camera.x-scaleWidth; i > 0; i -= scaleWidth)
    { line(i, 0, i, windowHeight) // line
      text(((i-Camera.x)/scaleWidth).toString(), i, 0+Camera.y+numberOffset) // number 
    }


  // y vals positive
  for (i = 0+Camera.y; i > 0; i -= scaleWidth)
    { line(0, i, windowWidth, i) // line
      text((-(i-Camera.y)/scaleWidth).toString(), 0+Camera.x+numberOffset/2, i+numberOffset) // number
    }
  // y vals negative
  for (i = 0+Camera.y; i < windowHeight; i += scaleWidth)
    { line(0, i, windowWidth, i) // line
      text((-(i-Camera.y)/scaleWidth).toString(), 0+Camera.x+numberOffset/2, i+numberOffset) // number
    }

  // additional lines

}
class City {
  constructor (x, y)
  {
    this.name
    this.x = x
    this.y = y
    this.connections = []
  }

  connect(city)
  {
    this.connections.push(city)
  }
}

function closestIndex(array)
{
  min = 0
  for (let i = 0; i < array.length; i++)
  {
    if (array[i]!=0 && array[i]<array[min])
      min = i
  }
  return min
}

const cityNo = 8
const avgConnections = 2
const deviation = 1
let cities = []

function setup() 
{
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(30)
  colorMode(RGB)
  
  for (let i = 0; i < cityNo; i++) //generate cities
  {
    x = Math.floor(Math.random() * (windowWidth - 100)) + 50
    y = Math.floor(Math.random() * (windowHeight - 100)) + 50
    cities.push(new City(x, y))
  }
  
  for (i in cities) // generate connection for each city
  {
    distances = []
    for (j in cities) // calculate from each city
    {
      dx = (cities[j].x - cities[i].x) * (cities[j].x - cities[i].x)
      dy = (cities[j].y - cities[i].y) * (cities[j].y - cities[i].y)
      distance = Math.sqrt(dx+dy)
      distances.push([Math.round(distance), parseInt(j)])
    }
    distances = distances.sort((a,b)=> a[0] > b[0])

    conns = avgConnections + (Math.floor(Math.random() * 3) - 1) * deviation
    for (let j = 0; j < conns; j++)
    {
      cities[i].connections.push(distances[j+1][1])

    }
    // console.log(cities[i].connections)
  }
  noLoop()

}

function draw() 
{
  background(220);
  fill(255, 255, 255)
  fill(204, 102, 0)
  // text(frameCount, width-25, 15);
  fill(0)
  strokeWeight(1)
  for (i in cities)
  {
    noStroke()
    circle(cities[i].x, cities[i].y, 15)
    for (j in cities[i].connections)
    {
      stroke(0)
      p1 = [cities[i].x, cities[i].y]
      p2 = [cities[cities[i].connections[j]].x, cities[cities[i].connections[j]].y]
      console.log(p1, p2)
      line(p1[0],p1[1],p2[0],p2[1])
    }
  }
}

function mouseReleased()
{
  // ant.x[2] = mouseX
  // ant.y[2] = mouseY
}

  
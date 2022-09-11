const TL = document.getElementById("tileSize")
const TLV = document.getElementById("tileSizeV")
const MSX = document.getElementById("mapSizeX")
const MSY = document.getElementById("mapSizeY")
const Top = document.getElementById("top") // add resizeObserver later for dynamic canvas resize
const canvas = document.getElementById("cvs")

TL.addEventListener("input", ()=>
{
    TLV.innerHTML=TL.value
})

/*
Top.addEventListener("resize", ()=>
{
    canvas.width = Top.clientWidth
    canvas.height = Top.clientHeight
})

canvas.width = Top.clientWidth
canvas.height = Top.clientHeight
var tileSize = 30

function draw()
{
    const ctx = canvas.getContext('2d')
    let colour="white"
    for (let i = 0; i < canvas.width; i+=tileSize)
    {
        if (colour=="white") colour = "black"
        else colour="white"
        for (let j = 0; j < canvas.height; j+=tileSize)
        {
            if (colour=="white") colour = "black"
            else colour="white"
            ctx.fillStyle = colour
            ctx.fillRect(j, i, tileSize, tileSize)
        }
    }

}

draw()*/

class Camera 
{
    constructor()
    {
        this.x = 0
        this.y = 0
        this.zoom = 100
        this.canvas = canvas
    }
}

class Map
{
    constructor(x=20, y=10)
    {
        this.Tiles = Array.from(Array(y), () => new Array(x))
        for (let i = 0; i < y; i++)
        {
            for (let j = 0; j < x; j++)
            {
                this.Tiles[i][j] = new Tile()
            }
        }
    }
}

class Tile 
{
    constructor(type)
    {
        switch (type)
        {
            case "wall":
                this.texture
                this.passable = false
                break;
            case "plain":
                this.texture
                this.passable = true
                break;
            case "hive":
                this.texture
                this.passable = false
                break;
            default:
                this.texture
                this.passable = true
                break;
        }
        this.type = type
    }
}

class Entity
{
    constructor()
    {
        this.x
        this.y
    }
}

class Food extends Entity
{
    constructor()
    {
        this.count
        this.isCarried
    }
}

class Ant extends Entity
{
    constructor()
    {
        this.hive
        this.role
        this.health
        this.velocity
        this.vector
        this.task
    }
}

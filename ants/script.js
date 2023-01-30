const Top = document.getElementById("top") // add resizeObserver later for dynamic canvas resize
const canvas = document.getElementById("cvs")

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
canvas.width = Top.clientWidth
canvas.height = document.body.clientHeight//800

class Tile 
{
    constructor(type="empty")
    {
        switch (type)
        {
            case "wall":
                this.texture = new Image(20, 20)
                this.texture.src = "wall.png"
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
                this.texture = new Image(20, 20)
                this.texture.src = "empty_big.png"
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
        this.x = 0
        this.y = 0
    }
}

class Marker extends Entity
{
    constructor()
    {
        this.strength = 100
    }
}

class M_Visible extends Marker
{}
class M_Food extends Marker
{}
class M_Enemy extends Marker
{} 

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
    constructor(hive = 0, mapX, mapY)
    {
        super()
        this.hive = hive
        this.health = 100
        this.velocity = Math.floor(Math.random() * 2)
        this.vector = [Math.floor(Math.random() * 3)-1, Math.floor(Math.random() * 3)-1]
        this.task = null
        this.perception = 3
        this.borderX = mapX
        this.borderY = mapY
        this.hiveX
        this.hiveY
    }
    
}

class Worker extends Ant
{
    constructor(hive = 0, mapX, mapY)
    {
        super(hive, mapX, mapY)
        this.x = Math.floor(Math.random() * 18)+1
        this.y = Math.floor(Math.random() * 18)+1
        this.health = 100
        this.texture = new Image(20, 20)
        this.texture.src = "ant_big.png"
    }

    decide(antmap, tilemap)
    {
        if (this.task == null)
        {
            this.idle(antmap, tilemap)
            console.log(`${this.hive}:worker:idle | ${this.velocity}:${this.vector}`)
        }
    }

    idle(antmap, tilemap)
    {
        while (true)
        {
            this.velocity = Math.floor(Math.random() * 2)
            this.vector = [Math.floor(Math.random() * 3)-1, Math.floor(Math.random() * 3)-1]
            if (tilemap.tiles[this.x+this.vector[0]*this.velocity][this.y+this.vector[1]*this.velocity].passable)
                if (antmap.tiles[this.x+this.vector[0]*this.velocity][this.y+this.vector[1]*this.velocity]==null) break;
        }
        
        this.x += this.vector[0]*this.velocity
        this.y += this.vector[1]*this.velocity

        if (this.x < 0)
            this.x += this.borderX
        else if (this.x > this.borderX - 1)
            this.x -= this.borderX

        if (this.y < 0)
            this.y += this.borderY
        else if (this.y > this.borderY - 1)
            this.y -= this.borderY
    }

    gather(){}
    explore(){}
    flee(){} 
    goback(){}
}

class Hive extends Entity
{
    constructor(hiveIndex, antCount = 25, x, y)
    {
        super(1,1)
        this.hive = hiveIndex
        this.ants = []
        this.explored = []
        for (let i = 0; i < antCount; i++)
        {
            this.ants.push(new Worker(hiveIndex, x, y))
        }
        this.relations = []
        /*
        for (let i = 0; i < x; i++)
        {

        }
        */
    }
}

class Camera 
{
    constructor()
    {
        this.x = -20
        this.y = -20
        this.zoom = 1.00
        this.canvas = canvas
    }
}

class Map
{
    constructor(x=20, y=10, mode=0)
    {
        this.tiles = Array.from(Array(y), () => new Array(x))
        switch(mode)
        {
            case 1: // antmap
                for (let i = 0; i < y; i++)
                {
                    for (let j = 0; j < x; j++)
                    {
                        this.tiles[i][j] = null
                    }
                }
                break
            case 2: // markermap
                break
            default: // tilemap
                for (let i = 0; i < y; i++)
                {
                    for (let j = 0; j < x; j++)
                    {   
                        if (i == 0 || j == 0 || i == y-1 || j == x-1)
                            this.tiles[i][j] = new Tile("wall")
                        else
                            this.tiles[i][j] = new Tile()
                    }
                }
                break;
        }
    }
}

class Simulation
{
    constructor(hiveCount = 1, mapX = 75, mapY = 75)
    {
        this.pause = false
        this.turn = 0
        this.camera = new Camera()
        this.map = new Map(mapX, mapY)
        this.antmap = new Map(mapX, mapY, 1)
        this.hives = []
        for (let i = 0; i < hiveCount; i++)
        {
            this.hives.push(new Hive(i, 10, mapX, mapY))
        }
        this.hives.forEach(hive => {
            console.log("Hive: " + hive.hive)
            hive.ants.forEach(ant =>{
                this.antmap.tiles[ant.x][ant.y] = ant
            })
        })
    }

    run()
    {
        document.addEventListener("keydown", (event)=>{this.keydown(event)}, false)
        this.render()
        console.log("Run Successful!")
        this.game()
        setInterval(()=>{this.game()}, 100)
    }

    game()
    {
        if (this.pause) return

        // update antmap[]
        for (let i = 0; i < this.antmap.tiles.length; i++) 
        {
            for (let j = 0; j < this.antmap.tiles[i].length; j++) 
            {
                this.antmap.tiles[i][j] = null
            }
        }
        //for (let x of this.antmap.titles)
        
        this.hives.forEach(hive => {
            console.log("Hive: " + hive.hive)
            hive.ants.forEach(ant =>{
                this.antmap.tiles[ant.x][ant.y] = ant
            })
        })

        console.log("Turn: " + this.turn)
        this.hives.forEach(hive => {
            console.log("Hive: " + hive.hive)
            hive.ants.forEach(ant =>{
                ant.decide(this.antmap, this.map)
            })
        })
        this.turn += 1
        this.render()
    }

    render()
    {
        // fill out the background
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
        
        let x = 0 - this.camera.x // camera X
        let y = 0 - this.camera.y // camera Y

        for (let i = 0; i < this.map.tiles.length; i++)
        {
            // break when outside the thing
            for (let j = 0; j < this.map.tiles[i].length; j++)
            {
                // break when outside the thing
                ctx.drawImage(this.map.tiles[i][j].texture, x, y, (this.map.tiles[0][0].texture.width*this.camera.zoom), (this.map.tiles[0][0].texture.height*this.camera.zoom))
                if (this.antmap.tiles[i][j] != null) 
                    ctx.drawImage(this.antmap.tiles[i][j].texture, x, y, (this.map.tiles[0][0].texture.width*this.camera.zoom), (this.map.tiles[0][0].texture.height*this.camera.zoom))
                //console.log(this.map.tiles[i][j])
                //console.log(x)
                //console.log(y)
                x += this.map.tiles[0][0].texture.width*this.camera.zoom
            }
            x = 0 - this.camera.x
            y += this.map.tiles[0][0].texture.height*this.camera.zoom
        }

        // this.hives.forEach(hive => {
        //     console.log("Hive: " + hive.hive)
        //     hive.ants.forEach(ant =>{
        //         x = (0 - this.camera.x) + ant.x*(this.map.tiles[0][0].texture.width*this.camera.zoom)// camera X
        //         y = (0 - this.camera.y) + ant.y*(this.map.tiles[0][0].texture.height*this.camera.zoom)// camera Y
        //         ctx.drawImage(ant.texture, x, y, (ant.texture.width*this.camera.zoom), (ant.texture.height*this.camera.zoom))
        //     })
        // })


    }    

    keydown(event)
    {
        if (event.isComposing || event.keyCode === 229) 
        {
            return
        }
        
        /* Following events are:
            37 - ArrowLeft   - Camera left
            38 - ArrowUp     - Camera up
            39 - ArrowRight  - Camera right
            40 - ArrowDown   - Camera down
        */

            console.log(event.keyCode)
        
        switch(event.keyCode)
        {
            // SpaceBar - pause
            case 32:
                if(this.pause) this.pause = false
                else this.pause = true
                break
            // ArrowLeft - Camera left
            case 37:
                this.camera.x -= 10*this.camera.zoom
                break

            // ArrowUp - Camera up
            case 38:
                this.camera.y -= 10*this.camera.zoom
                break

            // ArrowRight - Camera right
            case 39:
                this.camera.x += 10*this.camera.zoom
                break
            
            // ArrowDown - Camera down
            case 40: 
                this.camera.y += 10*this.camera.zoom
                break
            
            // NumMin - zoom out
            case 109:
                if (this.camera.zoom > 0.25) this.camera.zoom -= 0.05
                break

            // NumPlus - zoom in
            case 107:
                if (this.camera.zoom < 2.0) this.camera.zoom += 0.05
                break

            // default - return
            default:
                return
        }
        this.render()
    }
}

const foo = new Simulation()
// add a drag'n'drop camera move function
// document.addEventListener("")
foo.run()


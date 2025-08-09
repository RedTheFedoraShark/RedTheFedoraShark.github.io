// #######################
// #        CONST        #
// #######################


class File {
    constructor (path, name, type) {
        this.path = path
        this.name = name
        this.type = type
    }
}

const ribbon = document.querySelector('#ribbon')
const fs = document.querySelector('#fs')
const left = document.querySelector('#left')
const right = document.querySelector('#right')
const input = document.querySelector('#input')
const alphabet = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890:;[](){}!@#$%^&*\'",./<>\\~'
const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

// #######################
// #       GLOBALS       #
// #######################


let selected = 0
let highlight = false
let indexes = []
let cpath = ''
let cwd = []
let mode = 'cmd'
let clearout = false
let history = []
let newline = false
let responded = false
let guif = false 
let files = []
// #######################
// #      FUNCTIONS      #
// #######################


async function init()
{

    history.push('! establishing encrypted connection...')
    newline = true
    await display()

    await setTimeout(async () => {
        history.push('! mounting remote file stystem...')
        newline = true
        await display()
        await mount()
        index()
    }, 1000)
    
    await setTimeout(async () => {
        history.push('! indexing...')
        newline = true
        await display()
    }, 2000)

    await setTimeout(async () => {
        history.push('! engaging face recognition module...')
        newline = true
        await display()
    }, 2700)

    await setTimeout(async () => {
        history.push('! facial features... match')
        newline = true
        await display()
    }, 3200)
    
    await setTimeout(async () => {
        history.push('! logging in as lancer@pda...')
        newline = true
        await display()
    }, 3400)

    await setTimeout(async () => {
        history.push(`LanceOS 0.8.911 EXPERIMENTAL`)
        history.push(getTime())
        newline = true
        responded = true
        await display()
        history.push('Welcome, Lancer')
        history.push(`Please type 'help' to access the in-built manual.`)
        newline = true
        responded = true
        input.style.fontSize = '10pt'
        cpath = '/'
        await display()

    }, 3600)
    
}


function getTime()
{
    let today = new Date()
    today.setFullYear(5016)
    let Y = `${today.getFullYear()}u`
    let M = `${month[today.getMonth()]}`
    let D = (today.getDate() < 10) ? `0${today.getDate()}` : `${today.getDate()}`
    let h = (today.getHours() < 10) ? `0${today.getHours()}` : `${today.getHours()}`
    let m = (today.getMinutes() < 10) ? `0${today.getMinutes()}` : `${today.getMinutes()}`
    let s = (today.getSeconds() < 10) ? `0${today.getSeconds()}` : `${today.getSeconds()}`

    return `${Y}, ${D} ${M} t-${h}:${m}:${s}`
}


function compareFiles(a, b)
{
    if (a.type == 'previous')
        return -1
    if (b.type == 'previous')
        return 1
    if (a.type == 'directory' && b.type == 'file')
        return -1
    if (a.type == 'file' && b.type == 'directory')
        return 1
    return 0;
}


function index()
{
    indexes = []
    for(let i = 0; i < files.length; i++)
    {
        let n = `${files[i].path}${files[i].name}`
        if (!indexes.includes(n))
            indexes.push({path: n, index: i})
    }   
    console.log(indexes)
}

function find(path) 
// return -1 if not found
{
    let index = -1
    for(let i = 0; i < indexes.length; i++)
    {
        if (indexes[i].path == path)
        {
            index = indexes[i].index
            break
        }
    }
    return index
}


async function mount() 
{
    let data = await getData()
    files = data['filesystem']
}


async function getData()
{
    const url = './res/files.json'
    try 
    {
        let response = await fetch(url)
        if (!response.ok)
            throw new Error(`Response status: ${response.status}`)
        // console.log(response)
        const result = await response.json()
        // console.log(result)
        return result
    } 
    catch (error) {
        console.error(error.message)
    }
}


async function display()
{
    
    // set path ribbon and set inits
    let response = null
    ribbon.innerHTML = cpath
    
    // reset highlight flag
    highlight = true
    
    // console.log('LEFT DISPLAY')

    // build left space and update globals
    response = await open(cpath)
    if (response != null)
    {
        cwd = response[2]   
        await buildDisplay(left, cwd, cpath, response[0])
    }

    // console.log('RIGHT DISPLAY')
    // console.log(cwd)
    // console.log(`SELECTED: ${selected}`)

    // build right panel
    switch (mode)
    {
        case 'fs': // display what left selected
            response = await open(`${cwd[selected].path}${cwd[selected].name}`)
            await buildDisplay(right, response[2], response[1], response[0])
            break
        case 'cmd':
            response = await buildDisplay(right, null, null, 'c')
            break
    }
    // console.log("---END---")
}


async function buildDisplay(space, data, path, mode)
{

    if (mode == 'c')
    {
        if (clearout)
        {
            space.innerHTML = ''
            for (let i = 0; i < history.length; i++)
            {
                const s = document.createElement('span')
                const t = document.createTextNode(history[i])
                s.appendChild(t)
                space.appendChild(s, input)
            }
            clearout = false
        } 
        if (!space.contains(input)) 
            space.appendChild(input)
        if (responded)
        {
            const s = document.createElement('span')
            const t = document.createTextNode(history.at(-2))
            s.appendChild(t)
            space.insertBefore(s, input)
            responded = false
        }
        if (newline)
        {
            const s = document.createElement('span')
            const t = document.createTextNode(history.at(-1))
            s.appendChild(t)
            space.insertBefore(s, input)
            newline = false
        }
        return
    }

    // set initial data
    space.innerHTML = ''

    if (mode == 'f')
    {
        space.innerHTML = `<span id='file'>${data}</span>`

        return
    }

    // if (mode == 'd')
    let wd = data
    // build display left (current working directory)
    for(let i = 0; i < wd.length; i++)
    {
        if (i == selected && highlight)
        {
            space.innerHTML+=`<span class='${wd[i].type} selected'>${wd[i].name}</span> <br>`
            highlight = false
        }
        else 
            space.innerHTML+=`<span class='${wd[i].type}'>${wd[i].name}</span> <br>`
    }  
}


async function open(path)
{
    // console.log('OPEN')
    // console.log(`PATH: ${path}`)

    // search index for the file
    let i = find(path)
    if (i == -1)
        return null
    // console.log(`INDEX: ${i}`)
    let file = files[i]

    switch(file.type)
    {
        case 'directory':
            // console.log('DIRECTORY')
            // if path not '/'' add goback
            let wd = (path != '/') ? [files[0]] : []

            // build current working directory list
            for(let i = 0; i < files.length; i++)
            {
                if (files[i].path == path)
                    wd.push(files[i])
            }
            
            // sort current working directory
            wd.sort(compareFiles)

            // directory, path, working directory
            return ['d', path, wd]

        case 'file':
            let data = await getData()
            // console.log(data)
            // file, path, data
            return ['f', path, data['files'][path]]

        case 'previous':
            let p = path.split('/')
            if (p[p.length-1] == '') p.pop(-1)
            p.pop(-1)
            path = `${p.join('/')}/`
            return await open(path)

        default:
            break;
    }
}


async function exit()
{
    if (cpath == '/') return;
    let p = cpath.split('/')
    if (p[p.length-1] == '') p.pop(-1)
    p.pop(-1)
    cpath = `${p.join('/')}/`
}


async function execute(command)
{
    if (!command) 
        return

    command = command.split(' ')    
    switch(command[0])
    {
        case 'time':
            history.push(getTime())
            responded = true
            break;
        
        case 'gui':
            gui()
            break;

        case 'help':
            if (command.length == 1)
                command.push('/help')
            else command[1] = '/help'

        case 'open':
            try {
                if (command[1][0] != '/')
                    command[1] = cpath + command[1]
                let response = await open(command[1])
                // console.log(response)
                if (response == null)
                {
                    history.push(` Can't find path '${command[1]}'`)
                    responded = true
                    break;
                }
                if (response[0] == 'd')
                    cpath = response[1]
                else 
                {
                    let p = response[1].split('/')
                    let f = p.at(-1)
                    p.pop(-1)
                    cpath = p.join('/') + '/'
                    let r = await open(cpath)
                    for (let i = 0; i < r[2].length; i++)
                    {
                        if (f == r[2][i].name) 
                        {
                            selected = i
                            break;
                        }
                    }
                }
                mode = 'fs'       
            }
            catch (e) { console.log(e); history.push(` FAILED TO OPEN THE FILE.`); responded = true}
            break;

        default:
            history.push(` Command '${command[0]}' not found.`)
            responded = true
            break;
    }
}


function gui()
{
    return
}


function typing(sigil)
{
    input.innerHTML += sigil
}

// #######################
// #        INIT         #
// #######################

await init()

// #######################
// #       EVENTS        #
// #######################

onkeydown = async (event) => {
    switch(event.key)
    {
        case 'ArrowDown':
            selected += (selected == cwd.length-1) ? 0 : 1;
            break;

        case 'ArrowUp':
            selected -= (selected == 0) ? 0 : 1;
            break;

        case 'Enter':
            if (mode == 'cmd')
            {
                history.push(input.innerHTML.replace('lancer@PDA $ ', '> '))
                await execute(input.innerHTML.replace('lancer@PDA $ ', ''))
                input.innerHTML = 'lancer@PDA $ '
                newline = true
                break;
            }
            let path = `${cwd[selected].path}${cwd[selected].name}`
            let i = find(path)
            if (i == -1)
                break;
            if (files[i].type == 'previous')
                await exit()
            if (files[i].type != 'directory')
                break;
            cpath = path
            selected = 0
            break;

        case 'Backspace':
            if (mode == 'fs') 
                await exit()
            if (mode == 'cmd' && input.innerHTML.length > 13) 
                input.innerHTML = input.innerHTML.slice(0, -1)
            break;

        case 'Escape':
            if (mode == 'cmd')
                mode = 'fs'
            break;
        
        case ':':
            if (mode == 'fs')
            {
                mode = 'cmd'
                clearout = true
                break;
            }

        default:
            if (mode == 'cmd' && alphabet.includes(event.key)) typing(event.key)
            // console.log(event.key)
            break;
    }
    await display()
}, false
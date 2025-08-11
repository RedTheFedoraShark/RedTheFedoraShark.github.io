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
let historyLength = 0
let guif = false 
let files = []
// #######################
// #      FUNCTIONS      #
// #######################


async function init()
{
    history.push('! establishing encrypted connection...')
    await display()

    await setTimeout(async () => {
        history.push('! mounting remote file stystem...')
        await display()
        await mount()
        index()
    }, 1000)
    
    await setTimeout(async () => {
        history.push('! indexing...')
        await display()
    }, 2000)

    await setTimeout(async () => {
        history.push('! engaging face recognition module...')
        await display()
    }, 2700)

    await setTimeout(async () => {
        history.push('! facial features... match')
        await display()
    }, 3200)
    
    await setTimeout(async () => {
        history.push('! logging in as lancer@pda...')
        await display()
    }, 3400)

    await setTimeout(async () => {
        history.push(`LanceOS 0.2.5 EXPERIMENTAL`)
        history.push(getTime())
        history.push('Welcome, Lancer')
        history.push(`Please type 'help' to access the in-built manual.`)
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
    
    let an = a.name.toLowerCase()
    let bn = b.name.toLowerCase()

    if (an < bn)
        return -1
    if (bn < an)
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
        for (; historyLength < history.length; historyLength++)
        {
            const s = document.createElement('span')
            const t = document.createTextNode(history[historyLength])
            s.appendChild(t)
            space.appendChild(s, input)
            space.insertBefore(s, input)
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
            space.innerHTML+=`<span class='fs ${wd[i].type} selected'>${wd[i].name}</span> <br>`
            highlight = false
        }
        else 
            space.innerHTML+=`<span class='fs ${wd[i].type}'>${wd[i].name}</span> <br>`
    }
    let elements = document.querySelectorAll('.fs')
    for (let i = 0; i < elements.length; i++)
    {
        elements[i].onclick = async () => { await touchscreen(wd[i], i) }, false
    }
}


async function open(path, depth=0)
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
            return await open(path, 1)

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
    let response = null
    command = command.split(' ')    
    switch(command[0])
    {
        case 'time':
            history.push(getTime())
            break;

        case 'help':
            if (command.length == 1)
                command.push('/help')
            else command[1] = '/help'

        case 'read':
            if (command.length < 2)
                command.push(cwd[selected].name)

            if (command[1][0] != '/')
                command[1] = cpath + command[1]
            response = await open(command[1])
            if (response == null)
            {
                history.push(` Can't find path '${command[1]}'`)
                break;
            }
            if (response[0] == 'd')
            {
                history.push(command[1])
                for (let i = 0; i < response[2].length-1; i++)
                {
                    history.push(`  ├─ ${response[2][i].name}`)
                }
                history.push(`  └─ ${response[2].at(-1).name}`)
                break;
            }
            history.push(response[2])
            break;

        case 'open':
            if (command.length < 2)
                command.push('')
            if (command[1][0] != '/')
                command[1] = cpath + command[1]
            response = await open(command[1])
            // console.log(response)
            if (response == null)
            {
                history.push(` Can't find path '${command[1]}'`)
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
            break;

        default:
            history.push(` Command '${command[0]}' not found.`)
            break;
    }
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

onkeydown = async (event) => { key(event) }, false


ribbon.onclick = async () => {mode = 'fs'; await display()}, false


async function key(event, touch=false) 
{
    switch(event.key)
    {
        case 'ArrowDown':
            selected += (selected == cwd.length-1) ? 0 : 1;
            break;

        case 'ArrowUp':
            selected -= (selected == 0) ? 0 : 1;
            break;

        case 'ArrowRight':
            if (mode != 'fs')
                break;
        case 'Enter':
            if (mode == 'cmd' && !touch)
            {
                history.push(input.innerHTML.replace(`<span style="color:aqua;">lancer</span>@<span style="color:orange;">PDA~$ </span>`, '> '))
                await execute(input.innerHTML.replace(`<span style="color:aqua;">lancer</span>@<span style="color:orange;">PDA~$ </span>`, ''))
                input.innerHTML = `<span style='color:aqua;'>lancer</span>@<span style='color:orange;'>PDA~$ </span>`
                break;
            }
            if (touch && mode != 'fs')
                mode = 'fs'
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

        case 'ArrowLeft':
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
}


async function touchscreen(file, index) 
{
    if (selected != index)
    {
        selected = index
        await display()
        return
    }
    await key({key: 'Enter'}, true)
}
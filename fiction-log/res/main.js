document.querySelector('#clear-localstorage').addEventListener('click', () => {
    localStorage.clear()
})

const print = console.log

function select(event)
{
    // print(`Current Selected: ${selected}`)
    entry.jq.load(event.target.path, (response, status, xhr) => {
        if (status == 'error') entry.jq.load(_404)
    })
    sidepanel.entries[selected].id = 'deselected'
    event.target.id = 'selected'
    selected = event.target.index
    // print(`New Selected ${selected}`)
    localStorage.setItem('selected', selected)
}

/* What is this fucking magic? */
function styleUpdate()
{
    scrollContainer.style.height = `${window.innerHeight}px`
    sidepanel.style.height = `${window.innerHeight - 30}px`
    let t = (window.innerHeight-800-(7*10))/2
    entry.style.marginTop = `${(t > 0) ? t :10}px`
    let w = (window.innerWidth - sidepanel.getBoundingClientRect().right)/2 -1250/2 -10*9/2 
    entry.style.marginLeft = `${(w > 0) ? w : 10}px`
    entry.style.marginRight = `${(w > 0) ? w : 10}px`
}

function cycleCss(init = false) {
    colorSets[currentCss].link.rel = 'stylesheet alternate'
    if (typeof(init) != 'boolean') currentCss += 1
    if (currentCss >= colorSets.length)
        currentCss = 0
    colorSets[currentCss].link.rel = 'stylesheet'
    colorSwitch.innerHTML = `color<br>${colorSets[currentCss].name}`
    
    localStorage.setItem('currentCss', currentCss)
}

function addPopdown(event)
{
    event.target.className += ' log-entry-popdown' 
    event.target.removeEventListener('mouseenter', addPopdown)
}

async function initSidepanel(path)
{
    let response = await fetch(path)
    let data = await response.json()
    entries = data.entries
    sidepanel.entries = new Array()
    sidepanel.content.innerHTML = ''
    for (let e in entries)
    {
        sidepanel.entries.push(document.createElement('div')) 
        let bookmark = sidepanel.entries[sidepanel.entries.length - 1]
        bookmark.className = 'log-entry'
        bookmark.path = entries[e].path
        bookmark.index = e
        bookmark.innerHTML = entries[e].title
        bookmark.addEventListener('click', select)
        bookmark.addEventListener('mouseenter', addPopdown)
        sidepanel.content.appendChild(bookmark)
    }
}

async function changeLogbook(event)
{
    document.querySelector('#title').innerHTML = event.target.innerHTML
    await initSidepanel(event.target.getAttribute('path'))
    select({target: sidepanel.entries[selected]})
    localStorage.setItem('lastLogbook', event.target.selfIndex)
}

/* setup constants */

let entries = null
const scrollContainer = document.querySelector("#scrollcontainer")
const entry = document.querySelector("#entry")
      entry.jq = $("#entry")
// const popup = document.querySelector("#popup")
const sidepanel = document.querySelector("#sidepanel")
      sidepanel.content = document.querySelector("#content")
// const about = document.querySelector("#about")
const _404 = './res/entries/404.html'

const colorSwitch = document.querySelector('#change-color')
let selected = (localStorage.getItem('selected') == undefined) ? 0 : parseInt(localStorage.getItem('selected')) 
let currentCss = 0
const colorSets = [
    {name: 'Graphite & Blue', link: ''},
    {name: 'Black & Green<br>flashbang warning', link: ''},
    {name: 'White & Red', link: ''}
]

let logbooks = document.querySelectorAll('.log-selector')

/* setup colorSets */
{
    let links = document.querySelectorAll('.altcss')
    currentCss = (localStorage.getItem('currentCss') == undefined) ? 0 : parseInt(localStorage.getItem('currentCss'))
    
    for (let l in links)
    {
        try { colorSets[l].link = links[l] }
        catch (e) { break }
    }
    cycleCss(true)
    colorSwitch.addEventListener('click', cycleCss)
}

/* setup logbrowser */

    for (let l in logbooks)
    {
        try { 
            logbooks[l].addEventListener('click', changeLogbook) 
            logbooks[l].selfIndex = l
        }
        catch (e) { break }
    }
    let lastLogbook = (localStorage.getItem('lastLogbook') == undefined) ? 0 : localStorage.getItem('lastLogbook')
    await changeLogbook({target: logbooks[lastLogbook]})

styleUpdate()


/* global event listeners */
onresize = (event) => { styleUpdate() }
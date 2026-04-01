const print = console.log

function updatePanel(event)
{   

}

function select(event)
{
    entry.jq.load(event.target.path, (response, status, xhr) => {
        if (status == 'error') entry.jq.load(_404)
    })
    selected.id = 'deselected'
    event.target.id = 'selected'
    selected = event.target
    updatePanel(event)
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
    print(1)
    event.target.removeEventListener('mouseenter', addPopdown)
}

/* setup constants */

let response = await fetch('./res/entrylist.json')
const data = await response.json()
const scrollContainer = document.querySelector("#scrollcontainer")
const entry = document.querySelector("#entry")
      entry.jq = $("#entry")
// const popup = document.querySelector("#popup")
const sidepanel = document.querySelector("#sidepanel")
      sidepanel.content = document.querySelector("#content")
// const about = document.querySelector("#about")
const entries = data.entries
const _404 = './res/entries/404.html'
const colorSwitch = document.querySelector('#change-color')
let selected = {id: 1}
let currentCss = 0
const colorSets = [
    {name: 'Black & Blue', link: ''},
    {name: 'White & Red', link: ''},
    {name: 'Green & Purple', link: ''}
]

/* setup colorSets */
{
    let links = document.querySelectorAll('.altcss')
    currentCss = parseInt(localStorage.getItem('currentCss')) ?? 0
    
    print(links)
    for (let l in links)
    {
        try { colorSets[l].link = links[l] }
        catch (e) { break }
    }
    cycleCss(true)
    colorSwitch.addEventListener('click', cycleCss)
}

/* setup sidepanel contents */
sidepanel.entries = new Array()
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

select({target: sidepanel.entries[0]})
styleUpdate()

/* global event listeners */
onresize = (event) => { styleUpdate() }
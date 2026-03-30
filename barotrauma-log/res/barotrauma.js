function updatePanel(event)
{   

}

function select(event)
{
    entry.jq.load(event.target.path, (response, status, xhr) => {
        if (status == 'error') entry.jq.load(_404)
    })
    updatePanel(event)
}

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

/* setup constants */

let response = await fetch('./res/entrylist.json')
const data = await response.json()
const scrollContainer = document.querySelector("#scrollcontainer")
const entry = document.querySelector("#entry")
      entry.jq = $("#entry")
// const popup = document.querySelector("#popup")
const sidepanel = document.querySelector("#sidepanel")
      sidepanel.content = document.querySelector("#content")
const about = document.querySelector("#about")
const entries = data.entries
const _404 = './res/entries/404.html'
var selected = null

/* setup sidepanel contents */
sidepanel.entries = new Array()
for (let e in entries)
{
    sidepanel.entries.push(document.createElement('div')) 
    let bookmark = sidepanel.entries[sidepanel.entries.length - 1]
    bookmark.className = 'log-entry'
    bookmark.path = entries[e].path
    bookmark.index = e
    bookmark.innerHTML += `${e} `
    bookmark.innerHTML += entries[e].title
    bookmark.addEventListener('click', select)

    sidepanel.content.appendChild(bookmark)
}

/* Init */

styleUpdate()

/* global event listeners */
onresize = (event) => { styleUpdate() }
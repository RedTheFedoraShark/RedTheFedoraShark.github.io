
function romanise (num) {
/* function borrowed from: https://blog.stevenleviathan.com/archives/javascript-roman-numeral-converter */
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function weekPopup(event)
{
    const week = event.currentTarget.week
    if (!isWithinPopup(event))
    {
        popup.style.zIndex = `2`
        popup.style.opacity = `1`
    }
}
    
function weekPopdown(event)
{
    const week = event.currentTarget.week
    if (!isWithinPopup(event))
    {
        popup.style.zIndex = `-1`
        popup.style.opacity = `0%`
    }
}

function updatePopup(event)
{
    popup.style.top = `${event.clientY}px`
    popup.style.left = `${event.clientX}px`
}

function updatePanel(event)
{   
    const week = parseInt(event.currentTarget.no.textContent)
    sidepanel.entry.title.innerHTML = data.weeks[week-1].title
    sidepanel.entry.content.innerHTML = data.weeks[week-1].content
    sidepanel.entry.image.src = `./res/img/${data.weeks[week-1].image}`
}

function select(event)
{
    const week = (event.currentTarget.week)
    updatePanel(event)
    if (selected != null)
        weeks[selected].className = 'week'
    weeks[week].className = 'selected'
    
    selected = week
}

function deselect(event){
    if(event.button == 2) { 
        if (selected != null)
        {
            weeks[selected].className = 'week' 
            sidepanel.entry.title.innerHTML = sidepanel.entry.defaultTitle
            sidepanel.entry.content.innerHTML = sidepanel.entry.defaultContent
            sidepanel.entry.image.src = sidepanel.entry.defaultImage
        } 
        selected = null
        return false 
    } 
}

function styleUpdate()
{
    scrollContainer.style.height = `${window.innerHeight}px`
    sidepanel.style.height = `${window.innerHeight - 30}px`
    let t = (window.innerHeight-800-(7*10))/2
    calendar.style.marginTop = `${(t > 0) ? t :10}px`
    let w = (window.innerWidth - sidepanel.getBoundingClientRect().right)/2 -1250/2 -10*9/2 
    calendar.style.marginLeft = `${(w > 0) ? w : 10}px`
    calendar.style.marginRight = `${(w > 0) ? w : 10}px`
}

/* setup constants */
const seasons = {
    winter: '#63636e8f',
    spring: '#646f624f',
    autumn: '#915d033f'
}

const months = [ 'Mendar', 'Kalivet', 'Suran', 'Ulsivet', 'Volvinet', 'Elisnar' ]
let response = await fetch("./res/years/1.json")
const data = await response.json()
const scrollContainer = document.querySelector("#scrollcontainer")
const calendar = document.querySelector("#calendar")
const popup = document.querySelector("#popup")
const sidepanel = document.querySelector("#sidepanel")
const about = document.querySelector("#about")
const weeks = new Array()

var selected = null

/* setup sidepanel contents */
sidepanel.entry = {}
sidepanel.entry.title = document.querySelector("#title")
sidepanel.entry.content = document.querySelector("#content")
sidepanel.entry.image = document.querySelector("#image")
sidepanel.entry.defaultTitle = sidepanel.entry.title.innerHTML
sidepanel.entry.defaultContent = sidepanel.entry.content.innerHTML
sidepanel.entry.defaultImage = "./res/img/default.png"

/* create weeks */
for (let i = 0; i < 77; i++ )
{
    weeks.push(document.createElement('div'))
    // weeks[i].addEventListener('mouseover', weekPopup)
    // weeks[i].addEventListener('mouseout', weekPopdown)
    weeks[i].week = i
    calendar.appendChild(weeks[i])
}

/* top left corner box */
weeks[0].style.opacity = 0
weeks[0].removeEventListener('click', select)
weeks[0].style.margin = '10px 10px -10px 10px'

/* X axis - week numbers */
for (let i = 1; i < 11; i++)
{
    weeks[i].desc = document.createElement('div')
    weeks[i].className = 'weekname'
    weeks[i].appendChild(weeks[i].desc)
    weeks[i].style.textAlign = 'center'
    weeks[i].desc.textContent = romanise(i)
    weeks[i].desc.style.marginTop = `35px`

}

/* Y axis - month names */
for (let i = 11; i < 77; i+=11)
{
    weeks[i].className = 'weekname'
    weeks[i].desc = document.createElement('div')
    weeks[i].appendChild(weeks[i].desc)
    weeks[i].style.textAlign = 'left'
    weeks[i].desc.textContent = months[i/11 - 1]
    weeks[i].desc.style.marginTop = '35px'
}

/* week boxes */
let it = 0
for (let i = 12; i < 77; i++)
{
    if (i%11 == 0) continue
    weeks[i].addEventListener('click', select)
    weeks[i].className = 'week'
    weeks[i].defaultBg = 'black'
    let season = data.weeks[it].season
    switch(season)
    {
        case 'winter':
            weeks[i].defaultBg = seasons[season] 
            weeks[i].style.backgroundColor = seasons[season]
            break
        case 'spring':
            weeks[i].defaultBg = seasons[season] 
            weeks[i].style.backgroundColor = seasons[season]
            break
        case 'autumn':
            weeks[i].defaultBg = seasons[season] 
            weeks[i].style.backgroundColor = seasons[season]
            break
        default:
            weeks[i].defaultBg = 'black'
            weeks[i].style.backgroundColor = 'black'
            break
    }
    
    weeks[i].desc = document.createElement('div')
    weeks[i].no = document.createElement('div')
    weeks[i].etitle = document.createElement('div')
    weeks[i].appendChild(weeks[i].no)
    weeks[i].appendChild(weeks[i].desc)
    weeks[i].appendChild(weeks[i].etitle)
    
    weeks[i].no.textContent = `${data.weeks[it].week}`
    weeks[i].no.style.margin = '13px 10px 1px 13px'
    weeks[i].no.style.fontSize = '18px'
    weeks[i].no.style.opacity = '1'
    
    weeks[i].desc.textContent = `${data.weeks[it].desc}`
    weeks[i].desc.style.textAlign = 'right'
    weeks[i].desc.style.margin = '5px'
    weeks[i].desc.style.fontSize = '15px'
    weeks[i].desc.style.opacity = '0.81'

    weeks[i].etitle.textContent = `${data.weeks[it].title}`
    weeks[i].etitle.style.textAlign = 'right'
    weeks[i].etitle.style.fontSize = '12px'
    weeks[i].etitle.style.opacity = '0.81'
    weeks[i].etitle.style.margin = '2px 5px 5px 4px'
    it++
}

// document.addEventListener('mousemvoe', updatePopup)
styleUpdate()
/* global event listeners */
onresize = (event) => {styleUpdate()}
oncontextmenu = (event) => {if (!deselect(event)) return false}
about.addEventListener('click', ()=>{ deselect({button: 2})})
sidepanel.entry.image.addEventListener('error', (event)=>{
    event.currentTarget.src=""
})
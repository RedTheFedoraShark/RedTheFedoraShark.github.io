const calendar = document.querySelector("#calendar")
const weeks = new Array()
for (let i = 0; i < 40; i++ )
{
    weeks.push(document.createElement('div'))
    weeks[i].className = 'week'
    weeks[i].textContext = "a"
    calendar.appendChild(weeks[i])
}
console.log(weeks)
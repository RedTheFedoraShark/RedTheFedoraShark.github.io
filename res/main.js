// declare constants

const selected = document.querySelectorAll('.selector');
const content = document.querySelector('content')

for (let i = 0; i < selected.length; i++)
{
    selected[i].addEventListener('click', (event)=>{
        for (let j = 0; j < selected.length; j++)
            { selected[j].id = ''; }
        event.target.id = 'selected'
    })
}


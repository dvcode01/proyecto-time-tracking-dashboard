const frequencyBtn = document.querySelectorAll('.section-1__frequency');
const secondSection = document.querySelector('.section-2');
const container = document.querySelector('.main');
let cardElements;

let timeframe = 'daily'; 
let data = {};
let regularCards;


eventListeners();
function eventListeners(){

    frequencyBtn.forEach(btn => {
        btn.addEventListener('click', menuOnClick);
    })
}

function menuOnClick(e){
    frequencyBtn.forEach(btn => {
        btn.classList.remove('section-1__frequency--active');
    })
    
    e.target.classList.add('section-1__frequency--active');
    timeframe = e.target.innerText.toLowerCase();

    console.log(timeframe);

    updateCards(timeframe);
}

async function getInformation(){

    const fetchResult = await fetch('../data/data.json');
    const result = await fetchResult.json();
    const res = await result;

    // creando las cards
    res.forEach(elem => {
        secondSection.insertAdjacentHTML('beforeend', createCard(elem, timeframe));       
    })
    
    // convertir el array
    res.forEach(elem => {
        data[elem.title] = elem.timeframes;
        console.log(data);
    })
    
    // hace referencia a los elementos ya creados
    cardElements = document.querySelectorAll('.section-2__card'); 
}

getInformation();


function createCard(element, timeframe){
    const title = element['title'].toLowerCase();
    const current = element['timeframes'][timeframe]['current'];
    const previous = element['timeframes'][timeframe]['previous'];

    const timeframesMsg = {
        'daily': 'Yesterday',
        'weekly': 'Last Week',
        'monthly': 'Last Month'
    };

    return `
    <article class="section-2__card">
        <header class="section-2__header">
            <img src="assets/svg/icon-${title == 'self care' ? title.replace(' ', '-') : title.replace('-', ' ')}.svg" alt="icon" class="section-2__icon">
        </header>

        <div class="section-2__details">
            <section class="section-2__activity">
                <p class="section-2__title">${title}</p>
                <img src="assets/svg/icon-ellipsis.svg" alt="three dots">
            </section>
            <section class="section-2__description">
                <h2 class="section-2__hours">${current}hrs</h2>
                <p class="section-2__weeks">${timeframesMsg[timeframe]} - ${previous}hrs</p>
            </section>
        </div>
    </article>
    
    `;
};

function updateCards(timeFrame){
    cardElements.forEach(card =>{
        updateCard(card, timeFrame);
    })
}


function updateCard(card, timeFrame){
    const timeframesMsg = {
        'daily': 'Yesterday',
        'weekly': 'Last Week',
        'monthly': 'Last Month'
    };


    const title = card.querySelector('.section-2__title').innerText;
    const current = data[title][timeframe]['current'];
    const previous = data[title][timeframe]['previous'];

    const hoursElement = card.querySelector('.section-2__hours');
    hoursElement.innerText = `${current}hrs`;

    const weekElement = card.querySelector('.section-2__weeks');
    weekElement.innerText = `${timeframesMsg[timeFrame]} - ${previous}hrs`;
}
import conditions from "../condition.js";
console.log(conditions);
const apiKey = 'cfc45d1ec5ee408485c165547231903';

//Элементы на странице
const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeCard() {
    const prevcard = document.querySelector('.card');
    if (prevcard) prevcard.remove();
}

function showError (errorMessage)   {
    const html = `<div class="card">${errorMessage}</div>`;
    header.insertAdjacentHTML('afterend', html);
}

function showCard (name, country, temp, condition, imgPath) {
    const html = `  <div class="card">
                        <h2 class="card__city">${name}<span>${country}</span></h2>
                        <div class="card__weather">
                            <div class="card__temp">${temp} <sup>℃</sup></div>
                            <img class="card__img" src="${imgPath}" alt="">
                        </div>
                        <div class="card__desc">${condition}</div>
                    </div>`;

//Отображаем карточку на странице
header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data); 
    return data;   
}



//Слушаем отправку формы
form.onsubmit = async function (e) {
    
    e.preventDefault();    
    let city = input.value.trim();
    //получаем данные с сервера
    const data = await getWeather(city);  

    if (data.error) {
        removeCard();
        showError(data.error.message);
    } 
    else {            
        removeCard();

        const info = conditions.find((obj) => obj.code === data.current.condition.code)
        console.log(info);
        console.log(info.languages[23]['day_text']);

        const filePath = '../images/' + (data.current.is_day ? 'day' : 'night') + '/';
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName;        

        const condition = data.current.is_day 
        ? info.languages[23]['day_text']
        : info.languages[23]['night_text'];
        showCard(
            data.location.name,
            data.location.country,
            data.current.temp_c,
            condition,
            imgPath,
        );
    } 
}

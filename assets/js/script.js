var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var cityNameEl = document.querySelector("#city-name");
var presentEl = document.querySelector("#present");
var futureEl = document.querySelector("#future");

const formSubmitHandler = (e) => {
    e.preventDefault();

    var cityname = cityInputEl.value.trim();

    if (cityname) {
        getCityConditions(cityname);
    }
    else {

    }
}

const getCityConditions = (city) => {
    var apiKey = "708f99243b2b2df3796c8b8b567310b5";
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    console.log(apiUrl)
    fetch(apiUrl)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    cityNameEl.textContent = data.name;
                    displayWeather(apiKey, data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch((error) => {
            alert('Unable to connect to OpenWeather');
        });
}

const displayWeather = (apiKey, city) => {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&units=imperial&appid=${apiKey}`;

    console.log(apiUrl)
    fetch(apiUrl)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    displayCurrent(data);
                    displayForecast(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch((error) => {
            alert('Unable to connect to OpenWeather');
        });
}

const displayCurrent = (city) => {
    console.log(city);

    let tempEl = document.createElement("p");
    tempEl.textContent = `Temp: ${city.current.temp} °F`;

    let windEl = document.createElement("p");
    windEl.textContent = `Wind: ${city.current.wind_speed} MPH`;

    let humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${city.current.humidity} %`;

    let uvindexEl = document.createElement("p");
    uvindexEl.textContent = `UV Index: ${city.current.uvi}`;

    presentEl.append(tempEl, windEl, humidityEl, uvindexEl);
}

const displayForecast = (city) => {
    for (let i = 0; i < 5; i++) {
        let dayEl = document.createElement("div");

        let tempEl = document.createElement("p");
        tempEl.textContent = `Temp: ${city.daily[i].temp.day} °F`;

        let windEl = document.createElement("p");
        windEl.textContent = `Wind: ${city.daily[i].wind_speed} MPH`;
    
        let humidityEl = document.createElement("p");
        humidityEl.textContent = `Humidity: ${city.daily[i].humidity} %`;
    
        dayEl.append(tempEl, windEl, humidityEl);
        futureEl.append(dayEl);
    }
}

cityFormEl.addEventListener("submit", formSubmitHandler);
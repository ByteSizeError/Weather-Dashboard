var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var cityNameEl = document.querySelector("#city-name");
var presentEl = document.querySelector("#present");
var futureEl = document.querySelector("#future");
var historyEl = document.querySelector("#search-history");

const formSubmitHandler = (e) => {
    e.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        // clears the previous search result
        presentEl.innerHTML = "";
        futureEl.innerHTML = "";
        getCityConditions(city);
    }
    else {
        alert("Please enter a City");
    }
}

const buttonClickHandler = (e) => {
    var city = e.target.getAttribute("data-city");

    presentEl.innerHTML = "";
    futureEl.innerHTML = "";
    getCityConditions(city);

}

const addSearch = (city) => {
    var history = JSON.parse(localStorage.getItem("history")) || [];
    history.unshift(city);
    localStorage.setItem("history", JSON.stringify(history));
    displaySearch();
}

const displaySearch = () => {
    // clear old history to bring in the updated one
    historyEl.innerHTML = "";
    var history = JSON.parse(localStorage.getItem("history")) || [];

    for (let i = 0; i < history.length; i++) {
        let search = document.createElement("button");
        search.setAttribute("data-city", history[i]);
        search.textContent = history[i];
        historyEl.append(search);
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
                    addSearch(data.name);
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

    let dateEl = document.createElement("p");
    dateEl.textContent = unixTimeConverter(city.current.dt);

    let iconEl = document.createElement("img");
    iconEl.src = `http://openweathermap.org/img/wn/${city.current.weather[0].icon}.png`;

    let tempEl = document.createElement("p");
    tempEl.textContent = `Temp: ${city.current.temp} °F`;

    let windEl = document.createElement("p");
    windEl.textContent = `Wind: ${city.current.wind_speed} MPH`;

    let humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${city.current.humidity} %`;

    let uvindexEl = document.createElement("p");
    uvindexEl.textContent = `UV Index: ${city.current.uvi}`;

    presentEl.append(dateEl, iconEl, tempEl, windEl, humidityEl, uvindexEl);
}

const displayForecast = (city) => {
    // I can't tell if daily[0] was the next day or daily[1].
    // the timestamp for daily[0] was always today so I decided to start at daily[1]
    for (let i = 1; i < 6; i++) {
        let dayEl = document.createElement("div");
        dayEl.classList.add("forecast");

        let dateEl = document.createElement("p");
        dateEl.textContent = unixTimeConverter(city.daily[i].dt);

        let iconEl = document.createElement("img");
        iconEl.src = `http://openweathermap.org/img/wn/${city.daily[i].weather[0].icon}.png`

        let tempEl = document.createElement("p");
        tempEl.textContent = `Temp: ${city.daily[i].temp.day} °F`;

        let windEl = document.createElement("p");
        windEl.textContent = `Wind: ${city.daily[i].wind_speed} MPH`;

        let humidityEl = document.createElement("p");
        humidityEl.textContent = `Humidity: ${city.daily[i].humidity} %`;

        dayEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
        futureEl.append(dayEl);
    }
}

const unixTimeConverter = (unix) => {
    let date = new Date(unix * 1000);
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

cityFormEl.addEventListener("submit", formSubmitHandler);
historyEl.addEventListener("click", buttonClickHandler);
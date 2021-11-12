var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var cityNameEl = document.querySelector("#city-name");
var presentEl = document.querySelector("#present");
var futureEl = document.querySelector("#future");
var historyEl = document.querySelector("#search-history");

// this function handles the submit button when the user has typed in a city
const formSubmitHandler = (e) => {
    e.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        // clears the previous search result
        presentEl.innerHTML = "";
        futureEl.innerHTML = "";
        getCityConditions(city);
    }
};

// this function checks for button click on the search history log
const buttonClickHandler = (e) => {
    var city = e.target.getAttribute("data-city");

    presentEl.innerHTML = "";
    futureEl.innerHTML = "";
    getCityConditions(city);
};

// this function adds city into the search history
const addSearch = (city) => {
    var history = JSON.parse(localStorage.getItem("history")) || [];
    // if it is in history already dont add it too many duplicates
    if (!history.includes(city)) {
        history.unshift(city);
    }

    localStorage.setItem("history", JSON.stringify(history));
    displaySearch();
};

// this function displays all the search history
const displaySearch = () => {
    // clear old history to bring in the updated one
    historyEl.innerHTML = "";
    var history = JSON.parse(localStorage.getItem("history")) || [];

    for (let i = 0; i < history.length; i++) {
        let search = document.createElement("button");
        search.setAttribute("data-city", history[i]);
        search.textContent = history[i];
        search.classList.add("dropdown-item");

        let liEl = document.createElement("li");
        liEl.append(search);

        historyEl.append(liEl);
    }

    let liDividerEl = document.createElement("li");
    let dividerEl = document.createElement("hr");
    dividerEl.classList.add("dropdown-divider");
    liDividerEl.append(dividerEl);

    let liClearEl = document.createElement("li");
    let clearEl = document.createElement("button");
    clearEl.classList.add("dropdown-item");
    clearEl.textContent = "Clear";
    liClearEl.append(clearEl);

    historyEl.append(liDividerEl, liClearEl);
};

// this function is responsible for fetching the lat and lon from open weather
const getCityConditions = (city) => {
    var apiKey = "708f99243b2b2df3796c8b8b567310b5";
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    console.log(apiUrl);
    fetch(apiUrl)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    cityNameEl.textContent = data.name;
                    addSearch(data.name);
                    displayWeather(apiKey, data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch((error) => {
            alert("Unable to connect to OpenWeather");
        });
};

// this function takes the lat and lon from open weather and used the onecall api to get 7 day forecast
const displayWeather = (apiKey, city) => {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&units=imperial&appid=${apiKey}`;

    console.log(apiUrl);
    fetch(apiUrl)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    displayCurrent(data);
                    displayForecast(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch((error) => {
            alert("Unable to connect to OpenWeather");
        });
};

// used to update the current weather card
const displayCurrent = (city) => {
    // split the card into two sides one for date and icon
    let leftCurr = document.createElement("div");
    // other one for the weather conditions
    let rightCurr = document.createElement("div");
    rightCurr.classList.add("current-text");

    let iconEl = document.createElement("img");
    iconEl.src = `http://openweathermap.org/img/wn/${city.current.weather[0].icon}@4x.png`;

    let dateEl = document.createElement("p");
    dateEl.classList.add("text-center");
    dateEl.textContent = unixTimeConverter(city.current.dt);
    leftCurr.append(dateEl, iconEl);

    let tempEl = document.createElement("p");
    tempEl.textContent = `Temp: ${city.current.temp}°F`;

    let windEl = document.createElement("p");
    windEl.textContent = `Wind: ${city.current.wind_speed} MPH`;

    let humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${city.current.humidity} %`;

    let uvindexEl = document.createElement("p");
    let uvIndex = city.current.uvi;

    uvindexEl.textContent = `UV Index: ${uvIndex}`;

    // checks the UV index to see which rating to give
    if (uvIndex <= 2) {
        uvindexEl.classList.add(...["badge", "rounded-pill", "bg-success"]);
    } else if (uvIndex <= 5) {
        uvindexEl.classList.add(...["badge", "rounded-pill", "bg-warning"]);
    } else if (uvIndex > 5) {
        uvindexEl.classList.add(...["badge", "rounded-pill", "bg-danger"]);
    }

    rightCurr.append(tempEl, windEl, humidityEl, uvindexEl);

    let cardBodyEl = document.createElement("div");
    cardBodyEl.classList.add(
        ...["card-body", "d-flex", "justify-content-evenly"]
    );

    cardBodyEl.append(leftCurr, rightCurr);

    presentEl.append(cardBodyEl);
};

// used to update the 5 day forecast cards
const displayForecast = (city) => {
    // I can't tell if daily[0] was the next day or daily[1].
    // the timestamp for daily[0] was always today so I decided to start at daily[1]
    for (let i = 1; i < 6; i++) {
        let dayEl = document.createElement("div");
        dayEl.classList.add(...["forecast", "card", "bg-light"]);

        let dateEl = document.createElement("p");
        dateEl.classList.add("text-center");

        dateEl.textContent = unixTimeConverter(city.daily[i].dt);

        let iconEl = document.createElement("img");
        iconEl.src = `http://openweathermap.org/img/wn/${city.daily[i].weather[0].icon}@4x.png`;

        let tempEl = document.createElement("p");
        tempEl.textContent = `Temp: ${city.daily[i].temp.day}°F`;

        let windEl = document.createElement("p");
        windEl.textContent = `Wind: ${city.daily[i].wind_speed} MPH`;

        let humidityEl = document.createElement("p");
        humidityEl.textContent = `Humidity: ${city.daily[i].humidity} %`;

        dayEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
        futureEl.append(dayEl);
    }
};

// used to convert the unix time stamp to a readable date
const unixTimeConverter = (unix) => {
    let date = new Date(unix * 1000);
    return (
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
};

// event listener for submit button
cityFormEl.addEventListener("submit", formSubmitHandler);
// event listener for the history buttons
historyEl.addEventListener("click", buttonClickHandler);

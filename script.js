const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");

const weatherSection = document.getElementById("weatherSection");
const weatherFilter = document.getElementById("weatherFilter");
const forecastContainer = document.getElementById("forecastContainer");
const filterMessage = document.getElementById("filterMessage");

let forecastData = null;

// Get the weather description from its code
function getWeatherInfo(code) {
    if (code === 0) {
        return { text: "Clear Sky", icon: "☀️", type: "sunny" };
    }

    if (code === 1 || code === 2) {
        return { text:"Party Cloudy", icon: "🌤️", type: "cloudy" };
    }

    if (code === 3) {
        return { text: "Cloudy", icon: "☁️", type: "cloudy" };
    }

    if (code === 45 || code === 48) {
        return {
            text: "Foggy", icon: "🌫️", type: "cloudy"
        };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return { text: "Drizzle", icon: "🌧️", type: "rainy" };
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return { text: "Rainy", icon: "🌧️", type: "rainy" };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return { text: "Snowy", icon: "❄️", type: "snowy" };
    }

    if ([95, 96, 99].includes(code)) {
        return { text: "Thunderstorm", icon: "⛈️" type: "rainy" };
    }

    return { text: "Unknown", icon: "🌍", type: "other" };
}

// Display messages to the user
function showMessages(text, type) {
    message.textContent = text;
    message.className = type;
}

// Find the coordinates of a city
async function getCity(city) {
    const url = "https://geocoding-api.open-meteo.com/v1/search"
    + "?name=" + encodeURIComponent(city)
    + "&count=1&language=en&format=json";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not search for the city.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please try another name.");
    }

    return data.results[0];
}

// Get weather information using coordinates
async function getWeather(latitude, longitude) {
    const url = "https://api.open-meteo.com/v1/forest"
    + "?latitude=" + latitude
    + "&longitude=" + longitude
    + "&current=temperature_2m, relative_humidity_2m,"
    + "apparent_temperature, weather_code, wind_speed_10m"
    + "&daily=weather_code, temperature_2m_max, temperature_2m_min"
    + "&timezone=auto&forecast_days=7";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not get weather information.");
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
        throw new Error("Weather inforamation is not available.");
    }

    return data;
}

// Display the current weather
function displayWeather(city, data) {
    const current = data.current;
    const weather = getWeatherInfo(current.weather_code);

    let location = city.name;

    if (city.country) {
        location += ", " + city.admin;
    }

    if (city.country) {
        location += ", " + city.country;
    }

    document.getElementById("cityName").textContent = location;

    const date = new Data(current.time);

    document.getElementById("weatherDate").textContent =
    date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timezone: "UTC"
    });

    document.getElementById("temperature").textContent =
    Math.round(current.temperature_2m) + "°C";

    document.getElementById("humidity").textContent =
    current.relative_humidity_2m + "%";

    document.getElementById("windSpeed").textContent = 
    current.wind_speed_10m + "km/h";

    document.getElementById("feelsLike").textContent = 
    Math.round(current.apparent_temperature) + "°C";

    document.getElementById("weatherDescription").textContent = 
    weather.text;

    document.getElementById("weatherIcon").textContent = 
    weather.icon;

    weatherSection.classList.remove("hidden");
}

// Display the seven-day forecast
function displayForecast(filter = "all") {
    forecastContainer.innerHTML = "";
    filterMessage.textContent = "";

    if (!forecastData) {
        return;
    }

    const daily = forecastData.daily;
    let daysFound = 0;

    for (let ! = 0, i < daily.time.length; i++) {
        const weather = getWeatherInfo(daily.weather_code[i]);

        if (filter !== "all" && weather.type !== filter) {
            continue;
        }

        daysFound++;

        const date = new Date(daily.time[i] + "T12:00:00Z");

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            timezone: "UTC"
        });

        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);

        const card = document.createElement("div");
        card.className = "forecast-card";

        const heading = document.createElement("h3");
        heading.textContent = dayName;

        const icon = document.createElement("div");
        icon.className = "forecast-icon";
        icon.textContent = weather.icon;

        const description = document.createElement("p");
        description.textContent = weather.text;

        const temperature = document.createElement("p");
        temperature.className = "forecast-temp";
        temperature.textContent = maxTemp + "°C / " + minTemp + "°C";

        const label = document.createElement("p");
        label.textContent = "High / Low";

        card.appendChild(heading);
        card.appendChild(icon);
        card.appendChild(description);
        card.appendChild(temperature);
        card.appendChild(label);

        forecastContainer.appendChild(card);
    }

    if (daysFound === 0) {
        filterMessage.textContent = 
          "No forecast days match this weather condtion.";
    }
}

// Search for weather when the form is submitted
searchForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const cityName = cityInput.ariaValueMax.trim();

    if (cityName === "") {
       showMessages("Please enter a city name.", "error");
       return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";

    showMessages("Loading weather information...", "loading");
    forecastData = null;

    try {
        const city = await getCity(cityName);

        const data = await getWeather(
            city.latitude,
            city.longotude
        );

        forecastData = data;

        displayWeather(city, data);

        weatherFilter.value = "all";
        displayForecast();

        showMessages("Weather inforamtion loaded successfully!", "success");

    } catch (error) {
        showMessages(error.message, "error");

    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
});

// Filter the forecast when the selection changes 
weatherFilter.addEventListener("change", function() {
    displayForecast(weatherFilter.value);
});

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const weatherSection = document.getElementById("weatherSection");
const weatherFilter = document.getElementById("weatherFilter");
const forecastContainer = document.getElementById("forecastContainer");
const filterMessage = document.getElementById("filterMessage");

let forecastData = null;
const cacheTime = 10 * 60 * 1000;

// Get weather description
function getWeatherInfo(code) {
    if (code === 0) return ["Clear Sky", "☀️", "sunny"];
    if ([1, 2].includes(code)) return ["Partly Cloudy", "🌤️", "cloudy"];
    if (code === 3) return ["Cloudy", "☁️", "cloudy"];
    if ([45, 48].includes(code)) return ["Foggy", "🌫️", "cloudy"];
    if ([51, 53, 55, 56, 57].includes(code)) return ["Drizzle", "🌧️", "rainy"];
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ["Rainy", "🌧️", "rainy"];
    if ([71, 73, 75, 77, 85, 86].includes(code)) return ["Snowy", "❄️", "snowy"];
    if ([95, 96, 99].includes(code)) return ["Thunderstorm", "⛈️", "rainy"];
    return ["Unknown", "🌍", "other"];
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

// Find city coordinates
async function getCity(name) {
    const url = "https://geocoding-api.open-meteo.com/v1/search"
        + "?name=" + encodeURIComponent(name) + "&count=1";

    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not search for the city.");

    const data = await response.json();
    if (!data.results?.length) throw new Error("City not found. Try another name.");

    return data.results[0];
}

// Get weather information
async function getWeather(lat, lon) {
    const url = "https://api.open-meteo.com/v1/forecast"
        + "?latitude=" + lat + "&longitude=" + lon
        + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
        + "&daily=weather_code,temperature_2m_max,temperature_2m_min"
        + "&timezone=auto&forecast_days=7";

    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not get weather information.");

    const data = await response.json();
    if (!data.current || !data.daily) {
        throw new Error("Weather information is unavailable.");
    }

    return data;
}

// Display current weather
function displayWeather(city, data) {
    const current = data.current;
    const weather = getWeatherInfo(current.weather_code);

    let location = city.name;
    if (city.admin1) location += ", " + city.admin1;
    if (city.country) location += ", " + city.country;

    document.getElementById("cityName").textContent = location;
    document.getElementById("weatherDate").textContent =
        new Date(current.time).toLocaleDateString("en-US", {
            dateStyle: "full",
            timeZone: "UTC"
        });

    document.getElementById("temperature").textContent =
        Math.round(current.temperature_2m) + "°C";
    document.getElementById("humidity").textContent =
        current.relative_humidity_2m + "%";
    document.getElementById("windSpeed").textContent =
        current.wind_speed_10m + " km/h";
    document.getElementById("feelsLike").textContent =
        Math.round(current.apparent_temperature) + "°C";
    document.getElementById("weatherDescription").textContent = weather[0];
    document.getElementById("weatherIcon").textContent = weather[1];

    weatherSection.classList.remove("hidden");
}

// Display forecast cards
function displayForecast(filter = "all") {
    forecastContainer.innerHTML = "";
    filterMessage.textContent = "";

    if (!forecastData) return;

    const daily = forecastData.daily;
    let count = 0;

    daily.time.forEach(function(day, i) {
        const weather = getWeatherInfo(daily.weather_code[i]);
        if (filter !== "all" && weather[2] !== filter) return;

        count++;

        const date = new Date(day + "T12:00:00Z")
            .toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                timeZone: "UTC"
            });

        const card = document.createElement("div");
        card.className = "forecast-card";

        const heading = document.createElement("h3");
        heading.textContent = date;

        const icon = document.createElement("div");
        icon.className = "forecast-icon";
        icon.textContent = weather[1];

        const description = document.createElement("p");
        description.textContent = weather[0];

        const temp = document.createElement("p");
        temp.className = "forecast-temp";
        temp.textContent =
            Math.round(daily.temperature_2m_max[i]) + "°C / "
            + Math.round(daily.temperature_2m_min[i]) + "°C";

        const label = document.createElement("p");
        label.textContent = "High / Low";

        card.append(heading, icon, description, temp, label);
        forecastContainer.appendChild(card);
    });

    if (count === 0) {
        filterMessage.textContent = "No days match this weather condition.";
    }
}

// Draw the temperature chart with degree labels
function displayTemperatureChart(data) {
    const daily = data.daily;
    const highs = daily.temperature_2m_max;
    const lows = daily.temperature_2m_min;
    const chart = document.getElementById("temperatureChart");

    const min = Math.floor(Math.min(...highs, ...lows) / 5) * 5 - 5;
    const max = Math.ceil(Math.max(...highs, ...lows) / 5) * 5 + 5;

    const x = i => 65 + i * 100;
    const y = temp => 215 - (temp - min) * 180 / (max - min);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 700 270");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Seven-day high and low temperatures");

    // Helper for adding text to the chart
    function addText(value, xPos, yPos, color = "#64748b") {
        const text = document.createElementNS(svg.namespaceURI, "text");
        text.setAttribute("x", xPos);
        text.setAttribute("y", yPos);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "13");
        text.setAttribute("fill", color);
        text.textContent = value;
        svg.appendChild(text);
    }

    // Temperature scale and horizontal grid lines
    for (let temp = min; temp <= max; temp += 5) {
        const pos = y(temp);

        const line = document.createElementNS(svg.namespaceURI, "line");
        line.setAttribute("x1", 65);
        line.setAttribute("x2", 665);
        line.setAttribute("y1", pos);
        line.setAttribute("y2", pos);
        line.setAttribute("stroke", "#e2e8f0");
        svg.appendChild(line);

        addText(temp + "°C", 30, pos + 4);
    }

    // Draw a line and temperature points
    function drawLine(temps, color, offset) {
        const line = document.createElementNS(svg.namespaceURI, "polyline");
        line.setAttribute("points",
            temps.map((temp, i) => `${x(i)},${y(temp)}`).join(" ")
        );
        line.setAttribute("fill", "none");
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "3");
        svg.appendChild(line);

        temps.forEach(function(temp, i) {
            const dot = document.createElementNS(svg.namespaceURI, "circle");
            dot.setAttribute("cx", x(i));
            dot.setAttribute("cy", y(temp));
            dot.setAttribute("r", 4);
            dot.setAttribute("fill", color);
            svg.appendChild(dot);

            addText(Math.round(temp) + "°", x(i), y(temp) + offset, color);
        });
    }

    drawLine(highs, "#f97316", -12);
    drawLine(lows, "#2563eb", 20);

    // Days of the week
    daily.time.forEach(function(day, i) {
        const name = new Date(day + "T12:00:00Z")
            .toLocaleDateString("en-US", {
                weekday: "short",
                timeZone: "UTC"
            });

        addText(name, x(i), 255);
    });

    chart.replaceChildren(svg);
}

// Search for a city
searchForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = cityInput.value.trim();

    if (!name || name.length > 100) {
        showMessage("Please enter a valid city name.", "error");
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";
    showMessage("Loading weather information...", "loading");
    weatherSection.classList.add("hidden");
    forecastData = null;

    try {
        const key = "weather_" + name.toLowerCase();
        let saved = null;

        // Check if weather was saved recently
        try {
            saved = JSON.parse(sessionStorage.getItem(key));
            if (saved && Date.now() - saved.time >= cacheTime) {
                saved = null;
            }
        } catch (error) {
            saved = null;
        }

        let city, data;

        if (saved && saved.city && saved.data) {
            city = saved.city;
            data = saved.data;
        } else {
            city = await getCity(name);
            data = await getWeather(city.latitude, city.longitude);

            try {
                sessionStorage.setItem(key, JSON.stringify({
                    city: city,
                    data: data,
                    time: Date.now()
                }));
            } catch (error) {
                // Weather still works without saved data
            }
        }

        forecastData = data;
        displayWeather(city, data);
        weatherFilter.value = "all";
        displayForecast();
        displayTemperatureChart(data);

        showMessage("Weather information loaded successfully!", "success");

    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
});

// Filter forecast cards
weatherFilter.addEventListener("change", function() {
    displayForecast(weatherFilter.value);
});

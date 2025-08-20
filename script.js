const apiKey = "3600bf2da9e96541b1d2d210793c9671"; // User's OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const cityInput = document.getElementById("city-input");
const weatherCard = document.getElementById("weather-card");
const cityName = document.getElementById("city-name");
const weatherDesc = document.getElementById("weather-desc");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weather-icon");
const errorMessage = document.getElementById("error-message");

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    weatherCard.classList.add("hidden");
}

function showWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherDesc.textContent = data.weather[0].description;
    temp.textContent = `🌡️ ${Math.round(data.main.temp - 273.15)}°C`;
    humidity.textContent = `💧 Humidity: ${data.main.humidity}%`;
    wind.textContent = `💨 Wind: ${data.wind.speed} m/s`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    weatherIcon.alt = data.weather[0].main;
    weatherCard.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

function getWeatherByCoords(lat, lon) {
    fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(res => {
            if (!res.ok) throw new Error("Location not found");
            return res.json();
        })
        .then(data => {
            showWeather(data);
        })
        .catch(err => {
            showError("Could not fetch weather for your location.");
        });
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                showError("Location access denied.");
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name.");
        return;
    }
    fetch(`${apiUrl}?q=${city}&appid=${apiKey}`)
        .then(res => {
            if (!res.ok) throw new Error("City not found");
            return res.json();
        })
        .then(data => {
            showWeather(data);
        })
        .catch(err => {
            showError("Could not fetch weather for this city.");
        });
});

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

if (locationBtn) {
    locationBtn.addEventListener("click", getLocationWeather);
}

// Auto-fetch weather for user's location on page load
window.addEventListener("DOMContentLoaded", getLocationWeather);

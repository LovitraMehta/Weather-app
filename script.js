const apiKey = "3600bf2da9e96541b1d2d210793c9671"; // User's OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const cityInput = document.getElementById("city-input");
const weatherCard = document.getElementById("weather-card");
const cityName = document.getElementById("city-name");
const weatherDesc = document.getElementById("weather-desc");
const temp = document.getElementById("temp");
const feelsLike = document.getElementById("feels-like");
const minMax = document.getElementById("min-max");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const wind = document.getElementById("wind");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
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
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like - 273.15)}°C`;
    minMax.textContent = `Min: ${Math.round(data.main.temp_min - 273.15)}°C / Max: ${Math.round(data.main.temp_max - 273.15)}°C`;
    humidity.textContent = `💧 Humidity: ${data.main.humidity}%`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    visibility.textContent = `Visibility: ${data.visibility / 1000} km`;
    wind.textContent = `💨 Wind: ${data.wind.speed} m/s`;
    sunrise.textContent = `Sunrise: ${formatTime(data.sys.sunrise, data.timezone)}`;
    sunset.textContent = `Sunset: ${formatTime(data.sys.sunset, data.timezone)}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    weatherIcon.alt = data.weather[0].main;
    weatherCard.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

function formatTime(unix, tzOffset) {
    const date = new Date((unix + tzOffset) * 1000);
    return date.toUTCString().match(/\d{2}:\d{2}/)[0];
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

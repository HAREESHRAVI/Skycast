const apikey = '5e69be56ae5faf84ec9c4012d4250049';

function getWeather() {
  const city = document.getElementById('city').value;

  if (!city) {
    getLocationAndWeather(); // Default to current location if no city is entered
  } else {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
    fetchWeatherData(currentWeatherUrl, forecastUrl);
  }
}

function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`;

      fetchWeatherData(currentWeatherUrl, forecastUrl);
    }, error => {
      console.error("Error getting location:", error.message);
      alert("Could not get your location. Please enter a city.");
    });
  } else {
    alert("Geolocation is not supported by this browser. Please enter a city.");
  }
}

function fetchWeatherData(currentWeatherUrl, forecastUrl) {
  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching current weather data. Please try again.");
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => displayHourlyForecast(data.list))
    .catch(error => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}

function displayWeather(data) {
  const tempDivinfo = document.getElementById('temp-div');
  const weatherInfoDiv = document.getElementById('weather-info');
  const weatherIcon = document.getElementById('weather-icon');

  // Clear previous data
  weatherInfoDiv.innerHTML = "";
  tempDivinfo.innerHTML = "";

  if (data.cod === '404') {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
    let description = data.weather[0].description;

    // Capitalize the first letter of each word
    description = description
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Convert wind speed from m/s to km/h
    const windSpeedInKmH = (data.wind.speed * 3.6).toFixed(2); // Rounded to 2 decimal places

    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHTML = `<p>${cityName}</p>
                         <p>${description}</p>
                         <p>Wind Speed: ${windSpeedInKmH} km/h</p>`;

    tempDivinfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block'; // Show weather icon
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById('hourly-forecast');
  hourlyForecastDiv.innerHTML = ""; // Clear previous data

  const next24Hours = hourlyData.slice(0, 8); // Next 8 items represent the upcoming 24 hours (3-hour intervals)

  next24Hours.forEach(item => {
    const dateTime = new Date(item.dt * 1000); // Convert Unix timestamp to JavaScript Date
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15); // Convert from Kelvin to Celsius
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `<div class="hourly-item">
                                <span>${hour}:00</span>
                                <img src="${iconUrl}" alt="Hourly weather icon">
                                <span>${temperature}°C</span>
                            </div>`;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

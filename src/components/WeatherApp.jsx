import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import clearAnimation from "../assets/animations/clear.json";
import cloudyAnimation from "../assets/animations/cloudy.json";
import rainAnimation from "../assets/animations/rain.json";
import snowAnimation from "../assets/animations/snow.json";
import thunderAnimation from "../assets/animations/thunder.json";
import drizzleAnimation from "../assets/animations/drizzle.json";
import hazeAnimation from "../assets/animations/haze.json";

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
const API_URL = "https://api.weatherapi.com/v1/current.json";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState("default");
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);


  useEffect(() => {
    if (background === "rainy") {
      createRaindrops();
    } else {
      removeRaindrops();
    }

    if (background === "snowy") {
      createSnowflakes();
    } else {
      removeSnowflakes();
    }
  }, [background]);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&aqi=yes`);
      const data = await response.json();
      if (data.error) {
        setError("City not found");
        setWeather(null);
        setBackground("default");
      } else {
        setWeather(data);
        setError(null);
        updateBackground(data.current.condition.text.toLowerCase());
        fetchForecast();
      }
    } catch (err) {
      setError("Error fetching data");
      setWeather(null);
      setBackground("default");
    }
  };
  

  const fetchForecast = async () => {
    if (!city) return;
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`);
      const data = await response.json();
      if (!data.error) {
        setForecast(data.forecast.forecastday);
      }
    } catch (err) {
      console.error("Error fetching forecast:", err);
    }
  };

  const fetchHistory = async (date) => {
    if (!city) return;
    try {
      const response = await fetch(`${API_URL}/history.json?key=${API_KEY}&q=${city}&dt=${date}`);
      const data = await response.json();
      if (!data.error) {
        setHistory(data.forecast.forecastday[0]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setCity(query);
    if (query.length > 2) {
      try {
        const response = await fetch(`${API_URL}/search.json?key=${API_KEY}&q=${query}`);
        const data = await response.json();
        setAutocompleteResults(data);
      } catch (err) {
        console.error("Error fetching autocomplete:", err);
      }
    } else {
      setAutocompleteResults([]);
    }
  };


  const updateBackground = (condition) => {
    if (condition.includes("clear")) setBackground("sunny");
    else if (condition.includes("cloud")) setBackground("cloudy");
    else if (condition.includes("rain")) setBackground("rainy");
    else if (condition.includes("snow")) setBackground("snowy");
    else if (condition.includes("thunder")) setBackground("thunderstorm");
    else if (condition.includes("drizzle") || condition.includes("haze") || condition.includes("mist")) setBackground("foggy");
    else setBackground("default");
  };

  const getAnimation = (condition) => {
    if (!condition) return null;
    const mainWeather = condition.toLowerCase();
    if (mainWeather.includes("clear")) return clearAnimation;
    if (mainWeather.includes("cloud")) return cloudyAnimation;
    if (mainWeather.includes("rain")) return rainAnimation;
    if (mainWeather.includes("snow")) return snowAnimation;
    if (mainWeather.includes("thunder")) return thunderAnimation;
    if (mainWeather.includes("drizzle")) return drizzleAnimation;
    if (mainWeather.includes("haze") || mainWeather.includes("mist")) return hazeAnimation;
    return null;
  };

  const createRaindrops = () => {
    const rainContainer = document.querySelector(".rain-container");
    if (!rainContainer) return;

    removeRaindrops();

    for (let i = 0; i < 100; i++) {
      const drop = document.createElement("div");
      drop.classList.add("raindrop");
      drop.style.left = `${Math.random() * 100}vw`;
      drop.style.animationDuration = `${Math.random() * 1.5 + 0.5}s`;
      drop.style.animationDelay = `${Math.random()}s`;
      rainContainer.appendChild(drop);
    }
  };

  const removeRaindrops = () => {
    document.querySelectorAll(".raindrop").forEach((drop) => drop.remove());
  };

  const createSnowflakes = () => {
    const snowContainer = document.querySelector(".snow-container");
    if (!snowContainer) return;

    removeSnowflakes();

    for (let i = 0; i < 50; i++) {
      const flake = document.createElement("div");
      flake.classList.add("snowflake");
      flake.style.left = `${Math.random() * 100}vw`;
      flake.style.animationDuration = `${Math.random() * 3 + 2}s`;
      flake.style.animationDelay = `${Math.random()}s`;
      snowContainer.appendChild(flake);
    }
  };

  const removeSnowflakes = () => {
    document.querySelectorAll(".snowflake").forEach((flake) => flake.remove());
  };

  return (
    <div className={`weather-container ${background}`}>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={handleSearchChange}
        onFocus={() => setAutocompleteResults([])}
      />
      {autocompleteResults.length > 0 && (
        <ul className="autocomplete-results">
          {autocompleteResults.map((result) => (
            <li key={result.id} onClick={() => {
              setCity(result.name);
              setAutocompleteResults([]);
            }}>
              {result.name}, {result.country}
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchWeather}>Get Weather</button>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-info">
          <h2>{weather.location.name}, {weather.location.country}</h2>
          <p>{weather.current.condition.text}</p>
          <p>🌡️ {weather.current.temp_c}°C</p>
          <p>💨 Wind: {weather.current.wind_kph} kph</p>
          {weather.current.air_quality && weather.current.air_quality.pm2_5 !== undefined && (
            <p>🌫️ AQI: {weather.current.air_quality.pm2_5.toFixed(2)}</p>
          )}
          {getAnimation(weather.current.condition.text) && (
            <Lottie animationData={getAnimation(weather.current.condition.text)} className="animation" />
          )}
          {forecast && (
            <div className="forecast-container">
              <h3>7-Day Forecast</h3>
              <div className="forecast-list">
                {forecast.map((day) => (
                  <div key={day.date} className="forecast-item">
                    <p>{day.date}</p>
                    <p>{day.day.condition.text}</p>
                    <p>🌡️ {day.day.avgtemp_c}°C</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <input type="date" onChange={(e) => fetchHistory(e.target.value)} />
          {history && (
            <div className="history-container">
              <h3>Historical Data for {history.date}</h3>
              <p>{history.day.condition.text}</p>
              <p>🌡️ Avg Temp: {history.day.avgtemp_c}°C</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;

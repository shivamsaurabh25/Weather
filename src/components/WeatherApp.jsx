import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import clearAnimation from "../assets/animations/clear.json";
import cloudyAnimation from "../assets/animations/cloudy.json";
import rainAnimation from "../assets/animations/rain.json";
import snowAnimation from "../assets/animations/snow.json";
import thunderAnimation from "../assets/animations/thunder.json";
import drizzleAnimation from "../assets/animations/drizzle.json";
import hazeAnimation from "../assets/animations/haze.json";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState("default");

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
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        setError(null);
        updateBackground(data.weather[0].main.toLowerCase());
      } else {
        setError("City not found");
        setWeather(null);
        setBackground("default");
      }
    } catch (err) {
      setError("Error fetching data");
      setWeather(null);
      setBackground("default");
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

  const getAnimation = (weather) => {
    if (!weather) return null;
    const mainWeather = weather.weather[0].main.toLowerCase();
    if (mainWeather.includes("clear")) return clearAnimation;
    if (mainWeather.includes("cloud")) return cloudyAnimation;
    if (mainWeather.includes("rain")) return rainAnimation;
    if (mainWeather.includes("snow")) return snowAnimation;
    if (mainWeather.includes("thunder")) return thunderAnimation;
    if (mainWeather.includes("drizzle")) return drizzleAnimation;
    if (mainWeather.includes("haze")) return hazeAnimation;
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
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-info">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>{weather.weather[0].description}</p>
          <p>🌡️ {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          {getAnimation(weather) && <Lottie animationData={getAnimation(weather)} className="animation" />}
        </div>
      )}
      <div className="rain-container"></div>
      <div className="snow-container"></div>
    </div>
  );
};

export default WeatherApp;

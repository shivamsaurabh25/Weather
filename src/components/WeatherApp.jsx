import React, { useState } from "react";
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

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        setError(null);
      } else {
        setError("City not found");
        setWeather(null);
      }
    } catch (err) {
      setError("Error fetching data");
      setWeather(null);
    }
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

  return (
    <div className="weather-container">
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
          <p>{weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          {getAnimation(weather) && <Lottie animationData={getAnimation(weather)} className="animation" />}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;

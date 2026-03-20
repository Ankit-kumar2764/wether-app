import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);

  const API_KEY = "9e6f0d2ff542c1291fb1fdc1059b0420";

  // 🔍 Fetch city suggestions
  const getSuggestions = async (value) => {
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
    );

    const data = await res.json();
    setSuggestions(data);
  };

  // 🌦️ Fetch weather
  const getWeather = async (selectedCity) => {
    const cityName = selectedCity || city;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();
    setWeather(data);

    setSuggestions([]); // hide suggestions
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🌦️ Weather App</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => getSuggestions(e.target.value)}
          />

          <button onClick={() => getWeather()}>Search</button>
        </div>

        {/* 🔥 Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() =>
                  getWeather(`${item.name},${item.country}`)
                }
              >
                {item.name}, {item.country}
              </li>
            ))}
          </ul>
        )}

        {/* 🌤️ Weather Data */}
        {weather && weather.main && (
          <div className="weather">
            <h2>{weather.name}</h2>
            <p>🌡️ {weather.main.temp} °C</p>
            <p>{weather.weather[0].description}</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌬️ Wind: {weather.wind.speed} m/s</p>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
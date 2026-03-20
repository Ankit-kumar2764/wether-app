import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "9e6f0d2ff542c1291fb1fdc1059b0420";

  // Load last searched city
  useEffect(() => {
    const savedCity = localStorage.getItem("city");
    if (savedCity) {
      setCity(savedCity);
      getWeather(savedCity);
    }
  }, []);

  const getWeather = async (searchCity = city) => {
    if (!searchCity) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setWeather(data);

      // Save city
      localStorage.setItem("city", searchCity);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }

    setLoading(false);
  };

  // Dynamic icon
  const getIcon = () => {
    if (!weather) return "🌤️";
    const main = weather.weather[0].main.toLowerCase();

    if (main.includes("cloud")) return "☁️";
    if (main.includes("rain")) return "🌧️";
    if (main.includes("clear")) return "☀️";
    if (main.includes("snow")) return "❄️";

    return "🌤️";
  };

  // Dynamic background
  const getBackground = () => {
    if (!weather) return "default";

    const main = weather.weather[0].main.toLowerCase();

    if (main.includes("clear")) return "sunny";
    if (main.includes("rain")) return "rainy";
    if (main.includes("cloud")) return "cloudy";

    return "default";
  };

  return (
    <div className={`app ${getBackground()}`}>
      <div className="card">
        <h1>🌦️ Weather App</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") getWeather();
            }}
          />
          <button onClick={() => getWeather()}>Search</button>
        </div>

        {loading && <div className="loader"></div>}
        {error && <p className="error">{error}</p>}

        {weather && !loading && (
          <div className="weather">
            <h2>{weather.name}</h2>
            <h1>{getIcon()}</h1>
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
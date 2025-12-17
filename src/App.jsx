import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
const [countries, setCountries] = useState([]);
const [filter, setFilter] = useState("");node -v

const [weather, setWeather] = useState(null);

// Fetch all countries on component mount
useEffect(() => {
axios.get("https://restcountries.com/v3.1/all").then((response) => {
setCountries(response.data);
});
}, []);

// Handle input change for filtering countries
const handleFilterChange = (event) => {
setFilter(event.target.value);
setWeather(null); // Reset weather when filter changes
};

// Filter countries based on user input
const filteredCountries = countries.filter((country) =>
country.name.common.toLowerCase().includes(filter.toLowerCase())
);

// Fetch weather data using latitude and longitude
const fetchWeather = (lat, lon) => {
console.log("Fetching weather for coordinates:", lat, lon);

// Open-Meteo API URL
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&wind_speed_unit=ms`;

axios
.get(url)
.then((response) => {
console.log("Weather data:", response.data);
setWeather(response.data.current_weather); // Extract current weather data
})
.catch((error) => {
console.error("Error fetching weather data:", error.response?.data || error.message);
setWeather(null); // Reset weather data on error
});
};

// Handle "show" button click to display details and fetch weather
const handleShowDetails = (country) => {
setFilter(country.name.common);
if (country.capital && country.capital.length > 0 && country.latlng) {
const [lat, lon] = country.latlng; // Get latitude and longitude
fetchWeather(lat, lon); // Fetch weather using lat/lon
} else {
console.error("No capital or coordinates found for this country.");
}
};

return (
<div>
<div>
<label>find countries: </label>
<input value={filter} onChange={handleFilterChange} />
</div>
{filteredCountries.length > 10 && <p>Too many matches, specify another filter</p>}
{filteredCountries.length <= 10 && filteredCountries.length > 1 && (
<ul>
{filteredCountries.map((country) => (
<li key={country.name.common}>
{country.name.common}{" "}
<button onClick={() => handleShowDetails(country)}>show</button>
</li>
))}
</ul>
)}
{filteredCountries.length === 1 && (
<CountryDetails country={filteredCountries[0]} weather={weather} />
)}
</div>
);
};

const CountryDetails = ({ country, weather }) => {
return (
<div>
<h1>{country.name.common}</h1>
<p>Capital: {country.capital ? country.capital[0] : "N/A"}</p>
<p>Area: {country.area}</p>
<h3>Languages:</h3>
<ul>
{Object.values(country.languages || {}).map((language) => (
<li key={language}>{language}</li>
))}
</ul>
<img
src={country.flags.svg}
alt={`Flag of ${country.name.common}`}
width="150px"
/>

{/* Render weather data only if it exists */}
{weather ? (
<div>
<h3>Weather in {country.capital[0]}</h3>
<p>Temperature: {weather.temperature} °C</p>
<p>Wind Speed: {weather.windspeed} m/s</p>
</div>
) : (
<p>Weather data not available.</p>
)}
</div>
);
};

export default App;
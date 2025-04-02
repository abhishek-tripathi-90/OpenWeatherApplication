const apiKey = "325c2e6ea93a8a74dc68e4324b422676";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const weatherInfo = document.getElementById("weatherInfo");
    const errorMessage = document.getElementById("errorMessage");

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (data.cod === "404") {
            errorMessage.textContent = "City not found. Please try again.";
            weatherInfo.innerHTML = "";
            return;
        }

        // Display Weather Data
        weatherInfo.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;

        errorMessage.textContent = "";
    } catch (error) {
        errorMessage.textContent = "Error fetching data. Please try again.";
        console.error("Error:", error);
    }
}

// Save Favorite City
function saveFavorite() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
    }
}

// Display Favorite Cities
function displayFavorites() {
    const favoritesList = document.getElementById("favoritesList");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesList.innerHTML = "";

    favorites.forEach((city, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${city} <button onclick="removeFavorite(${index})">Remove From Favourite</button>`;
        li.onclick = () => {
            document.getElementById("cityInput").value = city;
            getWeather();
        };
        favoritesList.appendChild(li);
    });
}

function removeFavorite(index) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1); // Remove city from array
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Update storage
    displayFavorites(); // Refresh UI
}



// Load Favorites on Page Load
window.onload = displayFavorites;

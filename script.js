<script>
const appId = '0e1db76bd0d02662bf197a1a7ff4ae31'; // Ensure this is your valid API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';
const geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';

async function getAirQualityByCoords() {
  const longitude = document.getElementById('longitude').value;
  const latitude = document.getElementById('latitude').value;

  if (longitude && latitude) {
    try {
      const response = await fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${appId}`);
      
      // Check if response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        console.log("Data fetched successfully:", data); // For debugging
        displayResult(data, 'result-coords');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please check the console for more details.");
    }
  } else {
    alert("Please enter both longitude and latitude.");
  }
}

async function getAirQualityByCity() {
  const city = document.getElementById('city').value;

  if (city) {
    try {
      const response = await fetch(`${geoApiUrl}?q=${city}&appid=${appId}`);
      
      // Check if response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        const airQualityResponse = await fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${appId}`);

        if (airQualityResponse.ok) {
          const airQualityData = await airQualityResponse.json();
          displayResult(airQualityData, 'result-city');
        } else {
          throw new Error(`HTTP error! status: ${airQualityResponse.status}`);
        }
      } else {
        alert("City not found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please check the console for more details.");
    }
  } else {
    alert("Please enter city name.");
  }
}

function displayResult(data, elementId) {
  const resultDiv = document.getElementById(elementId);
  const aqi = data.list[0].main.aqi; // Air Quality Index
  const components = data.list[0].components; // Air quality components
  const aqiDescription = getAQIDescription(aqi); // Get description based on AQI

  resultDiv.innerHTML = `
    <h3>Air Quality Index: ${aqi} [${aqiDescription}]</h3><br>
    <p><strong>Carbon Monoxide (CO):</strong> ${components.co} µg/m³</p><br>
    <p><strong>Nitrogen Monoxide (NO):</strong> ${components.no} µg/m³</p><br>
    <p><strong>Nitrogen Dioxide (NO2):</strong> ${components.no2} µg/m³</p><br>
    <p><strong>Ozone (O3):</strong> ${components.o3} µg/m³</p><br>
    <p><strong>Sulphur Dioxide (SO2):</strong> ${components.so2} µg/m³</p><br>
    <p><strong>Fine Particulate Matter (PM2.5):</strong> ${components.pm2_5} µg/m³</p><br>
    <p><strong>Coarse Particulate Matter (PM10):</strong> ${components.pm10} µg/m³</p><br>
    <p><strong>Ammonia (NH3):</strong> ${components.nh3} µg/m³</p>
  `;
}

// Function to return AQI description based on the value
function getAQIDescription(aqi) {
  switch(aqi) {
    case 1:
      return "Good";
    case 2:
      return "Fair";
    case 3:
      return "Moderate";
    case 4:
      return "Poor";
    case 5:
      return "Very Poor";
    default:
      return "Unknown";
  }
}
</script>
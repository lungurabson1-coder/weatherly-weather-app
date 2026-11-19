const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    let message = `Weather service error (${response.status}).`;
    try {
      const body = await response.json();
      if (body.message) message = body.message;
    } catch {
      // Keep the HTTP status message if the response is not JSON.
    }
    throw new Error(message);
  }
  return response.json();
}

function checkApiKey() {
  if (!API_KEY) {
    throw new Error("OpenWeather API key is missing. Add it to your .env file and restart the app.");
  }
}

export async function getCoordinates(city) {
  checkApiKey();
  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`;
  const matches = await request(url);
  if (!matches.length) throw new Error(`We could not find "${city}". Check the spelling and try again.`);
  // Prefer the first geocoding match returned by OpenWeather.
  return matches[0];
}

export async function getWeatherForLocation(place) {
  checkApiKey();
  const params = `lat=${place.lat}&lon=${place.lon}&units=metric&appid=${API_KEY}`;
  const [current, forecast] = await Promise.all([
    request(`${BASE_URL}/data/2.5/weather?${params}`),
    request(`${BASE_URL}/data/2.5/forecast?${params}`)
  ]);
  return { current, forecast, place };
}

export async function getCityWeather(city) {
  const place = await getCoordinates(city);
  const params = `lat=${place.lat}&lon=${place.lon}&units=metric&appid=${API_KEY}`;
  const current = await request(`${BASE_URL}/data/2.5/weather?${params}`);
  return { current, place };
}

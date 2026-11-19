
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import { CloudSun, RefreshCw } from "lucide-react";

import SearchBar from "./components/SearchBar";
import UnitToggle from "./components/UnitToggle";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import CityWeather from "./components/CityWeather";

import {
  getCoordinates,
  getWeatherForLocation,
  getCityWeather
} from "./weatherApi";

import {
  getHourlyEntries,
  getDailyEntries,
  getTodayHighLow
} from "./weatherUtils";

const DEFAULT_CITY = "Ndola";

const SUMMARY_CITIES = [
  "Lusaka",
  "London",
  "New York"
];

export default function WeatherApp() {
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState("C");
  const [weather, setWeather] = useState(null);
  const [summaries, setSummaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load weather information for the main city.
  const loadMainCity = useCallback(async (cityName) => {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const place = await getCoordinates(cityName);

      const result = await getWeatherForLocation(place);

      setWeather(result);
      setLastUpdated(new Date());

    } catch (err) {
      setError(
        err.message || "Unable to load weather. Please try again."
      );

    } finally {
      setLoading(false);
    }
  }, []);

  // Load weather summaries for other cities.
  const loadSummaries = useCallback(async () => {
    setSummaryLoading(true);

    const results = await Promise.all(
      SUMMARY_CITIES.map(async (label) => {
        try {
          return {
            label,
            data: await getCityWeather(label),
            error: ""
          };

        } catch {
          return {
            label,
            data: null,
            error: "Unavailable"
          };
        }
      })
    );

    setSummaries(results);
    setSummaryLoading(false);
  }, []);

  // Load the default city and summary cities when the app opens.
  useEffect(() => {
    // Start the initial asynchronous weather requests.
    // The loading functions manage their own state updates.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMainCity(DEFAULT_CITY);

    loadSummaries();
  }, [loadMainCity, loadSummaries]);

  // Handle city searches.
  async function handleSearch(event) {
    event.preventDefault();

    const city = search.trim();

    if (!city) {
      setError("Please enter a city name before searching.");
      return;
    }

    await loadMainCity(city);
  }

  // Get the selected city's timezone.
  const timezoneOffset = weather?.current?.timezone || 0;

  // Calculate hourly forecast information.
  const hourly = useMemo(
    () =>
      weather
        ? getHourlyEntries(weather.forecast, timezoneOffset)
        : [],
    [weather, timezoneOffset]
  );

  // Calculate daily forecast information.
  const daily = useMemo(
    () =>
      weather
        ? getDailyEntries(weather.forecast, timezoneOffset)
        : [],
    [weather, timezoneOffset]
  );

  // Calculate today's estimated high and low temperatures.
  const todayRange = useMemo(
    () =>
      weather
        ? getTodayHighLow(weather.forecast, timezoneOffset)
        : { high: null, low: null },
    [weather, timezoneOffset]
  );

  return (
    <main className="app-shell">

      {/* Application header */}
      <header className="app-header">

        <a
          className="brand"
          href="/"
          aria-label="Weatherly home"
        >
          <span className="brand-icon">
            <CloudSun size={25} aria-hidden="true" />
          </span>

          <span>
            Weatherly
            <small>WEATHER MADE SIMPLE</small>
          </span>
        </a>

        <div className="header-actions">

          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={handleSearch}
            disabled={loading}
          />

          <UnitToggle
            unit={unit}
            onChange={setUnit}
          />

        </div>
      </header>

      {/* Welcome section */}
      <section className="welcome-row">

        <div>
          <p className="eyebrow">
            LIVE WEATHER DASHBOARD
          </p>

          <h1>Know before you go.</h1>

          <p className="muted">
            Real-time conditions and forecasts for the places
            that matter.
          </p>
        </div>

        <div className="updated-label">
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}`
            : "Waiting for weather data"}
        </div>

      </section>

      {/* Error message */}
      {error && (
        <div
          className="alert"
          role="alert"
          aria-atomic="true"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              loadMainCity(
                search.trim() ||
                weather?.place?.name ||
                DEFAULT_CITY
              )
            }
            aria-label="Retry loading weather"
          >
            <RefreshCw
              size={15}
              aria-hidden="true"
            />
            Retry
          </button>
        </div>
      )}

      {/* Loading message */}
      {loading && (
        <div
          className="loading-panel"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            className="spinner"
            aria-hidden="true"
          />

          Loading weather information...
        </div>
      )}

      {/* Main weather information */}
      {!loading && weather && (
        <>
          <CurrentWeather
            data={weather}
            unit={unit}
            todayRange={todayRange}
          />

          <HourlyForecast
            entries={hourly}
            unit={unit}
          />

          <DailyForecast
            days={daily}
            unit={unit}
          />
        </>
      )}

      {/* Other city summaries */}
      <div className="summary-section">

        {summaryLoading && (
          <p
            className="muted"
            role="status"
            aria-live="polite"
          >
            Loading other city summaries...
          </p>
        )}

        {!summaryLoading && (
          <CityWeather
            cities={summaries}
            unit={unit}
          />
        )}

      </div>

      {/* Application footer */}
      <footer className="app-footer">

        <span>
          Weather data provided by{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noreferrer"
          >
            OpenWeather
          </a>.
        </span>

        <span>
          Weatherly · Built with React
        </span>

      </footer>

    </main>
  );
}

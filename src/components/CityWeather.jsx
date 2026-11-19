import React from "react";
import {
  formatTemperature,
  weatherIcon
} from "../weatherUtils";

export default function CityWeather({ cities, unit }) {
  return (
    <section className="panel">
      <h2>Other Cities</h2>

      <div className="city-grid">
        {cities.map((city) => (
          <div key={city.label} className="city-card">
            <h3>{city.label}</h3>

            {city.data ? (
              <>
                <img
                  src={weatherIcon(
                    city.data.current.weather?.[0]?.icon
                  )}
                  alt="Weather"
                />

                <h2>
                  {formatTemperature(
                    city.data.current.main?.temp,
                    unit
                  )}
                </h2>

                <p>
                  {city.data.current.weather?.[0]?.description}
                </p>
              </>
            ) : (
              <p>{city.error || "Weather unavailable"}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

import React from "react";
import {
  formatTemperature,
  weatherIcon
} from "../weatherUtils";

export default function HourlyForecast({ entries, unit }) {
  return (
    <section className="panel">
      <h2>Next 24 Hours</h2>

      <div className="hourly-list">
        {entries.map((item) => (
          <div key={item.dt} className="hour-card">
            <p>{item.localTime}</p>

            <img
              src={weatherIcon(item.weather?.[0]?.icon)}
              alt={item.weather?.[0]?.description || "Weather"}
            />

            <h3>
              {formatTemperature(item.main?.temp, unit)}
            </h3>

            <p>{item.weather?.[0]?.main}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

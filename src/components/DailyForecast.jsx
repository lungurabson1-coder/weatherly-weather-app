import React from "react";
import {
  formatTemperature,
  formatDateKey,
  weatherIcon
} from "../weatherUtils";

export default function DailyForecast({ days, unit }) {
  return (
    <section className="panel">
      <h2>Five-Day Forecast</h2>

      {days.map((day) => (
        <div key={day.date} className="daily-row">
          <strong>{formatDateKey(day.date)}</strong>

          <img
            src={weatherIcon(day.icon)}
            alt={day.description}
          />

          <span>{day.description}</span>

          <span>
            High: {formatTemperature(day.max, unit)}
          </span>

          <span>
            Low: {formatTemperature(day.min, unit)}
          </span>

          {day.partial && (
            <small>Partial forecast</small>
          )}
        </div>
      ))}
    </section>
  );
}

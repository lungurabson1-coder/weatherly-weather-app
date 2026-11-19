import React from "react";
import {
  formatTemperature,
  formatLocalTime,
  weatherIcon
} from "../weatherUtils";

export default function CurrentWeather({ data, unit, todayRange }) {
  const { current, place } = data;

  const description =
    current.weather?.[0]?.description || "Weather unavailable";

  return (
    <section className="current-card panel">
      <h2>
        {place.name}, {place.country}
      </h2>

      <p>{description}</p>

      <p>
        {formatLocalTime(
          current.dt,
          current.timezone || 0,
          true
        )}
      </p>

      <img
        src={weatherIcon(current.weather?.[0]?.icon)}
        alt=""
        aria-hidden="true"
      />

      <h1>
        {formatTemperature(current.main?.temp, unit)}
      </h1>

      <p>Wind: {current.wind?.speed ?? "Unavailable"} m/s</p>

      <p>
        Today's estimated high:{" "}
        {formatTemperature(todayRange.high, unit)}
      </p>

      <p>
        Today's estimated low:{" "}
        {formatTemperature(todayRange.low, unit)}
      </p>
    </section>
  );
}

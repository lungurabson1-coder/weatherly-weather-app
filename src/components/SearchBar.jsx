
import React from "react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  disabled
}) {
  return (
    <form onSubmit={onSubmit} className="search-form">
      <label htmlFor="city-search" className="sr-only">
        Enter a city name
      </label>

      <input
        id="city-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search a city..."
        aria-label="Search for a city"
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={disabled}
        aria-label="Search for weather"
      >
        Search
      </button>
    </form>
  );
}

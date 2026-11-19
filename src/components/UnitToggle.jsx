
import React from "react";

export default function UnitToggle({ unit, onChange }) {
  return (
    <div
      className="unit-toggle"
      role="group"
      aria-label="Temperature unit selection"
    >
      <button
        type="button"
        className={unit === "C" ? "active" : ""}
        onClick={() => onChange("C")}
        aria-label="Display temperature in Celsius"
        aria-pressed={unit === "C"}
      >
        °C
      </button>

      <button
        type="button"
        className={unit === "F" ? "active" : ""}
        onClick={() => onChange("F")}
        aria-label="Display temperature in Fahrenheit"
        aria-pressed={unit === "F"}
      >
        °F
      </button>
    </div>
  );
}


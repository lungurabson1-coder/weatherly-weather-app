export function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(value, unit) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "Unavailable";
  const shown = unit === "F" ? celsiusToFahrenheit(Number(value)) : Number(value);
  return `${Math.round(shown)}°${unit}`;
}

function localDate(timestamp, timezoneOffset) {
  // OpenWeather gives a UTC timestamp and the city's offset in seconds.
  // Shift the timestamp, then use UTC getters so the device timezone is irrelevant.
  return new Date((timestamp + timezoneOffset) * 1000);
}

export function formatLocalTime(timestamp, timezoneOffset, includeDate = false) {
  const date = localDate(timestamp, timezoneOffset);
  const time = `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
  if (!includeDate) return time;
  return `${date.toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" })} · ${time}`;
}

export function localDateKey(timestamp, timezoneOffset) {
  const date = localDate(timestamp, timezoneOffset);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function formatDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    timeZone: "UTC", weekday: "long", day: "numeric", month: "short"
  });
}

export function getHourlyEntries(forecast, timezoneOffset) {
  const now = Math.floor(Date.now() / 1000);
  return (forecast?.list || [])
    .filter(item => item.dt >= now)
    .sort((a, b) => a.dt - b.dt)
    .slice(0, 8)
    .map(item => ({
      ...item,
      localDate: localDateKey(item.dt, timezoneOffset),
      localTime: formatLocalTime(item.dt, timezoneOffset)
    }));
}

export function getDailyEntries(forecast, timezoneOffset) {
  const grouped = new Map();
  for (const item of (forecast?.list || [])) {
    const key = localDateKey(item.dt, timezoneOffset);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }

  return [...grouped.entries()].slice(0, 5).map(([date, entries]) => {
    const temps = entries.map(entry => ({
      min: entry.main?.temp_min,
      max: entry.main?.temp_max
    })).filter(t => Number.isFinite(t.min) && Number.isFinite(t.max));
    const descriptions = {};
    for (const entry of entries) {
      const description = entry.weather?.[0]?.description || "Unknown";
      descriptions[description] = (descriptions[description] || 0) + 1;
    }
    const commonCondition = Object.entries(descriptions)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "Unavailable";

    return {
      date,
      entries,
      min: temps.length ? Math.min(...temps.map(t => t.min)) : null,
      max: temps.length ? Math.max(...temps.map(t => t.max)) : null,
      description: commonCondition,
      icon: entries[Math.floor(entries.length / 2)]?.weather?.[0]?.icon,
      partial: entries.length < 8
    };
  });
}

export function getTodayHighLow(forecast, timezoneOffset) {
  const todayKey = localDateKey(Math.floor(Date.now() / 1000), timezoneOffset);
  const entries = (forecast?.list || []).filter(
    item => localDateKey(item.dt, timezoneOffset) === todayKey
  );
  if (!entries.length) return { high: null, low: null };
  return {
    high: Math.max(...entries.map(item => item.main.temp_max)),
    low: Math.min(...entries.map(item => item.main.temp_min))
  };
}

export function weatherIcon(code) {
  return code ? `https://openweathermap.org/img/wn/${code}@2x.png` : "";
}

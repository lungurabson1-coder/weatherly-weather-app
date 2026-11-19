# Weatherly – Full Stack Practical Assignment 1

## Student details
- Student name: [Enter your full name]
- Student ID: [Enter your student ID]
- Repository URL: [Add your GitHub repository URL after publishing]
- Live demo URL: [Add your deployed application URL after deployment]

## 1. Project overview
Weatherly is a responsive React weather dashboard. It retrieves live weather data from OpenWeather and defaults to Ndola, Zambia. Users can search for another city and switch between Celsius and Fahrenheit.

## 2. Technology stack
- React 18
- JavaScript (ES modules)
- HTML5
- CSS3
- Vite development/build tool
- OpenWeather Geocoding API, Current Weather API and 5 Day / 3 Hour Forecast API
- Fetch API for HTTP requests
- Lucide React icons

## 3. Features implemented
- Automatic weather load for Ndola, Zambia.
- Current temperature, description, weather icon, wind speed, feels-like temperature, local date/time, and estimated high/low.
- Eight next available forecast entries at three-hour intervals.
- Five local calendar-date forecast summaries.
- Current weather summaries for Lusaka, London and New York.
- Celsius/Fahrenheit display conversion for all temperature sections.
- City search with empty-input and unknown-city feedback.
- Loading feedback, HTTP/API error handling and retry action.
- Responsive desktop and mobile layout.
- OpenWeather attribution and last successful update time.

## 4. Requirements
- Node.js 18 or later
- npm
- An OpenWeather API key

## 5. Installation and running
1. Download or clone this repository.
2. Open the project folder in a terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to a new file named `.env`.
5. Add your OpenWeather API key:

   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open the local URL printed by Vite, usually `http://localhost:5173`.

To create and test a production build:

```bash
npm run build
npm run preview
```

## 6. API configuration and data flow
The application uses these OpenWeather services:

1. Geocoding: `https://api.openweathermap.org/geo/1.0/direct`
2. Current weather: `https://api.openweathermap.org/data/2.5/weather`
3. Five-day forecast: `https://api.openweathermap.org/data/2.5/forecast`

The app first resolves a city name to latitude and longitude. It then requests current conditions and the five-day/three-hour forecast. Forecast data is requested in metric units and temperature conversion is performed in the browser.

**API key security:** Vite variables prefixed with `VITE_` are included in browser-side code and are visible to users. This setup is suitable only if the provider's key and account terms permit browser use. Do not commit `.env`. If the key must remain confidential, move API calls to a backend/serverless proxy and keep the secret there.

## 7. Forecast calculations
- The hourly section filters forecast records to timestamps at or after the current time, sorts them in ascending order and selects the next eight records supplied by the three-hour forecast service.
- Each timestamp is converted to the selected city's local time using the `timezone` offset returned by OpenWeather. This avoids relying on the user's device timezone.
- Forecast records are grouped by the selected city's local calendar date. The five earliest available date groups are displayed.
- Daily minimum is the lowest `temp_min` among that date's available three-hour records. Daily maximum is the highest `temp_max`.
- The daily weather description is the most frequent description among the day's available forecast records.
- A day with fewer than eight three-hour records is labelled "Partial forecast". These are estimates from available samples, not guaranteed full-day extremes.
- Today's high and low use today's remaining forecast records. If none are available, the app displays "Unavailable"; current-weather `temp_min` and `temp_max` are not used as a substitute.
- Celsius to Fahrenheit conversion: `F = (C × 9 / 5) + 32`. Original Celsius values are retained and converted only for display.
- Wind speed is displayed in metres per second (m/s), matching the metric API response.

## 8. Project structure

```text
weather-app-assignment/
├── index.html
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── WeatherApp.jsx
    ├── weatherApi.js
    ├── weatherUtils.js
    ├── styles.css
    └── components/
        ├── SearchBar.jsx
        ├── UnitToggle.jsx
        ├── CurrentWeather.jsx
        ├── HourlyForecast.jsx
        ├── DailyForecast.jsx
        └── CityWeather.jsx
```

## 9. Testing evidence
Run the app and complete this table. Record actual results and attach screenshots in a `screenshots/` folder before submission.

| No. | Test case | Expected result | Actual result | Status |
|---:|---|---|---|---|
| 1 | Open the application | Ndola weather loads automatically | To be completed | Pending |
| 2 | Search for Lusaka | Location, current weather and forecasts update together | To be completed | Pending |
| 3 | Submit an empty search | Helpful validation message appears | To be completed | Pending |
| 4 | Search for an unknown city | City-not-found message appears | To be completed | Pending |
| 5 | Check hourly forecast | Up to eight next available three-hour entries appear | To be completed | Pending |
| 6 | Check five-day forecast | Five distinct available local dates appear where API data permits | To be completed | Pending |
| 7 | Switch °C to °F | Every temperature changes; 0°C equals 32°F | To be completed | Pending |
| 8 | Check a different time zone | Forecast times use the selected city's local time | To be completed | Pending |
| 9 | Disable network or use invalid API key | Readable error and retry action appear | To be completed | Pending |
| 10 | Resize browser to mobile width | Layout remains readable without page-wide horizontal scrolling | To be completed | Pending |
| 11 | Open deployed URL | App and API requests work outside development environment | To be completed | Pending |

### Screenshot evidence to capture
- Desktop dashboard with current weather and forecasts.
- Mobile dashboard.
- Successful city search.
- Celsius and Fahrenheit views.
- Invalid city or API/network error message.

## 10. Git version control
Suggested commands:

```bash
git init
git add .
git commit -m "Create responsive React weather dashboard"
git add .
git commit -m "Connect OpenWeather API and process forecasts"
git add .
git commit -m "Add city search, unit conversion and error handling"
```

Create a remote repository on GitHub, then connect and push it:

```bash
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not commit `.env` or expose a confidential API key.

## 11. Deployment
One simple option is Vercel or Netlify:
1. Push the project to GitHub.
2. Import the repository into your hosting provider.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Add `VITE_OPENWEATHER_API_KEY` in the hosting provider's environment-variable settings if using the browser-key approach.
6. Deploy and test the public URL, including city search and forecast requests.

If the provider's key must be confidential, deploy a backend/serverless API proxy and configure the frontend to call that proxy instead.

## 12. Known limitations
- OpenWeather API access and rate limits depend on the account and subscription. Confirm that the account can access Geocoding, Current Weather and 5 Day / 3 Hour Forecast endpoints.
- The five-day/three-hour forecast contains sampled forecast values, not guaranteed daily extremes.
- A five-date display depends on the date groups available in the API response.
- Geocoding may return multiple cities with the same name. This starter app uses the first result; a production enhancement would let the user select from all matching city/country results.
- Browser environment variables are not secret. Use a backend proxy if the API key must be confidential.

## 13. Attribution and AI assistance
Weather data: OpenWeather (https://openweathermap.org/).

AI assistance was used to help prepare the starter implementation and documentation. The student should review, test, understand and be prepared to explain the code before submission.

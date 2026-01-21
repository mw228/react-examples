import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

type GeoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
};

type GeocodeResponse = {
  results?: GeoResult[];
};

type ForecastResponse = {
  timezone?: string;
  current?: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
  };
};

function weatherLabelFromCode(code: number): string {
  // Open-Meteo WMO weather interpretation codes (common mapping)
  // Keep it short and readable for demos.
  const map: Record<number, string> = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
  };
  return map[code] ?? `Weather code ${code}`;
}

function formatPlace(p: GeoResult) {
  const region = p.admin1 ? `, ${p.admin1}` : "";
  return `${p.name}${region}, ${p.country}`;
}

export default function WeatherDemo() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [selected, setSelected] = useState<GeoResult | null>(null);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [searchError, setSearchError] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const canSearch = query.trim().length >= 2;

  const ariaStatus = useMemo(() => {
    if (loadingSearch) return "Searching locations…";
    if (searchError) return searchError;
    if (!canSearch) return "Type at least 2 characters to search.";
    if (results.length === 0) return "No locations yet.";
    return `${results.length} location${results.length === 1 ? "" : "s"} found.`;
  }, [loadingSearch, searchError, canSearch, results.length]);

  // Debounced search
  useEffect(() => {
    setSearchError(null);
    setResults([]);

    if (!canSearch) return;

    const controller = new AbortController();
    const handle = window.setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const url =
          `https://geocoding-api.open-meteo.com/v1/search?name=` +
          encodeURIComponent(query.trim()) +
          `&count=8&language=en&format=json`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);

        const data = (await res.json()) as GeocodeResponse;
        setResults(data.results ?? []);
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        setSearchError("Could not search locations. Please try again.");
      } finally {
        setLoadingSearch(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(handle);
    };
  }, [query, canSearch]);

  async function loadWeather(p: GeoResult) {
    setSelected(p);
    setForecast(null);
    setWeatherError(null);

    try {
      setLoadingWeather(true);

      // Using Open-Meteo forecast API:
      // - current weather + today min/max + precip probability (if available)
      // Docs: /v1/forecast with latitude/longitude and variables :contentReference[oaicite:4]{index=4}
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}` +
        `&longitude=${p.longitude}` +
        `&current=temperature_2m,wind_speed_10m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=auto`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Forecast failed (${res.status})`);

      const data = (await res.json()) as ForecastResponse;
      setForecast(data);
    } catch {
      setWeatherError("Could not load weather for that location. Please try again.");
    } finally {
      setLoadingWeather(false);
    }
  }

  function onPick(p: GeoResult) {
    void loadWeather(p);
    // keep focus behavior simple: return focus to input for quick follow-ups
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  const today = forecast?.daily
    ? {
        date: forecast.daily.time?.[0],
        max: forecast.daily.temperature_2m_max?.[0],
        min: forecast.daily.temperature_2m_min?.[0],
        precip: forecast.daily.precipitation_probability_max?.[0],
      }
    : null;

  return (
    <div>
      <h2 className="page-title">Weather API Demo</h2>
      <p className="page-subtitle">
        External API integration (Open-Meteo): debounced search, typed responses, and accessible loading/error UX.
      </p>

      <div className="grid grid--cards">
        <Card
          title="Search a location"
          description="Type a city name, pick a result, and load current conditions."
        >
          <label htmlFor="weather-search" className="demo-note">
            City or place name
          </label>

          <div className="demo-row" style={{ alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <input
                id="weather-search"
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Indianapolis"
                className="input"
                autoComplete="off"
                aria-describedby="weather-search-status"
              />
              <div
                id="weather-search-status"
                role="status"
                aria-live="polite"
                className="demo-note"
                style={{ marginTop: 8 }}
              >
                {ariaStatus}
              </div>
            </div>

            <Button
              variant="secondary"
              disabled={!selected}
              onClick={() => {
                setSelected(null);
                setForecast(null);
                setWeatherError(null);
                inputRef.current?.focus();
              }}
            >
              Clear
            </Button>
          </div>

          {results.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div className="demo-note">Results</div>
              <ul className="list" aria-label="Location results">
                {results.map((r) => (
                  <li key={r.id} className="list-item">
                    <button
                      type="button"
                      className="list-button"
                      onClick={() => onPick(r)}
                    >
                      <span>{formatPlace(r)}</span>
                      <span className="list-meta">
                        {r.timezone ? r.timezone : "Timezone: auto"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchError && (
            <div role="alert" className="demo-note" style={{ marginTop: 12 }}>
              {searchError}
            </div>
          )}
        </Card>

        <Card
          title="Current conditions"
          description="Displays current temperature, wind, and a simple condition label."
        >
          {!selected && (
            <div className="demo-note">Search and pick a location to view weather.</div>
          )}

          {selected && (
            <div className="demo-stack">
              <div className="demo-note">
                <strong>{formatPlace(selected)}</strong>
              </div>

              {loadingWeather && (
                <div role="status" aria-live="polite" className="demo-note">
                  Loading weather…
                </div>
              )}

              {weatherError && (
                <div role="alert" className="demo-note">
                  {weatherError}
                </div>
              )}

              {forecast?.current && (
                <div className="demo-stack" style={{ gap: 10 }}>
                  <div className="demo-row" style={{ justifyContent: "space-between" }}>
                    <div className="demo-note">Temperature</div>
                    <div style={{ fontWeight: 700 }}>
                      {Math.round(forecast.current.temperature_2m)}°C
                    </div>
                  </div>

                  <div className="demo-row" style={{ justifyContent: "space-between" }}>
                    <div className="demo-note">Wind</div>
                    <div style={{ fontWeight: 700 }}>
                      {Math.round(forecast.current.wind_speed_10m)} km/h
                    </div>
                  </div>

                  <div className="demo-row" style={{ justifyContent: "space-between" }}>
                    <div className="demo-note">Conditions</div>
                    <div style={{ fontWeight: 700 }}>
                      {weatherLabelFromCode(forecast.current.weather_code)}
                    </div>
                  </div>

                  {today && (
                    <div style={{ marginTop: 6 }}>
                      <div className="demo-note">Today</div>
                      <div className="demo-row" style={{ justifyContent: "space-between" }}>
                        <div className="demo-note">High / Low</div>
                        <div style={{ fontWeight: 700 }}>
                          {Math.round(today.max)}° / {Math.round(today.min)}°C
                        </div>
                      </div>

                      {typeof today.precip === "number" && (
                        <div className="demo-row" style={{ justifyContent: "space-between" }}>
                          <div className="demo-note">Precip probability</div>
                          <div style={{ fontWeight: 700 }}>{today.precip}%</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>

        <Card
          title="What this demonstrates"
          description="A realistic interview-style API integration."
        >
          <ul className="card-desc" style={{ margin: 0, paddingLeft: "1.1rem" }}>
            <li>Debounced search + canceled requests (AbortController)</li>
            <li>Typed responses and defensive parsing</li>
            <li>Loading, empty, and error states</li>
            <li>Accessible status updates (aria-live) and usable list UI</li>
          </ul>
          <div className="card-cta" style={{ marginTop: 12 }}>
            Next: caching, Fahrenheit/Celsius toggle, saved locations, and hourly chart.
          </div>
        </Card>
      </div>
    </div>
  );
}

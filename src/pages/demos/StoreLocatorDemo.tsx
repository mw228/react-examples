import { useEffect, useMemo, useState } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import stateStores from "../../data/stateStores.json";

type Store = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type StateFeature = Feature<Geometry, { name?: string }>;

const FIPS_TO_CODE: Record<string, string> = {
  "01": "AL","02": "AK","04": "AZ","05": "AR","06": "CA","08": "CO","09": "CT","10": "DE",
  "11": "DC","12": "FL","13": "GA","15": "HI","16": "ID","17": "IL","18": "IN","19": "IA",
  "20": "KS","21": "KY","22": "LA","23": "ME","24": "MD","25": "MA","26": "MI","27": "MN",
  "28": "MS","29": "MO","30": "MT","31": "NE","32": "NV","33": "NH","34": "NJ","35": "NM",
  "36": "NY","37": "NC","38": "ND","39": "OH","40": "OK","41": "OR","42": "PA","44": "RI",
  "45": "SC","46": "SD","47": "TN","48": "TX","49": "UT","50": "VT","51": "VA","53": "WA",
  "54": "WV","55": "WI","56": "WY"
};

export default function StoreLocatorDemo() {
  const [states, setStates] = useState<StateFeature[]>([]);
  const [activeState, setActiveState] = useState<string | null>(null);

  const width = 975;
  const height = 600;

  const projection = useMemo(
    () =>
      geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale(1000),
    []
  );

  const pathGenerator = useMemo(
    () => geoPath().projection(projection),
    [projection]
  );

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((res) => res.json())
      .then((topology) => {
        const geojson = feature(
          topology,
          topology.objects.states
        ) as FeatureCollection<Geometry>;

        setStates(geojson.features as StateFeature[]);
      });
  }, []);

  const storeLookup = stateStores as Record<string, Store[]>;
  const activeStores = activeState
    ? storeLookup[activeState] ?? []
    : [];

  return (
    <div>
      <h2 className="page-title">Store Locator (D3 + SVG)</h2>
      <p className="page-subtitle">
        Click a state to view store locations with projected pins.
      </p>

      <div className="store-locator">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="store-locator__map"
        >
          {states.map((state) => {
            const fips = state.id?.toString().padStart(2, "0");
            const code = FIPS_TO_CODE[fips ?? ""];

            return (
              <path
                key={String(state.id)}
                d={pathGenerator(state) ?? ""}
                className={`map-state ${
                  activeState === code ? "is-active" : ""
                }`}
                onClick={() => setActiveState(code)}
              />
            );
          })}

          {activeStores.map((store) => {
            const coords = projection([store.lng, store.lat]);
            if (!coords) return null;

            return (
              <circle
                key={store.id}
                cx={coords[0]}
                cy={coords[1]}
                r={6}
                className="store-pin"
              />
            );
          })}
        </svg>

        <div className="store-locator__panel">
          {activeState ? (
            <>
              <h3>{activeState} Locations</h3>
              {activeStores.length > 0 ? (
                <ul className="store-list">
                  {activeStores.map((store) => (
                    <li key={store.id}>
                      <strong>{store.name}</strong>
                      <div>{store.address}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No stores in this state.</p>
              )}
            </>
          ) : (
            <p>Select a state to view locations.</p>
          )}
        </div>
      </div>
    </div>
  );
}

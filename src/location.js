import React, { useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function Location({ onLocationChange }) {
  const [position, setPosition] = useState([60.876549, -162.460444]);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const provider = new OpenStreetMapProvider();
  const mapRef = useRef(null);

  function LocationMarker() {
    const map = useMap();

    useMapEvents({
      click(e) {
        const newPosition = [e.latlng.lat, e.latlng.lng];
        setPosition(newPosition);
        onLocationChange(newPosition);
      },
    });

    return position === null ? null : <Marker position={position}></Marker>;
  }

  const handleAddressSearch = useCallback(() => {
    provider.search({ query: address }).then((results) => {
      if (results.length > 0) {
        const newPosition = [results[0].y, results[0].x];
        setPosition(newPosition);
        onLocationChange(newPosition);
        if (mapRef.current) {
          mapRef.current.setView(newPosition, 12);
        }
      }
    });
  }, [address, onLocationChange, provider]);

  const handleInputChange = useCallback(
    async (event) => {
      const input = event.target.value;
      setAddress(input);
      if (input.length > 2) {
        const results = await provider.search({ query: input });
        setSuggestions(results.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    },
    [provider]
  );

  return (
    <div>
      <label htmlFor="location">Location:</label>
      <div className="location-input-container">
        <input
          type="text"
          value={address}
          onChange={handleInputChange}
          placeholder="Enter an address"
          list="address-suggestions"
        />
        <datalist id="address-suggestions">
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion.label} />
          ))}
        </datalist>
        <button type="button" onClick={handleAddressSearch}>
          Search
        </button>
      </div>
      <MapContainer
        center={position}
        zoom={12}
        style={{ height: "300px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
      <p>
        Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </p>
    </div>
  );
}

export default Location;

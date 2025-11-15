import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect, useRef, useState } from "react";

export default function AddressPicker({
  onAddressChange,
  restaurant,
  onLocationSelected,
}) {
  const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;
  const GOONG_RS_KEY = process.env.REACT_APP_GOONG_RS_KEY;

  const lngRestaurant = restaurant?.address?.location?.coordinates[0];
  const latRestaurant = restaurant?.address?.location?.coordinates[1];

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [restaurantMarker, setRestaurantMarker] = useState(null);
  const [customerMarker, setCustomerMarker] = useState(null);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [addressFull, setAddressFull] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [droneDistance, setDroneDistance] = useState(null);

  useEffect(() => {
    if (!GOONG_MAP_KEY) {
      console.error("⚠️ Missing REACT_APP_GOONG_MAP_KEY");
      return;
    }

    if (
      !restaurant ||
      !restaurant.address.location ||
      !restaurant.address.location.coordinates
    )
      return;

    goongjs.accessToken = GOONG_MAP_KEY;

    if (!mapContainer.current) return;
    const map = new goongjs.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [lngRestaurant, latRestaurant],
      zoom: 13,
    });
    mapRef.current = map;
    map.addControl(new goongjs.NavigationControl(), "bottom-right");

    const rMarker = new goongjs.Marker({ color: "red" })
      .setLngLat([lngRestaurant, latRestaurant])

      .addTo(map);
    setRestaurantMarker(rMarker);

    return () => {
      try {
        map.remove();
      } catch {}
    };
  }, [restaurant]);

  const calculateDroneDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // bán kính Trái Đất (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
  };

  const drawDroneLine = (customerLat, customerLng) => {
    const map = mapRef.current;
    if (!map) return;

    // Xóa route cũ
    if (map.getLayer("drone-line")) map.removeLayer("drone-line");
    if (map.getSource("drone-line")) map.removeSource("drone-line");

    const lineCoords = [
      [lngRestaurant, latRestaurant],
      [customerLng, customerLat],
    ];

    map.addSource("drone-line", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: lineCoords },
      },
    });
    map.addLayer({
      id: "drone-line",
      type: "line",
      source: "drone-line",
      paint: {
        "line-color": "#00bcd4",
        "line-width": 4,
        "line-dasharray": [2, 2],
      },
    });

    const distance = calculateDroneDistance(
      latRestaurant,
      lngRestaurant,
      customerLat,
      customerLng
    ).toFixed(2);

    setDroneDistance(distance);
  };

  const reverseGeocode = async (latVal, lngVal) => {
    const res = await fetch(
      `https://rsapi.goong.io/Geocode?latlng=${latVal},${lngVal}&api_key=${GOONG_RS_KEY}`
    );
    const data = await res.json();
    if (data.status === "OK") {
      const r = data.results[0];
      setAddressFull(r.formatted_address);
      setLat(latVal);
      setLng(lngVal);
      onAddressChange?.({
        full: r.formatted_address,
        lat: latVal,
        lng: lngVal,
      });
    }
  };

  const placeCustomerMarker = async (lngVal, latVal) => {
    const map = mapRef.current;
    if (customerMarker) customerMarker.remove();

    const newMarker = new goongjs.Marker({ color: "blue", draggable: true })
      .setLngLat([lngVal, latVal])
      .addTo(map);

    const distance = calculateDroneDistance(
      latRestaurant,
      lngRestaurant,
      latVal,
      lngVal
    ).toFixed(2); // trả về string, convert sang number

    newMarker.on("dragend", async () => {
      const { lng, lat } = newMarker.getLngLat();
      await reverseGeocode(lat, lng);
      drawDroneLine(lat, lng);
      if (onLocationSelected) {
        onLocationSelected({
          street: addressFull || "Địa chỉ tạm",
          location: { type: "Point", coordinates: [lng, lat] },
          distance: Number(distance),
        });
      }
    });

    setCustomerMarker(newMarker);
    map.flyTo({ center: [lngVal, latVal], zoom: 15 });
    drawDroneLine(latVal, lngVal);

    if (onLocationSelected) {
      onLocationSelected({
        street: addressFull || "Địa chỉ tạm",
        location: { type: "Point", coordinates: [lngVal, latVal] },
        distance: Number(distance),
      });
    }
  };

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        placeCustomerMarker(longitude, latitude);
        await reverseGeocode(latitude, longitude);
      },
      (err) => {
        alert("Không lấy được vị trí");
        console.error(err);
      }
    );
  };

  // ================= AUTOCOMPLETE =================
  const handleInputChange = async (val) => {
    setSearch(val);
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_RS_KEY}&input=${encodeURIComponent(
        val
      )}`
    );
    const data = await res.json();
    setSuggestions(data.predictions || []);
  };

  const handleSelectSuggestion = async (place_id, description) => {
    setSearch(description);
    setSuggestions([]);
    const res = await fetch(
      `https://rsapi.goong.io/Place/Detail?place_id=${place_id}&api_key=${GOONG_RS_KEY}`
    );
    const data = await res.json();
    const result = data.result;
    const { lat: rlat, lng: rlng } = result.geometry.location;
    setAddressFull(result.formatted_address);
    placeCustomerMarker(rlng, rlat);
    reverseGeocode(rlat, rlng);
  };

  return (
    <div className="space-y-3 text-black">
      {droneDistance && (
        <p className="text-sm font-medium text-green-600 mb-4">
          Khoảng cách đường chim bay: {droneDistance} km
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className={`px-3 py-2 rounded-lg border ${
            useCurrentLocation
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Dùng vị trí hiện tại
        </button>
        <button
          type="button"
          onClick={() => setUseCurrentLocation(false)}
          className={`px-3 py-2 rounded-lg border ${
            !useCurrentLocation
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Nhập địa chỉ
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Nhập địa chỉ..."
        className="w-full p-2 border rounded-lg"
      />
      {suggestions.length > 0 && (
        <div className="border rounded bg-white shadow-sm max-h-40 overflow-auto">
          {suggestions.map((s) => (
            <div
              key={s.place_id}
              onClick={() => handleSelectSuggestion(s.place_id, s.description)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {s.description}
            </div>
          ))}
        </div>
      )}

      <div
        ref={mapContainer}
        className="goong-map-container h-64 rounded-xl shadow-inner"
      />

      <input
        value={addressFull}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-50"
        placeholder="Địa chỉ đầy đủ"
      />
    </div>
  );
}

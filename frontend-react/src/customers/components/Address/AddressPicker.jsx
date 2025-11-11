import { useEffect, useRef, useState } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";

const RESTAURANT = {
  name: "Nhà hàng mẫu - Linh Food",
  lat: 10.762622,
  lng: 106.660172,
  address: "227 Nguyễn Văn Cừ, P.4, Q.5, TP.HCM",
};

export default function AddressPicker({ onAddressChange }) {
  const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;
  const GOONG_RS_KEY = process.env.REACT_APP_GOONG_RS_KEY;

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [restaurantMarker, setRestaurantMarker] = useState(null);
  const [customerMarker, setCustomerMarker] = useState(null);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [addressFull, setAddressFull] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  // ================= MAP INIT =================
  useEffect(() => {
    if (!GOONG_MAP_KEY) {
      console.error("⚠️ Missing REACT_APP_GOONG_MAP_KEY");
      return;
    }

    goongjs.accessToken = GOONG_MAP_KEY;
    const map = new goongjs.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [RESTAURANT.lng, RESTAURANT.lat],
      zoom: 13,
    });
    mapRef.current = map;
    map.addControl(new goongjs.NavigationControl(), "bottom-right");

    const rMarker = new goongjs.Marker({ color: "red" })
      .setLngLat([RESTAURANT.lng, RESTAURANT.lat])
      .setPopup(
        new goongjs.Popup().setHTML(
          `<b>${RESTAURANT.name}</b><br/>${RESTAURANT.address}`
        )
      )
      .addTo(map);
    setRestaurantMarker(rMarker);

    return () => {
      try {
        map.remove();
      } catch {}
    };
  }, []);

  // ================= HELPER =================
  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;
    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;
      points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
  };

  const drawRoute = async (customerLat, customerLng) => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const origin = `${RESTAURANT.lat},${RESTAURANT.lng}`;
    const destination = `${customerLat},${customerLng}`;
    const url = `https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&vehicle=car&api_key=${GOONG_RS_KEY}`;

    const res = await fetch(url);
    const data = await res.json();
    const validRoute = data.routes?.[0];
    if (!validRoute) return;

    const leg = validRoute.legs[0];
    setRouteInfo({
      distance: leg.distance?.text,
      duration: leg.duration?.text,
    });

    const decoded = decodePolyline(validRoute.overview_polyline.points);
    const coords = decoded.map(([la, ln]) => [ln, la]);

    if (map.getLayer("route")) map.removeLayer("route");
    if (map.getSource("route")) map.removeSource("route");

    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
      },
    });
    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      paint: { "line-color": "#2563eb", "line-width": 5 },
    });
  };

  const reverseGeocode = async (latVal, lngVal) => {
    const res = await fetch(
      `https://rsapi.goong.io/Geocode?latlng=${latVal},${lngVal}&api_key=${GOONG_RS_KEY}`
    );
    const data = await res.json();
    if (data.status === "OK") {
      const r = data.results[0];
      setAddressFull(r.formatted_address);
      const c = r.compound || {};
      setProvince(c.province || "");
      setDistrict(c.district || "");
      setWard(c.commune || c.ward || "");
      setLat(latVal);
      setLng(lngVal);
      onAddressChange?.({
        full: r.formatted_address,
        province: c.province,
        district: c.district,
        ward: c.commune || c.ward,
        lat: latVal,
        lng: lngVal,
      });
    }
  };

  const placeCustomerMarker = (lngVal, latVal, openPopup = false) => {
    const map = mapRef.current;
    if (customerMarker) customerMarker.remove();

    const newMarker = new goongjs.Marker({ color: "blue", draggable: true })
      .setLngLat([lngVal, latVal])
      .addTo(map);

    newMarker.on("dragend", async () => {
      const { lng, lat } = newMarker.getLngLat();
      await reverseGeocode(lat, lng);
      drawRoute(lat, lng);
    });

    setCustomerMarker(newMarker);
    map.flyTo({ center: [lngVal, latVal], zoom: 16 });
    if (openPopup) newMarker.togglePopup();
  };

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        placeCustomerMarker(longitude, latitude, true);
        await reverseGeocode(latitude, longitude);
        drawRoute(latitude, longitude);
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
    placeCustomerMarker(rlng, rlat, true);
    drawRoute(rlat, rlng);
    reverseGeocode(rlat, rlng);
  };

  return (
    <div className="space-y-3 text-black">
      {routeInfo && (
        <p className="text-sm font-medium text-green-600 mb-4">
          {" "}
          {routeInfo.duration || ""} (cách {routeInfo.distance || ""}){" "}
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

      <div ref={mapContainer} className="h-64 rounded-xl shadow-inner" />

      <input
        value={addressFull}
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-50"
        placeholder="Địa chỉ đầy đủ"
      />
      <div className="grid grid-cols-2 gap-2">
        <input value={ward} readOnly className="p-2 border rounded-lg" />
        <input value={district} readOnly className="p-2 border rounded-lg" />
      </div>
      <input
        value={province}
        readOnly
        className="w-full p-2 border rounded-lg"
      />
      <div className="grid grid-cols-2 gap-2">
        <input value={lat} readOnly className="p-2 border rounded-lg" />
        <input value={lng} readOnly className="p-2 border rounded-lg" />
      </div>
    </div>
  );
}

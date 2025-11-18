import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect, useRef, useState } from "react";

export default function OrderRouteMap({
  restaurant,
  deliveryLat,
  deliveryLng,
  status = null,
  onDroneArrived,
}) {
  const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;

  const latRestaurant =
    restaurant?.address?.latitude ??
    restaurant?.address?.location?.coordinates?.[1] ??
    null;

  const lngRestaurant =
    restaurant?.address?.longitude ??
    restaurant?.address?.location?.coordinates?.[0] ??
    null;

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [distanceKm, setDistanceKm] = useState(null);

  const animationRef = useRef(null);
  const hasAnimatedRef = useRef(false); // ✅ đã animate drone chưa

  const calculateDroneDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
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

  const drawDroneLine = (map, customerLat, customerLng) => {
    if (!map) return;
    if (lngRestaurant == null || latRestaurant == null) return;

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

    const bounds = new goongjs.LngLatBounds();
    lineCoords.forEach((c) => bounds.extend(c));
    map.fitBounds(bounds, { padding: 40 });

    const dist = calculateDroneDistance(
      latRestaurant,
      lngRestaurant,
      customerLat,
      customerLng
    ).toFixed(2);

    setDistanceKm(dist);
  };

  // 1. Khởi tạo map
  useEffect(() => {
    if (!GOONG_MAP_KEY) {
      console.error("⚠️ Missing REACT_APP_GOONG_MAP_KEY");
      return;
    }
    if (lngRestaurant == null || latRestaurant == null) {
      console.warn("Chưa có toạ độ nhà hàng", restaurant);
      return;
    }
    if (!mapContainer.current) return;

    goongjs.accessToken = GOONG_MAP_KEY;

    const map = new goongjs.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [lngRestaurant, latRestaurant],
      zoom: 13,
    });

    map.addControl(new goongjs.NavigationControl(), "bottom-right");

    map.on("load", () => {
      setMapLoaded(true);

      new goongjs.Marker({ color: "red" })
        .setLngLat([lngRestaurant, latRestaurant])
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      try {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        map.remove();
      } catch (e) {
        // ignore
      }
    };
  }, [GOONG_MAP_KEY, lngRestaurant, latRestaurant, restaurant]);

  // 2. Marker khách + line
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!mapLoaded) return;
    if (deliveryLat == null || deliveryLng == null) return;

    new goongjs.Marker({ color: "blue" })
      .setLngLat([deliveryLng, deliveryLat])
      .addTo(map);

    drawDroneLine(map, deliveryLat, deliveryLng);
  }, [mapLoaded, deliveryLat, deliveryLng]);

  // 3. Animate drone – chỉ chạy 1 lần khi OUT_FOR_DELIVERY
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!mapLoaded) return;
    if (status !== "OUT_FOR_DELIVERY") return;

    if (
      latRestaurant == null ||
      lngRestaurant == null ||
      deliveryLat == null ||
      deliveryLng == null
    )
      return;

    // Nếu đã animate thì thôi, không bay lại nữa
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true; // ✅ đánh dấu đã chạy

    const droneMarker = new goongjs.Marker({ color: "orange" })
      .setLngLat([lngRestaurant, latRestaurant])
      .addTo(map);

    const duration = 10000; // 10 giây
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      const currentLng =
        lngRestaurant + (deliveryLng - lngRestaurant) * t;
      const currentLat =
        latRestaurant + (deliveryLat - latRestaurant) * t;

      droneMarker.setLngLat([currentLng, currentLat]);

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onDroneArrived) {
          onDroneArrived();
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      try {
        droneMarker.remove();
      } catch (e) {}
    };
  }, [
    mapLoaded,
    status,
    latRestaurant,
    lngRestaurant,
    deliveryLat,
    deliveryLng,
  ]); // không cần onDroneArrived trong deps, để tránh re-run vì callback đổi

  return (
    <div className="space-y-3 text-black">
      {distanceKm && (
        <p className="text-sm font-medium text-green-600 mb-2">
          Khoảng cách đường chim bay: {distanceKm} km
        </p>
      )}

      <div
        ref={mapContainer}
        className="goong-map-container h-64 rounded-xl shadow-inner"
      />
    </div>
  );
}

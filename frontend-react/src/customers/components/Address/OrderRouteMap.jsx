import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { api } from "../../../config/api"; // điều chỉnh đường dẫn nếu cần

export default function OrderRouteMap({
  restaurant,
  deliveryLat,
  deliveryLng,
  status = null,
  orderId = null,
  onDroneArrived,
}) {
  const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;
  const { jwt } = useSelector((state) => state.auth || {});

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
  const hasAnimatedRef = useRef(false);
  const deliveredCalledRef = useRef(false); // đã gọi update -> DELIVERED chưa
  const droneMarkerRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const restaurantMarkerRef = useRef(null);
  const [arrived, setArrived] = useState(false); // show button when true
  const [loading, setLoading] = useState(false);

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

    try {
      if (map.getLayer("drone-line")) map.removeLayer("drone-line");
      if (map.getSource("drone-line")) map.removeSource("drone-line");
    } catch (e) {}

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
        "line-color": "#f59e0b",
        "line-width": 3,
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

  // CALL API to set DELIVERED (automatic on arrival)
  const callMarkDelivered = async (id) => {
    if (!id) {
      console.warn("[OrderRouteMap] callMarkDelivered skipped — missing orderId");
      return null;
    }
    if (deliveredCalledRef.current) return null; // guard
    deliveredCalledRef.current = true;

    const payload = { status: "DELIVERED" };
    const token = jwt || localStorage.getItem("jwt") || null;

    try {
      const res = await api.put(`/order/${id}/status`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("[OrderRouteMap] auto-update DELIVERED success", res.status);
      return res.data;
    } catch (err) {
      console.error("[OrderRouteMap] auto-update DELIVERED failed", err?.response?.status ?? err?.message);
      // retry with explicit axios if 401/403 and token exists
      if ((err?.response?.status === 401 || err?.response?.status === 403) && token) {
        try {
          const absoluteUrl = api?.defaults?.baseURL
            ? `${api.defaults.baseURL.replace(/\/$/, "")}/order/${id}/status`
            : `/order/${id}/status`;
          const r2 = await axios.put(absoluteUrl, payload, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          console.log("[OrderRouteMap] auto-update retry success", r2.status);
          return r2.data;
        } catch (err2) {
          console.error("[OrderRouteMap] auto-update retry failed", err2);
        }
      }
      return null;
    }
  };

  // CALL API to set RECEIVED (user click)
  const updateOrderStatusReceived = async () => {
    const id = orderId;
    if (!id) {
      console.warn("[OrderRouteMap] update RECEIVED skipped — missing orderId");
      return null;
    }

    setLoading(true);
    const payload = { status: "RECEIVED" };
    const token = jwt || localStorage.getItem("jwt") || null;

    try {
      const res = await api.put(`/order/${id}/status`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("[OrderRouteMap] update RECEIVED success", res.status);
      setArrived(false);
      if (typeof onDroneArrived === "function") {
        try { onDroneArrived(res.data); } catch (e) {}
      }
      return res.data;
    } catch (err) {
      console.error("[OrderRouteMap] update RECEIVED failed", err?.response?.status ?? err?.message);

      if ((err?.response?.status === 401 || err?.response?.status === 403) && token) {
        try {
          const absoluteUrl = api?.defaults?.baseURL
            ? `${api.defaults.baseURL.replace(/\/$/, "")}/order/${id}/status`
            : `/order/${id}/status`;
          const r2 = await axios.put(absoluteUrl, payload, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          console.log("[OrderRouteMap] retry RECEIVED success", r2.status);
          setArrived(false);
          if (typeof onDroneArrived === "function") {
            try { onDroneArrived(r2.data); } catch (e) {}
          }
          return r2.data;
        } catch (err2) {
          console.error("[OrderRouteMap] retry RECEIVED failed", err2);
        }
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------- map init ----------
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

      if (restaurantMarkerRef.current) {
        try {
          restaurantMarkerRef.current.remove();
        } catch (e) {}
      }
      restaurantMarkerRef.current = new goongjs.Marker({ color: "red" })
        .setLngLat([lngRestaurant, latRestaurant])
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      try {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (droneMarkerRef.current) {
          try { droneMarkerRef.current.remove(); } catch (_) {}
        }
        if (customerMarkerRef.current) {
          try { customerMarkerRef.current.remove(); } catch (_) {}
        }
        if (restaurantMarkerRef.current) {
          try { restaurantMarkerRef.current.remove(); } catch (_) {}
        }
        map.remove();
      } catch (e) {
        // ignore
      }
    };
  }, [GOONG_MAP_KEY, lngRestaurant, latRestaurant, restaurant]);

  // ---------- customer marker + line ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!mapLoaded) return;
    if (deliveryLat == null || deliveryLng == null) return;

    if (customerMarkerRef.current) {
      try {
        customerMarkerRef.current.remove();
      } catch (e) {}
    }

    customerMarkerRef.current = new goongjs.Marker({ color: "blue" })
      .setLngLat([deliveryLng, deliveryLat])
      .addTo(map);

    drawDroneLine(map, deliveryLat, deliveryLng);
  }, [mapLoaded, deliveryLat, deliveryLng]);

  // ---------- animate; auto-mark DELIVERED on arrival; show button for RECEIVED ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!mapLoaded) return;
    if (status !== "DELIVERING") return;

    if (
      latRestaurant == null ||
      lngRestaurant == null ||
      deliveryLat == null ||
      deliveryLng == null
    )
      return;

    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // tạo dot vàng đơn giản làm drone (div marker)
    const el = document.createElement("div");
    el.style.width = "14px";
    el.style.height = "14px";
    el.style.borderRadius = "50%";
    el.style.background = "#fbbf24";
    el.style.boxShadow = "0 0 6px rgba(0,0,0,0.2)";
    el.style.border = "2px solid rgba(255,255,255,0.8)";

    const droneMarker = new goongjs.Marker({ element: el })
      .setLngLat([lngRestaurant, latRestaurant])
      .addTo(map);

    droneMarkerRef.current = droneMarker;

    const distKm = calculateDroneDistance(
      latRestaurant,
      lngRestaurant,
      deliveryLat,
      deliveryLng
    );

    // FASTER: ~4s per km, clamp min 3000ms, max 20000ms
    const durationPerKm = 4000;
    let duration = Math.max(3000, Math.min(20000, Math.round(distKm * durationPerKm)));
    if (!isFinite(duration) || duration <= 0) duration = 4000;

    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      const currentLng = lngRestaurant + (deliveryLng - lngRestaurant) * t;
      const currentLat = latRestaurant + (deliveryLat - latRestaurant) * t;

      droneMarker.setLngLat([currentLng, currentLat]);

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // animation hoàn tất: tự mark DELIVERED (best-effort)
        (async () => {
          // try mark delivered even if orderId missing (will log)
          await callMarkDelivered(orderId).catch((e) => {
            console.error("[OrderRouteMap] callMarkDelivered error", e);
          });

          // sau đó show nút để user bấm RECEIVED
          setArrived(true);

          // thông báo parent (animation done)
          if (typeof onDroneArrived === "function") {
            try { onDroneArrived(); } catch (e) {}
          }

          // remove marker sau 1s (vẫn giữ nút)
          setTimeout(() => {
            try {
              droneMarker.remove();
              droneMarkerRef.current = null;
            } catch (e) {}
          }, 1000);
        })();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      try { droneMarker.remove(); } catch (e) {}
      droneMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapLoaded,
    status,
    latRestaurant,
    lngRestaurant,
    deliveryLat,
    deliveryLng,
    orderId,
    onDroneArrived,
  ]);

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

      {arrived && (
        <div className="mt-3">
          <button
            onClick={async () => {
              await updateOrderStatusReceived();
            }}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white text-sm disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đã nhận được hàng"}
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:5454/api/admin/dispatch";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ điều phối" },
  { value: "ASSIGNED", label: "Đã gán drone" },
  { value: "CONFIRMED", label: "Nhà hàng xác nhận" },
  { value: "FINISHED", label: "Nhà hàng đã chuẩn bị món" },
  { value: "DELIVERING", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã tới vị trí giao" },
  { value: "RECEIVED", label: "Khách đã nhận" },
  { value: "ALL", label: "Tất cả" },
];

const AdminDispatchPage = () => {
  const { jwt } = useSelector((state) => state.auth) || {};

  // ===== STATE =====
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("PENDING");

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState("");

  // drones available cho việc gán
  const [drones, setDrones] = useState([]);
  const [loadingDrones, setLoadingDrones] = useState(false);

  // modal gán drone
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDroneId, setSelectedDroneId] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // modal chi tiết
  const [detailOrder, setDetailOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [startingFlight, setStartingFlight] = useState(false);

  // ===== HELPERS =====
  const authHeaders = jwt
    ? {
        Authorization: `Bearer ${jwt}`,
      }
    : {};

  const statusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#fbbf24"; // vàng
      case "ASSIGNED":
        return "#3b82f6"; // xanh dương
      case "CONFIRMED":
        return "#6366f1"; // indigo
      case "FINISHED":
        return "#22c55e"; // xanh lá
      case "DELIVERING":
        return "#10b981"; // xanh teal
      case "DELIVERED":
        return "#0ea5e9"; // cyan
      case "RECEIVED":
        return "#6b7280"; // xám
      default:
        return "#6b7280";
    }
  };

  const formatCurrency = (v) =>
    ((v || 0).toLocaleString("vi-VN") || "0") + " ₫";

  const formatDateTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN");
  };

  // ===== API CALLS =====

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setErrorOrders("");

      const params = new URLSearchParams();
      params.set("status", orderStatusFilter);
      if (orderSearch.trim()) {
        params.set("search", orderSearch.trim());
      }

      const res = await fetch(`${API_BASE}/orders?${params.toString()}`, {
        headers: {
          ...authHeaders,
        },
      });

      if (!res.ok) {
        throw new Error("Không load được danh sách đơn hàng");
      }

      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setErrorOrders(err.message || "Có lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAvailableDrones = async () => {
    try {
      setLoadingDrones(true);
      const res = await fetch(`${API_BASE}/available-drones`, {
        headers: {
          ...authHeaders,
        },
      });

      if (!res.ok) {
        throw new Error("Không load được danh sách drone khả dụng");
      }

      const data = await res.json();
      setDrones(data || []);
    } catch (err) {
      console.error(err);
      setDrones([]);
    } finally {
      setLoadingDrones(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    try {
      setLoadingDetail(true);
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        headers: {
          ...authHeaders,
        },
      });

      if (!res.ok) {
        throw new Error("Không load được chi tiết đơn");
      }

      const data = await res.json();
      setDetailOrder(data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi tải chi tiết đơn");
    } finally {
      setLoadingDetail(false);
    }
  };

  // ===== EFFECTS =====

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderStatusFilter]);

  // ===== DERIVED =====

  const filteredOrders = useMemo(() => {
    const kw = orderSearch.trim().toLowerCase();
    if (!kw) return orders;

    return orders.filter((o) => {
      const idStr = o.id?.toString() || "";
      const cName = o.customerName?.toLowerCase() || "";
      const rName = o.restaurantName?.toLowerCase() || "";
      return (
        idStr.includes(kw) || cName.includes(kw) || rName.includes(kw)
      );
    });
  }, [orders, orderSearch]);

  // ===== HANDLERS – GÁN DRONE =====

  const openAssignModal = async (order) => {
    setSelectedOrder(order);
    setSelectedDroneId(null);
    await fetchAvailableDrones();
  };

  const closeAssignModal = () => {
    setSelectedOrder(null);
    setSelectedDroneId(null);
  };

  const handleAssignDrone = async () => {
    if (!selectedOrder || !selectedDroneId) return;
    setAssigning(true);

    try {
      const res = await fetch(
        `${API_BASE}/orders/${selectedOrder.id}/assign?droneId=${selectedDroneId}`,
        {
          method: "POST",
          headers: {
            ...authHeaders,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Gán drone thất bại");
      }

      const updatedDetail = await res.json();

      // Cập nhật danh sách đơn
      setOrders((prev) =>
        prev.map((o) =>
          o.id === updatedDetail.id
            ? {
                ...o,
                orderStatus: updatedDetail.orderStatus,
                droneId: updatedDetail.droneId,
                droneStatus: updatedDetail.droneStatus,
              }
            : o
        )
      );

      // Nếu đang mở chi tiết cùng đơn này thì update luôn
      setDetailOrder((prev) =>
        prev && prev.id === updatedDetail.id ? updatedDetail : prev
      );

      closeAssignModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi gán drone");
    } finally {
      setAssigning(false);
    }
  };

  // ===== HANDLERS – CHI TIẾT ĐƠN & BẮT ĐẦU BAY =====

  const openOrderDetail = (orderId) => {
    setDetailOrder(null);
    fetchOrderDetail(orderId);
  };

  const closeDetailModal = () => {
    setDetailOrder(null);
  };

  const handleStartFlight = async () => {
    if (!detailOrder) return;
    setStartingFlight(true);
    try {
      const res = await fetch(
        `${API_BASE}/orders/${detailOrder.id}/start-flight`,
        {
          method: "POST",
          headers: {
            ...authHeaders,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Bắt đầu bay thất bại");
      }

      const updated = await res.json();
      setDetailOrder(updated);

      // cập nhật danh sách
      setOrders((prev) =>
        prev.map((o) =>
          o.id === updated.id
            ? {
                ...o,
                orderStatus: updated.orderStatus,
                droneId: updated.droneId,
                droneStatus: updated.droneStatus,
              }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi bắt đầu bay");
    } finally {
      setStartingFlight(false);
    }
  };

  // ===== RENDER =====

  return (
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Điều phối đơn hàng
        </h1>
        <p className="text-sm text-gray-500">
          Xem danh sách đơn, lọc theo trạng thái, gán drone và điều khiển bắt
          đầu bay (khi nhà hàng đã chuẩn bị món).
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Tìm theo mã đơn / khách / nhà hàng..."
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
        />

        <select
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={fetchOrders}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
        >
          Reload
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border text-gray-900">
        {loadingOrders && (
          <p className="text-sm text-gray-500 mb-2">
            Đang tải danh sách đơn...
          </p>
        )}
        {errorOrders && (
          <p className="text-sm text-red-500 mb-2">{errorOrders}</p>
        )}

        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-gray-500 uppercase">
              <th className="text-left py-2">ID</th>
              <th className="text-left">Khách hàng</th>
              <th className="text-left">Nhà hàng</th>
              <th className="text-left">Tổng tiền</th>
              <th className="text-left">Trạng thái</th>
              <th className="text-left">Thời gian</th>
              <th className="text-left">Drone</th>
              <th className="text-right">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="py-2">#{o.id}</td>
                <td>{o.customerName || "—"}</td>
                <td>{o.restaurantName || "—"}</td>
                <td className="font-semibold">
                  {formatCurrency(o.totalPrice)}
                </td>

                <td>
                  <span
                    className="px-2 py-1 rounded-full text-white text-xs"
                    style={{ background: statusColor(o.orderStatus) }}
                  >
                    {o.orderStatus}
                  </span>
                </td>

                <td>{formatDateTime(o.createdAt)}</td>

                <td>
                  {o.droneId ? (
                    <span>
                      Drone #{o.droneId}
                      {o.droneStatus ? ` (${o.droneStatus})` : ""}
                    </span>
                  ) : (
                    <span>Chưa gán</span>
                  )}
                </td>

                <td className="text-right space-x-2">
                  <button
                    onClick={() => openOrderDetail(o.id)}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-xs hover:bg-gray-50"
                  >
                    Chi tiết
                  </button>

                  <button
                    onClick={() => openAssignModal(o)}
                    disabled={o.orderStatus !== "PENDING"}
                    className="px-3 py-1 border border-emerald-500 text-emerald-600 rounded-lg text-xs hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Gán drone
                  </button>
                </td>
              </tr>
            ))}

            {!loadingOrders && filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-4 text-center text-gray-500 text-sm"
                >
                  Không có đơn hàng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal gán drone */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full text-gray-900">
            <h2 className="text-lg font-semibold mb-4">
              Gán drone cho đơn #{selectedOrder.id}
            </h2>

            {loadingDrones ? (
              <p className="text-sm text-gray-500 mb-3">
                Đang tải danh sách drone khả dụng...
              </p>
            ) : drones.length === 0 ? (
              <p className="text-sm text-gray-500 mb-3">
                Hiện không có drone nào sẵn sàng để gán.
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
                {drones.map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center gap-3 p-3 cursor-pointer text-sm hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      checked={selectedDroneId === d.id}
                      onChange={() => setSelectedDroneId(d.id)}
                    />
                    <div>
                      <div className="font-semibold">
                        Drone #{d.id} – {d.serialNumber || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Pin: {d.battery ?? "N/A"}% • Trạng thái:{" "}
                        {d.status || "N/A"} • Tải trọng:{" "}
                        {d.payloadCapacityKg ?? "?"}kg • Hub:{" "}
                        {d.hubName || "—"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeAssignModal}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignDrone}
                disabled={!selectedDroneId || assigning}
                className="px-4 py-1 bg-emerald-600 text-white rounded-lg text-sm disabled:bg-gray-400"
              >
                {assigning ? "Đang gán..." : "Xác nhận gán"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết đơn */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full text-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                Chi tiết đơn #{detailOrder.id}
              </h2>
              <button
                onClick={closeDetailModal}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Đóng
              </button>
            </div>

            {loadingDetail ? (
              <p className="text-sm text-gray-500">Đang tải chi tiết...</p>
            ) : (
              <>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 rounded-full text-white text-xs"
                      style={{
                        background: statusColor(detailOrder.orderStatus),
                      }}
                    >
                      {detailOrder.orderStatus}
                    </span>
                    {detailOrder.droneId && (
                      <span className="text-xs text-gray-500">
                        Drone #{detailOrder.droneId} –
                        {detailOrder.droneStatus
                          ? ` ${detailOrder.droneStatus}`
                          : ""}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Khách hàng
                      </p>
                      <p>{detailOrder.customerName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Nhà hàng
                      </p>
                      <p>{detailOrder.restaurantName || "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Tổng tiền
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(detailOrder.totalPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Số lượng món
                      </p>
                      <p>{detailOrder.totalItem ?? "—"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Địa chỉ giao
                    </p>
                    <p>{detailOrder.deliveryAddressText || "—"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Thời gian tạo
                    </p>
                    <p>{formatDateTime(detailOrder.createdAt)}</p>
                  </div>

                  {detailOrder.droneSerial && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Drone được gán
                      </p>
                      <p>
                        #{detailOrder.droneId} – {detailOrder.droneSerial}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={closeDetailModal}
                    className="px-3 py-1 border rounded-lg text-sm"
                  >
                    Đóng
                  </button>

                  {/* Nút Bắt đầu bay: chỉ khi FINISHED và đã có drone */}
                  {detailOrder.orderStatus === "FINISHED" &&
                    detailOrder.droneId && (
                      <button
                        onClick={handleStartFlight}
                        disabled={startingFlight}
                        className="px-4 py-1 bg-emerald-600 text-white rounded-lg text-sm disabled:bg-gray-400"
                      >
                        {startingFlight
                          ? "Đang cập nhật..."
                          : "Bắt đầu bay"}
                      </button>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDispatchPage;

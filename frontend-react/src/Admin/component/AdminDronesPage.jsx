import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";


const API_BASE = "http://localhost:5454/api/admin/drones";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "AVAILABLE", label: "Sẵn sàng" },
  { value: "OUT_FOR_DELIVERY", label: "Đang giao hàng" },
  { value: "CHARGING", label: "Đang sạc" },
  { value: "IN_MAINTENANCE", label: "Đang bảo trì" },
  { value: "EMERGENCY_LANDING", label: "Hạ cánh khẩn cấp" },
  { value: "UNAVAILABLE", label: "Không sử dụng" },
];

const AdminDronesPage = () => {
  const { jwt } = useSelector((state) => state.auth) || {};

  const [drones, setDrones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    // ===== CREATE DRONE =====
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    battery: "",
    status: "AVAILABLE",
    payloadCapacityKg: "",
    serialNumber: "",
    telemetryId: "",
    hubId: "",
  });
  const [creating, setCreating] = useState(false);


  // modal chi tiết / sửa
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  // modal đổi trạng thái
  const [statusDrone, setStatusDrone] = useState(null);
  const [newStatus, setNewStatus] = useState("AVAILABLE");
  const [savingStatus, setSavingStatus] = useState(false);

  // ===== CALL API =====
  const fetchDrones = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!res.ok) {
        throw new Error("Không tải được danh sách drone");
      }
      const data = await res.json();
      setDrones(data);
    } catch (e) {
      console.error(e);
      setError(e.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();
  }, []);

  // ===== FILTER FE =====
  const filteredDrones = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return drones.filter((d) => {
      const matchStatus = statusFilter === "all" || d.status === statusFilter;

      const hubText = (d.hubAddress || "").toLowerCase();

      const matchKeyword =
        !keyword ||
        (d.serialNumber && d.serialNumber.toLowerCase().includes(keyword)) ||
        (d.telemetryId && d.telemetryId.toLowerCase().includes(keyword)) ||
        hubText.includes(keyword);

      return matchStatus && matchKeyword;
    });
  }, [drones, searchTerm, statusFilter]);

  // ===== UTILS =====
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-100 text-emerald-700";
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-700";
      case "CHARGING":
        return "bg-amber-100 text-amber-700";
      case "IN_MAINTENANCE":
        return "bg-indigo-100 text-indigo-700";
      case "EMERGENCY_LANDING":
        return "bg-red-100 text-red-700";
      case "UNAVAILABLE":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const batteryColor = (battery) => {
    if (battery == null) return "bg-gray-200";
    if (battery >= 70) return "bg-emerald-500";
    if (battery >= 40) return "bg-amber-400";
    if (battery >= 20) return "bg-orange-400";
    return "bg-red-500";
  };

  const formatLocation = (d) => {
    if (d.latitude == null || d.longitude == null) return "N/A";
    return `${d.latitude.toFixed(5)}, ${d.longitude.toFixed(5)}`;
  };

  const formatOrder = (d) => {
    return d.orderId ? `#${d.orderId}` : "Không có";
  };

  // ===== HANDLERS: chi tiết =====
  const handleViewDetails = (drone) => {
    setSelectedDrone(drone);
    setEditForm({
      battery: drone.battery ?? "",
      payloadCapacityKg: drone.payloadCapacityKg ?? "",
      serialNumber: drone.serialNumber ?? "",
      telemetryId: drone.telemetryId ?? "",
    });
  };

  const handleCloseDetails = () => {
    setSelectedDrone(null);
    setEditForm(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveDetails = async () => {
    if (!selectedDrone) return;
    setSaving(true);
    try {
      const body = {
        ...selectedDrone,
        battery:
          editForm.battery === "" ? null : Number.parseInt(editForm.battery),
        payloadCapacityKg:
          editForm.payloadCapacityKg === ""
            ? null
            : Number.parseFloat(editForm.payloadCapacityKg),
        serialNumber: editForm.serialNumber || null,
        telemetryId: editForm.telemetryId || null,
      };

      const res = await fetch(`${API_BASE}/${selectedDrone.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Cập nhật drone thất bại");
      }

      const updated = await res.json();

      // cập nhật vào list
      setDrones((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );

      setSelectedDrone(updated);
    } catch (e) {
      console.error(e);
      alert(e.message || "Có lỗi khi lưu thông tin drone");
    } finally {
      setSaving(false);
    }
  };

  // ===== HANDLERS: đổi trạng thái =====
  const handleOpenStatusModal = (drone) => {
    setStatusDrone(drone);
    setNewStatus(drone.status || "AVAILABLE");
  };

  const handleCloseStatusModal = () => {
    setStatusDrone(null);
  };

  const handleSaveStatus = async () => {
    if (!statusDrone) return;
    setSavingStatus(true);
    try {
      const res = await fetch(
        `${API_BASE}/${statusDrone.id}/status?status=${newStatus}`,
        {
          method: "PATCH",
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : undefined,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Cập nhật trạng thái thất bại");
      }

      const updated = await res.json();
      setDrones((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
      setStatusDrone(null);
    } catch (e) {
      console.error(e);
      alert(e.message || "Có lỗi khi cập nhật trạng thái");
    } finally {
      setSavingStatus(false);
    }
  };


  //HANDLER thêm Drone
    const openCreateModal = () => {
    setShowCreate(true);
    setCreateForm({
      battery: "",
      status: "AVAILABLE",
      payloadCapacityKg: "",
      serialNumber: "",
      telemetryId: "",
      hubId: "",
    });
  };

  const closeCreateModal = () => {
    setShowCreate(false);
  };

  const handleCreateChange = (field, value) => {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const body = {
        battery:
          createForm.battery === "" ? null : Number.parseInt(createForm.battery),
        status: createForm.status || "AVAILABLE",
        payloadCapacityKg:
          createForm.payloadCapacityKg === ""
            ? null
            : Number.parseFloat(createForm.payloadCapacityKg),
        serialNumber: createForm.serialNumber || null,
        telemetryId: createForm.telemetryId || null,
        hubId:
          createForm.hubId === "" ? null : Number.parseInt(createForm.hubId),
      };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Tạo drone mới thất bại");
      }

      const created = await res.json();
      // thêm vào danh sách (đặt lên đầu)
      setDrones((prev) => [created, ...prev]);
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi tạo drone mới");
    } finally {
      setCreating(false);
    }
  };


  // ===== RENDER =====
  return (
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý drone</h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem trạng thái drone, pin, vị trí và hub hiện tại.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Thêm drone
        </button>
      </div>


      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm theo serial, telemetry ID, hub..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          />
        </div>

        {/* Filter trạng thái */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng drone */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 overflow-x-auto">
        {loading && (
          <p className="text-sm text-gray-500">
            Đang tải danh sách drone...
          </p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        {!loading && !error && filteredDrones.length === 0 && (
          <p className="text-sm text-gray-500">
            Không có drone nào phù hợp với điều kiện lọc.
          </p>
        )}

        {!loading && !error && filteredDrones.length > 0 && (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500 uppercase">
                <th className="text-left py-2 pr-4">ID</th>
                <th className="text-left py-2 pr-4">Serial</th>
                <th className="text-left py-2 pr-4">Telemetry ID</th>
                <th className="text-left py-2 pr-4">Pin</th>
                <th className="text-left py-2 pr-4">Trạng thái</th>
                <th className="text-left py-2 pr-4">Vị trí</th>
                <th className="text-left py-2 pr-4">Hub</th>
                <th className="text-left py-2 pr-4">Đơn hiện tại</th>
                <th className="text-right py-2 pl-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrones.map((d) => (
                <tr
                  key={d.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-2 pr-4 align-middle text-gray-700">
                    #{d.id}
                  </td>

                  <td className="py-2 pr-4 align-middle text-gray-900 font-medium">
                    {d.serialNumber || "—"}
                  </td>

                  <td className="py-2 pr-4 align-middle text-gray-700">
                    {d.telemetryId || "—"}
                  </td>

                  {/* Pin */}
                  <td className="py-2 pr-4 align-middle">
                    {d.battery != null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${batteryColor(d.battery)}`}
                            style={{
                              width: `${Math.min(d.battery, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-700">
                          {d.battery}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-2 pr-4 align-middle">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        d.status
                      )}`}
                    >
                      {d.status || "N/A"}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-2 pr-4 align-middle text-gray-700">
                    {formatLocation(d)}
                  </td>

                  {/* Hub */}
                  <td className="py-2 pr-4 align-middle text-gray-700">
                    {d.hubAddress || "—"}
                  </td>

                  {/* Order */}
                  <td className="py-2 pr-4 align-middle text-gray-700">
                    {formatOrder(d)}
                  </td>

                  {/* Actions */}
                  <td className="py-2 pl-4 align-middle text-right space-x-2">
                    <button
                      onClick={() => handleViewDetails(d)}
                      className="inline-flex items-center px-2 py-1 text-xs border rounded-lg border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    >
                      Chi tiết / Sửa
                    </button>
                    <button
                      onClick={() => handleOpenStatusModal(d)}
                      className="inline-flex items-center px-2 py-1 text-xs border rounded-lg border-amber-500 text-amber-600 hover:bg-amber-50"
                    >
                      Đổi trạng thái
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    {/* MODAL TẠO MỚI DRONE */}
      {showCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Thêm drone mới</h2>
              <button
                onClick={closeCreateModal}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Serial (bắt buộc)
                  </label>
                  <input
                    type="text"
                    value={createForm.serialNumber}
                    onChange={(e) =>
                      handleCreateChange("serialNumber", e.target.value)
                    }
                    required
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Telemetry ID
                  </label>
                  <input
                    type="text"
                    value={createForm.telemetryId}
                    onChange={(e) =>
                      handleCreateChange("telemetryId", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Pin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={createForm.battery}
                    onChange={(e) =>
                      handleCreateChange("battery", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Tải trọng (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={createForm.payloadCapacityKg}
                    onChange={(e) =>
                      handleCreateChange("payloadCapacityKg", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Hub ID
                  </label>
                  <input
                    type="number"
                    value={createForm.hubId}
                    onChange={(e) =>
                      handleCreateChange("hubId", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                    placeholder="vd: 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 text-xs mb-1">
                  Trạng thái ban đầu
                </label>
                <select
                  value={createForm.status}
                  onChange={(e) =>
                    handleCreateChange("status", e.target.value)
                  }
                  className="w-full px-2 py-1.5 border rounded-lg text-sm"
                >
                  {STATUS_OPTIONS.filter((o) => o.value !== "all").map(
                    (opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-3 py-1.5 text-xs border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {creating ? "Đang tạo..." : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL CHI TIẾT / SỬA */}
      {selectedDrone && editForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Drone #{selectedDrone.id} - Chi tiết
              </h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Serial
                  </label>
                  <input
                    type="text"
                    value={editForm.serialNumber}
                    onChange={(e) =>
                      handleEditChange("serialNumber", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Telemetry ID
                  </label>
                  <input
                    type="text"
                    value={editForm.telemetryId}
                    onChange={(e) =>
                      handleEditChange("telemetryId", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Pin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.battery}
                    onChange={(e) =>
                      handleEditChange("battery", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Tải trọng (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.payloadCapacityKg}
                    onChange={(e) =>
                      handleEditChange("payloadCapacityKg", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Trạng thái
                  </label>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border">
                    {selectedDrone.status}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Đổi trạng thái ở nút &quot;Đổi trạng thái&quot; ngoài bảng.
                  </p>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Hub
                  </label>
                  <p className="text-sm text-gray-800">
                    {selectedDrone.hubAddress || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Vị trí (lat, long)
                  </label>
                  <p className="text-sm text-gray-800">
                    {formatLocation(selectedDrone)}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Đơn hiện tại
                  </label>
                  <p className="text-sm text-gray-800">
                    {formatOrder(selectedDrone)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleCloseDetails}
                className="px-3 py-1.5 text-xs border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Huỷ
              </button>
              <button
                onClick={handleSaveDetails}
                disabled={saving}
                className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐỔI TRẠNG THÁI */}
      {statusDrone && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">
                Đổi trạng thái – Drone #{statusDrone.id}
              </h2>
              <button
                onClick={handleCloseStatusModal}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Trạng thái hiện tại
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    statusDrone.status
                  )}`}
                >
                  {statusDrone.status}
                </span>
              </div>

              <div>
                <label className="block text-gray-500 text-xs mb-1">
                  Trạng thái mới
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-2 py-1.5 border rounded-lg text-sm"
                >
                  {STATUS_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleCloseStatusModal}
                className="px-3 py-1.5 text-xs border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Huỷ
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={savingStatus}
                className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
              >
                {savingStatus ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDronesPage;

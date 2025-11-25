// src/pages/Admin/AdminRestaurantsPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api";

const API_BASE = API_URL; 

const AdminRestaurantsPage = () => {
  const auth = useSelector((state) => state.auth);
  const jwt = auth?.jwt ?? null;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("id");

  // Fetch list
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}/api/merchant/list`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
      });

      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (ct.includes("application/json")) {
        const body = await res.json();
        const data = body?.data ?? [];

        const normalized = data.map((r) => ({
          id: r.id,
          name: r.name ?? "",
          ownerEmail: r.ownerEmail ?? "",
          status: r.status ?? "",
        }));

        setRestaurants(normalized);
      } else {
        throw new Error("Server không trả JSON");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // filter + search + sort
  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();

    return restaurants
      .filter((r) => {
        if (statusFilter !== "all" && r.status !== statusFilter) return false;
        if (!key) return true;

        return (
          r.name.toLowerCase().includes(key) ||
          r.ownerEmail.toLowerCase().includes(key) ||
          String(r.id).includes(key)
        );
      })
      .sort((a, b) =>
        sortBy === "name"
          ? a.name.localeCompare(b.name)
          : a.id - b.id
      );
  }, [restaurants, q, statusFilter, sortBy]);

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Quản lý nhà hàng</h1>
        <p className="mt-1 text-sm text-black">Duyệt & quản lý nhà hàng</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-black">
        <div className="flex-1">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên, email, ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Tổng số nhà hàng */}
        <div className="text-black font-medium">
            Tổng số nhà hàng:  {restaurants.length}
        </div>

        <div className="flex items-center gap-2 text-black">
          {/* Filter trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all" className="text-black">Tất cả trạng thái</option>
            <option value="pending" className="text-black">Chờ duyệt</option>
            <option value="active" className="text-black">Đang hoạt động</option>
            <option value="suspended" className="text-black">Bị tạm ngưng</option>
          </select>

          {/* Sắp xếp */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black"
          >
            <option value="id" className="text-black">Sắp xếp: ID</option>
            <option value="name" className="text-black">Sắp xếp: Tên</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 text-black">
        {loading ? (
          <p className="text-black">Đang tải...</p>
        ) : error ? (
          <p className="text-red-500 text-black">Lỗi: {error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-black">Không có nhà hàng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-black">
              <thead className="text-black">
                <tr className="border-b text-black">
                  <th className="py-2 px-3 w-20 text-black">ID</th>
                  <th className="py-2 px-3 text-black">Tên</th>
                  <th className="py-2 px-3 text-black">Owner email</th>
                  <th className="py-2 px-3 text-black">Trạng thái</th>
                </tr>
              </thead>

              <tbody className="text-black">
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50 text-black">
                    <td className="py-2 px-3 text-black">{r.id}</td>

                    <td className="py-2 px-3 text-black">
                      <div className="font-medium text-black">{r.name}</div>
                    </td>

                    <td className="py-2 px-3 text-black">
                      {r.ownerEmail || "-"}
                    </td>

                    <td className="py-2 px-3 text-black">
                      <span
                        className={
                          "inline-block px-2 py-1 text-xs rounded-full text-black " +
                          (r.status === "active"
                            ? "bg-emerald-200"
                            : r.status === "pending"
                            ? "bg-yellow-200"
                            : r.status === "suspended"
                            ? "bg-red-200"
                            : "bg-gray-200")
                        }
                      >
                        {r.status || "-"}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurantsPage;

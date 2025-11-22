import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../config/api"; 

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "BLOCKED", label: "Đã khóa" },
  { value: "PENDING", label: "Chờ xác minh" },
];

const AdminUsersPage = () => {
  const { jwt } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Backend mapping: baseURL "http://localhost:5454/api" + "/user/search" = /api/user/search
  const API_URL = "/user/search";


  const fetchUsers = async (page = 0) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        size: 20,
      };
      if (searchTerm.trim()) params.keyword = searchTerm.trim();
      if (statusFilter !== "all") params.status = statusFilter;

      console.log("Gọi API /user/search với params:", params);

      const res = await api.get(API_URL, {
        params,
        headers: jwt
          ? {
              Authorization: `Bearer ${jwt}`,
            }
          : {},
      });

      const body = res.data;
      console.log("Kết quả trả về:", body);

      setUsers(body.content || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Không thể tải danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  };


  // load lần đầu
  useEffect(() => {
    fetchUsers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // đổi filter trạng thái -> gọi backend lại
  useEffect(() => {
    fetchUsers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(0);
  };

  // TODO: sau này bạn implement thật sự
  const handleEditUser = (user) => {
    console.log("Edit user", user);
    // mở modal / navigate(`/admin/users/${user.id}/edit`)
  };

  const handleChangeStatus = (user) => {
    console.log("Change status for", user);
    // ví dụ: call PUT /api/user/{id}/status rồi fetchUsers(page)
  };

  const handleViewDetails = (user) => {
    console.log("View details", user);
    // ví dụ: navigate(`/admin/users/${user.id}`)
  };

  const handlePrevPage = () => {
    if (page > 0) {
      fetchUsers(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page + 1 < totalPages) {
      fetchUsers(page + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống.
        </p>
      </div>

      {/* Thanh search + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          />
        </form>

        {/* Filter trạng thái */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white 
             focus:outline-none focus:ring-2 focus:ring-emerald-500 
             focus:border-emerald-500 text-black"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 overflow-x-auto">
        {loading && (
          <p className="text-sm text-gray-500">
            Đang tải danh sách người dùng...
          </p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="text-sm text-gray-500">
            Không tìm thấy người dùng phù hợp.
          </p>
        )}

        {!loading && !error && users.length > 0 && (
          <>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold text-gray-500 uppercase">
                  <th className="text-left py-2 pr-4">ID</th>
                  <th className="text-left py-2 pr-4">Họ tên</th>
                  <th className="text-left py-2 pr-4">Email</th>
                  <th className="text-left py-2 pr-4">Vai trò</th>
                  <th className="text-left py-2 pr-4">Trạng thái</th>
                  <th className="text-right py-2 pl-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-2 pr-4 align-middle text-gray-700">
                      {u.id}
                    </td>
                    <td className="py-2 pr-4 align-middle text-gray-900 font-medium">
                      {u.fullName}
                    </td>
                    <td className="py-2 pr-4 align-middle text-gray-700">
                      {u.email}
                    </td>
                    <td className="py-2 pr-4 align-middle text-gray-700">
                      {u.role}
                    </td>
                    <td className="py-2 pr-4 align-middle">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : u.status === "BLOCKED"
                            ? "bg-red-100 text-red-700"
                            : u.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.status || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 pl-4 align-middle text-right space-x-2">
                      <button
                        onClick={() => handleEditUser(u)}
                        className="inline-flex items-center px-2 py-1 text-xs border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleChangeStatus(u)}
                        className="inline-flex items-center px-2 py-1 text-xs border rounded-lg border-amber-500 text-amber-600 hover:bg-amber-50"
                      >
                        Đổi trạng thái
                      </button>
                      <button
                        onClick={() => handleViewDetails(u)}
                        className="inline-flex items-center px-2 py-1 text-xs border rounded-lg border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang đơn giản */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              <span>
                Trang {page + 1} / {totalPages || 1}
              </span>
              <div className="space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 0}
                  className={`px-3 py-1 border rounded-lg ${
                    page === 0
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Trước
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page + 1 >= totalPages}
                  className={`px-3 py-1 border rounded-lg ${
                    page + 1 >= totalPages
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;

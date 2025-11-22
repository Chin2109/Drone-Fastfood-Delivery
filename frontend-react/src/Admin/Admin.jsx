import { NavLink, Routes, Route } from "react-router-dom";
import AdminUsersPage from "../Admin/component/AdminUsersPage";
import AdminDispatchPage from "./component/AdminDispatchPage";
import AdminDronesPage from "./component/AdminDronesPage";

const ManagementSection = ({
  title,
  description,
  searchPlaceholder,
  statusOptions,
  emptyText,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {/* Thanh search + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          />
        </div>

        {/* Filter trạng thái */}
        <div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            defaultValue={statusOptions?.[0]?.value ?? "all"}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Khu vực danh sách */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
        <p className="text-gray-500 text-sm">{emptyText}</p>
        {/* TODO: chỗ này bạn render bảng / list thực tế */}
      </div>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Quản lý hệ thống</h2>
        <nav className="space-y-2">
          {/* Tổng quan */}
          <NavLink
            end
            to="."
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Tổng quan
          </NavLink>

          {/* Người dùng */}
          <NavLink
            to="users"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Người dùng
          </NavLink>

          {/* Nhà hàng */}
          <NavLink
            to="restaurants"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Nhà hàng
          </NavLink>

          {/* Điều phối đơn hàng */}
          <NavLink
            to="dispatch"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Điều phối đơn hàng
          </NavLink>

          {/* Drone */}
          <NavLink
            to="drones"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Drone
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Routes>
          {/* Tổng quan hệ thống */}
          <Route
            index
            element={
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Tổng quan hệ thống
                </h1>
                <p className="text-sm text-gray-500">
                  Dashboard tổng quan (số người dùng, số nhà hàng, đơn đang xử
                  lý, drone đang hoạt động...) bạn có thể fill thêm sau.
                </p>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
                  <p className="text-gray-500 text-sm">
                    Nội dung dashboard hệ thống sẽ hiển thị ở đây.
                  </p>
                </div>
              </div>
            }
          />

          {/* Người dùng */}  
          <Route path="users" element={<AdminUsersPage />} />

          {/* Nhà hàng */}
          <Route
            path="restaurants"
            element={
              <ManagementSection
                title="Quản lý nhà hàng"
                description="Duyệt, khóa/mở và quản lý thông tin nhà hàng."
                searchPlaceholder="Tìm theo tên nhà hàng, email, mã nhà hàng..."
                statusOptions={[
                  { value: "all", label: "Tất cả trạng thái" },
                  { value: "pending", label: "Chờ duyệt" },
                  { value: "active", label: "Đang hoạt động" },
                  { value: "suspended", label: "Bị tạm ngưng" },
                ]}
                emptyText="Danh sách nhà hàng sẽ hiển thị ở đây."
              />
            }
          />

          {/* Điều phối đơn hàng */}
          <Route path="dispatch" element={<AdminDispatchPage />} />

          {/* Drone */}
          <Route path="drones" element={<AdminDronesPage />} /> 

        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;

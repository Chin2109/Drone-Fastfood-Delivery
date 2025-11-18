import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import MerchantDashboard from "./MerchantDashboard";
import MerchantOrders from "./MerchantOrders";
import MerchantMenu from "./MerchantMenu.jsx";
import MerchantOrderDetail from "./MerchantOrderDetail.jsx";

const MerchantLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Quản lý nhà hàng</h2>
        <nav className="space-y-2">
          {/* Tổng quan */}
          <NavLink
            end
            to="."   // tương đối: /merchantadmin
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

          {/* Đơn hàng */}
          <NavLink
            to="orders"   // /merchantadmin/orders
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Đơn hàng
          </NavLink>

          {/* Thực đơn */}
          <NavLink
            to="menu"     // /merchantadmin/menu
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Thực đơn
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<MerchantDashboard />} />   {/* /merchantadmin */}
          <Route path="orders" element={<MerchantOrders />} /> {/* /merchantadmin/orders */}
          <Route path="orders/:orderId" element={<MerchantOrderDetail />} /> 
          <Route path="menu" element={<MerchantMenu />} />   {/* /merchantadmin/menu */}

        </Routes>
      </main>
    </div>
  );
};

export default MerchantLayout;

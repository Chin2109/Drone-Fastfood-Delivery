// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getMenuItemsByRestaurantId } from "../../State/Customers/Menu/menu.action";
// import { Grid } from "@mui/material";
// import OrdersTable from "../Orders/OrderTable";
// import MenuItemTable from "../Food/MenuItemTable";
// import AvgCard from "../ReportCard/ReportCard";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import SellIcon from "@mui/icons-material/Sell";
// import FastfoodIcon from "@mui/icons-material/Fastfood";

// const RestaurantDashboard = () => {
//   const { id } = useParams();
//   const {restaurant}=useSelector(store=>store);
//   console.log("restaurants id ", id);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(
//       getMenuItemsByRestaurantId({
//         restaurantId: id,
//         jwt: localStorage.getItem("jwt"),
//       })
//     );
//   }, []);

//   console.log("restaurant",restaurant)
//   return (
//     <div className="px-2">

//       <Grid container spacing={1}>
//         {/* <Grid item lg={3} xs={12}>
//           <AvgCard
//             title={"Total Earnings"}
//             value={`Rs. ${450}`}
//             growValue={70}
//             icon={
//               <CurrencyRupeeIcon sx={{ fontSize: "3rem", color: "gold" }} />
//             }
//           />
//         </Grid>
//         <Grid item lg={3} xs={12}>
//           <AvgCard
//             title={"Total Selles"}
//             value={`${390}`}
//             growValue={35}
//             icon={<SellIcon sx={{ fontSize: "3rem", color: "green" }} />}
//           />
//         </Grid>
//         <Grid item lg={3} xs={12}>
//           <AvgCard
//             title={"Sold Items"}
//             value={`${299}`}
//             growValue={30}
//             icon={<FastfoodIcon sx={{ fontSize: "3rem", color: "blue" }} />}
//           />
//         </Grid>
//         <Grid item lg={3} xs={12}>
//           <AvgCard
//             title={"Left Items"}
//             value={`${1}`}
//             growValue={10}
//             icon={<FastfoodIcon sx={{ fontSize: "3rem", color: "red" }} />

//           }
//           />
//         </Grid> */}
//         <Grid lg={6} xs={12} item>
//           <OrdersTable name={"Recent Order"} isDashboard={true} />
//         </Grid>
//         <Grid lg={6} xs={12} item>
//           <MenuItemTable isDashboard={true} name={"Recently Added Menu"} />
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default RestaurantDashboard;

import {
  BarChart2,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  Edit,
  Gift,
  GripVertical,
  Home,
  Image,
  Loader,
  Menu,
  MessageSquare,
  Package,
  RotateCw,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// Dữ liệu giả định
const initialMenuItems = [
  {
    id: 1,
    name: "Gà BBQ Mùa Lửa Hồng (6 Miếng)",
    price: 149000,
    category: "Gà Chiên",
    status: "Đang bán",
    isAvailable: true,
    promo: "12/12",
  },
  {
    id: 2,
    name: "Gà Không Xương Xốt Mật Tokkong",
    price: 119000,
    category: "Gà Chiên",
    status: "Hết hàng",
    isAvailable: false,
    promo: null,
  },
];

const initialCategories = [
  { id: "cat1", name: "Gà Chiên", dishCount: 3 },
  { id: "cat2", name: "Món Chính", dishCount: 1 },
];

const initialToppingGroups = [
  {
    id: 101,
    name: "Size",
    required: true,
    min: 1,
    max: 1,
    options: [
      { id: 1, name: "Size S", price: 0 },
      { id: 2, name: "Size L", price: 30000 },
    ],
  },
  {
    id: 102,
    name: "Topping Phô Mai",
    required: false,
    min: 0,
    max: 3,
    options: [
      { id: 3, name: "Phô Mai Bột", price: 15000 },
      { id: 4, name: "Phô Mai Kéo Sợi", price: 20000 },
    ],
  },
];

const initialOrders = [
  {
    id: "SFD-231031-099",
    time: "Hôm qua",
    status: "CANCELLED",
    total: 80000,
    type: "COD",
    customer: "Lê Hoàng D",
    items: [{ name: "Bún Bò", qty: 1, price: 80000 }],
  },
];

// Định dạng tiền tệ
const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + "₫";

// Hàm hỗ trợ để tránh lỗi "Plus is not defined" khi dùng icon
const PlusIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// --- UTILITY COMPONENTS ---

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
  suffix = "",
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full p-3 border rounded-lg text-sm ${
          readOnly
            ? "bg-gray-50 text-gray-500"
            : "bg-white focus:ring-orange-500 focus:border-orange-500"
        }`}
        placeholder={label}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows="3"
      className="w-full p-3 border rounded-lg text-sm bg-white focus:ring-orange-500 focus:border-orange-500"
      placeholder="Mô tả chi tiết món ăn..."
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg text-sm bg-white focus:ring-orange-500 focus:border-orange-500"
    >
      {children}
    </select>
  </div>
);

// Component Toast thông báo (Mô phỏng đơn hàng mới)
const ToastNotification = ({ message, onClose }) => {
  return (
    <div className="fixed top-20 right-4 z-[100] w-full max-w-sm bg-orange-600 text-white p-4 rounded-lg shadow-xl flex items-start space-x-3 animate-slideIn transition-all duration-300">
      <Bell className="w-6 h-6 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm">{message}</p>
        <p className="text-xs opacity-80 mt-1">
          Vui lòng chấp nhận đơn hàng trong vòng 30 giây.
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-full text-white opacity-70 hover:opacity-100"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

// --- ORDERS PAGE COMPONENTS ---

// 1. Modal Chi Tiết Đơn Hàng
const OrderDetailModal = ({ order, onAction, onClose }) => {
  const isNew = order.status === "NEW";
  const isPreparing = order.status === "PREPARING";
  const isReady = order.status === "READY";
  const isCompletedOrCancelled =
    order.status === "COMPLETED" || order.status === "CANCELLED";

  const getStatusStyle = (status) => {
    switch (status) {
      case "NEW":
        return "bg-orange-100 text-orange-600";
      case "PREPARING":
        return "bg-yellow-100 text-yellow-600";
      case "READY":
        return "bg-blue-100 text-blue-600";
      case "COMPLETED":
        return "bg-green-100 text-green-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="p-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">Chi Tiết Đơn Hàng</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-between">
            Mã ĐH: <span className="font-mono text-gray-700">{order.id}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status === "NEW"
                ? "ĐƠN MỚI"
                : order.status === "PREPARING"
                ? "ĐANG LÀM"
                : order.status === "READY"
                ? "SẴN SÀNG"
                : order.status === "COMPLETED"
                ? "HOÀN TẤT"
                : "ĐÃ HỦY"}
            </span>
          </p>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-6 space-y-4">
          {/* Thông tin chung */}
          <div className="border p-4 rounded-lg bg-indigo-50/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Khách Hàng:</span>
              <span className="font-semibold text-gray-800">
                {order.customer}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Thời Gian Đặt:</span>
              <span className="text-gray-800">{order.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Hình Thức TT:</span>
              <span
                className={`font-semibold ${
                  order.type === "COD" ? "text-red-500" : "text-green-500"
                }`}
              >
                {order.type}
              </span>
            </div>
          </div>

          {/* Danh sách món */}
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
            Danh Sách Món ({order.items.length})
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {order.items.map((item, index) => (
              <div key={index} className="border-b pb-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-800">
                    {item.qty}x {item.name}
                  </span>
                  <span className="text-gray-700">
                    {formatCurrency(item.qty * item.price)}
                  </span>
                </div>
                {item.note && (
                  <p className="text-xs text-red-500 italic mt-1 ml-4">
                    Lưu ý: {item.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Tổng cộng */}
          <div className="pt-4 border-t border-dashed">
            <div className="flex justify-between text-base font-bold text-gray-800">
              <span>TỔNG CỘNG:</span>
              <span className="text-2xl text-orange-600">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Modal - Hành động */}
        <div className="p-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <XCircle className="w-6 h-6" />
          </button>

          {!isCompletedOrCancelled && (
            <>
              {isNew && (
                <button
                  onClick={() => onAction(order.id, "PREPARING")}
                  className="flex items-center bg-green-500 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Chấp Nhận
                </button>
              )}

              {isPreparing && (
                <button
                  onClick={() => onAction(order.id, "READY")}
                  className="flex items-center bg-blue-500 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                  <Package className="w-5 h-5 mr-2" /> Sẵn Sàng Giao
                </button>
              )}

              {(isNew || isPreparing) && (
                <button
                  onClick={() => onAction(order.id, "CANCELLED")}
                  className="flex items-center border border-red-500 text-red-500 font-medium py-3 px-4 rounded-lg shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5 mr-2" /> Hủy Đơn
                </button>
              )}

              {isReady && (
                <button
                  onClick={() => onAction(order.id, "COMPLETED")}
                  className="flex items-center bg-gray-500 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                >
                  <Truck className="w-5 h-5 mr-2" /> Giao Thành Công (Mock)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Component Dòng Đơn Hàng
const OrderRow = ({ order, onViewDetail }) => {
  const isNew = order.status === "NEW";
  const isPreparing = order.status === "PREPARING";
  const isCompleted = order.status === "COMPLETED";

  const statusMap = {
    NEW: {
      text: "ĐƠN MỚI",
      color: "bg-orange-100 text-orange-600",
      icon: Bell,
    },
    PREPARING: {
      text: "ĐANG LÀM",
      color: "bg-yellow-100 text-yellow-600",
      icon: Loader,
    },
    READY: {
      text: "SẴN SÀNG",
      color: "bg-blue-100 text-blue-600",
      icon: Truck,
    },
    COMPLETED: {
      text: "HOÀN TẤT",
      color: "bg-green-100 text-green-600",
      icon: CheckCircle,
    },
    CANCELLED: {
      text: "ĐÃ HỦY",
      color: "bg-red-100 text-red-600",
      icon: XCircle,
    },
  };

  const statusInfo = statusMap[order.status] || statusMap.CANCELLED;
  const IconComponent = statusInfo.icon;

  return (
    <div
      className={`flex items-center p-4 border-b transition-colors cursor-pointer ${
        isNew
          ? "bg-orange-50 hover:bg-orange-100/70 shadow-lg"
          : "hover:bg-gray-50"
      }`}
      onClick={() => onViewDetail(order)}
    >
      {/* ID & Thời gian */}
      <div className="w-40 min-w-[100px] text-sm">
        <p className="font-semibold text-gray-800">{order.id}</p>
        <p className="text-xs text-gray-500">{order.time}</p>
      </div>

      {/* Trạng thái */}
      <div className="w-32 text-center text-sm">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center ${statusInfo.color}`}
        >
          <IconComponent className="w-3 h-3 mr-1 hidden sm:inline" />
          {statusInfo.text}
        </span>
      </div>

      {/* Khách hàng & Loại TT */}
      <div className="flex-1 min-w-0 px-4 hidden md:block">
        <p className="text-sm font-medium text-gray-800 truncate">
          {order.customer}
        </p>
        <p
          className={`text-xs font-semibold ${
            order.type === "COD" ? "text-red-500" : "text-green-500"
          }`}
        >
          {order.type}
        </p>
      </div>

      {/* Tổng tiền */}
      <div className="w-32 text-right">
        <p className="font-bold text-orange-600 text-lg">
          {formatCurrency(order.total)}
        </p>
      </div>
    </div>
  );
};

// 3. Trang chính Quản lý Đơn Hàng
const OrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("NEW");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrderToast, setShowNewOrderToast] = useState(false);

  // Mock new order function (Mô phỏng đơn hàng mới đổ về)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance of a new order
        const newOrder = {
          id: `SFD-${Date.now().toString().slice(-6)}`,
          time: "vài giây trước",
          status: "NEW",
          total: Math.floor(Math.random() * 500 + 100) * 1000,
          type: Math.random() < 0.5 ? "COD" : "Online",
          customer: `Khách VIP ${Math.floor(Math.random() * 100)}`,
          items: initialOrders[0].items.map((item) => ({ ...item, qty: 1 })),
        };
        setOrders((prev) => [newOrder, ...prev]);
        setShowNewOrderToast(true);
        setTimeout(() => setShowNewOrderToast(false), 5000); // Hide toast after 5s
      }
    }, 15000); // Check for new order every 15s

    return () => clearInterval(interval);
  }, []);

  // Xử lý hành động từ Modal (Chấp nhận, Sẵn sàng, Hủy)
  const handleOrderAction = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status: newStatus, time: "Vừa cập nhật" }
          : order
      )
    );
    setSelectedOrder(null); // Close modal
    // Chuyển tab sau khi hành động (nếu cần)
    if (newStatus !== "COMPLETED" && newStatus !== "CANCELLED") {
      setActiveTab(newStatus);
    }
  };

  // Lọc danh sách theo Tab
  const filteredOrders = orders.filter(
    (order) => activeTab === "ALL" || order.status === activeTab
  );

  // Đếm số lượng đơn hàng theo trạng thái
  const orderCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      acc["ALL"] = acc["ALL"] + 1;
      return acc;
    },
    { ALL: 0 }
  );

  const tabs = [
    {
      key: "NEW",
      label: "Đơn Mới",
      count: orderCounts.NEW || 0,
      color: "text-orange-600",
    },
    {
      key: "PREPARING",
      label: "Đang Làm",
      count: orderCounts.PREPARING || 0,
      color: "text-yellow-600",
    },
    {
      key: "READY",
      label: "Sẵn Sàng",
      count: orderCounts.READY || 0,
      color: "text-blue-600",
    },
    {
      key: "COMPLETED",
      label: "Hoàn Tất",
      count: orderCounts.COMPLETED || 0,
      color: "text-green-600",
    },
    {
      key: "CANCELLED",
      label: "Đã Hủy",
      count: orderCounts.CANCELLED || 0,
      color: "text-red-600",
    },
    {
      key: "ALL",
      label: "Tất Cả",
      count: orderCounts.ALL || 0,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <ClipboardList className="w-6 h-6 mr-2 text-orange-500" /> Quản Lý Đơn
        Hàng
      </h1>

      {/* Thanh Tabs Trạng thái */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6 bg-white p-2 rounded-xl shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
              activeTab === tab.key
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  tab.key === "NEW"
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header/Cột tiêu đề */}
        <div className="hidden md:flex p-4 border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
          <div className="w-40">Mã ĐH & Thời Gian</div>
          <div className="w-32 text-center">Trạng Thái</div>
          <div className="flex-1 px-4">Khách Hàng & TT</div>
          <div className="w-32 text-right">Tổng Tiền</div>
        </div>

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onViewDetail={setSelectedOrder}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>Không có đơn hàng nào trong trạng thái này.</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setOrders(initialOrders)}
          className="text-gray-500 hover:text-gray-800 text-sm flex items-center"
        >
          <RotateCw className="w-4 h-4 mr-1" />
          Làm mới (Reset Mock Data)
        </button>
      </div>

      {/* RENDER MODALS */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onAction={handleOrderAction}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* TOAST NOTIFICATION */}
      {showNewOrderToast && (
        <ToastNotification
          message={`Đơn hàng mới (${orderCounts.NEW}) đang chờ!`}
          onClose={() => setShowNewOrderToast(false)}
        />
      )}
    </div>
  );
};

// --- MENU MANAGEMENT COMPONENTS (Giữ nguyên) ---

// Component Sidebar (giữ nguyên)
const Sidebar = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { name: "Trang Chủ", icon: Home, page: "home" },
    { name: "Thực Đơn", icon: Menu, page: "menu" },
    { name: "Đơn Hàng", icon: ClipboardList, page: "orders" },
    { name: "Khuyến Mãi", icon: Gift, page: "promo" },
    { name: "Báo Cáo & Đánh Giá", icon: BarChart2, page: "report" },
    { name: "Trung Tâm Hỗ Trợ", icon: MessageSquare, page: "support" },
  ];

  return (
    <div className="bg-white shadow-xl min-h-screen w-16 lg:w-64 fixed top-0 left-0 z-10 transition-all duration-300 hidden md:block">
      <div className="p-4 flex items-center justify-center lg:justify-start h-20 border-b">
        <span className="text-lg font-bold text-orange-500 lg:hidden">SF</span>
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center space-x-3 p-3 my-1 rounded-lg cursor-pointer transition-colors ${
              currentPage === item.page
                ? "bg-orange-100 text-orange-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => onNavigate(item.page)}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:block text-sm">{item.name}</span>
          </div>
        ))}
      </nav>
      <div className="absolute bottom-4 left-0 w-full p-4 border-t">
        <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-600">
          <Settings className="w-5 h-5" />
          <span className="hidden lg:block text-sm font-medium">Cài Đặt</span>
        </div>
      </div>
    </div>
  );
};

// Component Header (giữ nguyên)
const Header = ({ storeName }) => (
  <header className="bg-white shadow-md h-20 flex items-center justify-between p-4 pl-20 lg:pl-72 fixed w-full top-0 z-10">
    <div className="text-xl font-semibold text-gray-800 flex items-center">
      <ShoppingBag className="w-5 h-5 mr-2 text-orange-500" />
      {storeName} - Quản lý
    </div>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Clock className="w-4 h-4 text-green-500" />
        <span className="hidden sm:block">Hoạt động: 08:00 - 22:00</span>
      </div>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors text-sm">
        Đăng Xuất
      </button>
    </div>
  </header>
);

// --- MENU MANAGEMENT COMPONENTS (Giữ nguyên) ---

// 1. Modal Chỉnh Sửa Món
const EditDishModal = ({ dish, onClose }) => {
  // State cho form (mock)
  const [dishData, setDishData] = useState({
    name: dish.name,
    price: dish.price,
    description:
      "Món gà rán giòn rụm tẩm sốt BBQ đặc biệt, hương vị mùa lửa hồng độc quyền.",
    category: dish.category,
    isAvailable: dish.isAvailable,
    // ... thêm các trường khác
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDishData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log("Lưu món ăn:", dishData);
    alert(`Đã lưu món: ${dishData.name}. (Mock API call)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Chi tiết món</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột 1: Hình ảnh */}
          <div className="lg:col-span-1 border-r pr-6">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Image className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm text-center text-gray-500 mt-2">
              Ảnh đại diện món ăn
            </p>
            <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
              Tải ảnh lên
            </button>
            <p className="text-xs text-red-500 mt-2">
              Biểu quyết độ nét ảnh: 1/11
            </p>
          </div>

          {/* Cột 2 & 3: Chi tiết Form */}
          <div className="lg:col-span-2 space-y-4">
            <InputField label="Mã Món" value={`Mã: 160373087`} readOnly />
            <InputField
              label="Tên Món"
              name="name"
              value={dishData.name}
              onChange={handleChange}
            />
            <InputField
              label="Giá"
              name="price"
              type="number"
              value={dishData.price}
              onChange={handleChange}
              suffix="₫"
            />

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Danh mục"
                name="category"
                value={dishData.category}
                onChange={handleChange}
              >
                {initialCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </SelectField>
              <InputField label="Thời gian bán" value="Cả ngày" readOnly />
            </div>

            <TextAreaField
              label="Mô tả"
              name="description"
              value={dishData.description}
              onChange={handleChange}
            />

            {/* Topping và Bán hàng */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-gray-700">Cấu hình</h3>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <label className="text-sm font-medium text-gray-700">
                  Món còn bán
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={dishData.isAvailable}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <SelectField
                label="Chọn Topping đính kèm"
                name="topping"
                value="default"
                onChange={handleChange}
              >
                <option value="default" disabled>
                  Chọn Topping
                </option>
                {initialToppingGroups.map((group) => (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                ))}
                <option value="add_new">Thêm nhóm topping mới...</option>
              </SelectField>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="mr-3 text-gray-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-orange-500 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Modal Sắp Xếp Nhóm Món
const ReorderGroupModal = ({ categories, onSave, onClose }) => {
  const [list, setList] = useState(categories);

  const handleMove = (index, direction) => {
    const newList = [...list];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newList.length) {
      [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
      setList(newList);
    }
  };

  // Nút Di chuyển (Mô phỏng kéo thả)
  const ReorderButton = ({ direction, index, total }) => {
    const isMovable =
      (direction === "up" && index > 0) ||
      (direction === "down" && index < total - 1);
    const Icon = direction === "up" ? ChevronUp : ChevronDown;

    return (
      <button
        onClick={() => handleMove(index, direction)}
        disabled={!isMovable}
        className={`p-1 rounded-full transition-colors ${
          isMovable
            ? "hover:bg-gray-200 text-gray-700"
            : "text-gray-300 cursor-not-allowed"
        }`}
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Sửa Nhóm</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Danh sách nhóm món */}
        <div className="p-4 space-y-2">
          <p className="text-sm text-gray-500 mb-4">
            Kéo thả vị trí nhóm món và chọn Lưu
          </p>
          {list.map((group, index) => (
            <div
              key={group.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center space-x-2 text-gray-800 font-medium">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <span>{group.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ReorderButton
                  direction="up"
                  index={index}
                  total={list.length}
                />
                <ReorderButton
                  direction="down"
                  index={index}
                  total={list.length}
                />
              </div>
            </div>
          ))}
          <button className="w-full text-orange-500 font-medium py-2 mt-4 hover:bg-orange-50 rounded-lg">
            <PlusIcon className="w-4 h-4 inline mr-1" /> Thêm Nhóm Mới
          </button>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t flex justify-center bg-gray-50 rounded-b-xl">
          <button
            onClick={() => {
              onSave(list);
              onClose();
            }}
            className="w-full bg-orange-500 text-white font-medium py-3 rounded-lg shadow-md hover:bg-orange-600 transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Giao diện Tạo/Chỉnh sửa Nhóm Topping
const ToppingGroupFormModal = ({ toppingGroup, onClose }) => {
  const [groupData, setGroupData] = useState(
    toppingGroup || {
      name: "",
      required: true,
      min: 1,
      max: 1,
      options: [{ id: Math.random(), name: "Topping 1", price: 0 }],
    }
  );

  const handleOptionChange = (id, field, value) => {
    setGroupData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  const handleAddOption = () => {
    setGroupData((prev) => ({
      ...prev,
      options: [...prev.options, { id: Math.random(), name: "", price: 0 }],
    }));
  };

  const handleRemoveOption = (id) => {
    setGroupData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }));
  };

  const handleSave = () => {
    console.log("Lưu Nhóm Topping:", groupData);
    alert(`Đã lưu Nhóm Topping: ${groupData.name}. (Mock API call)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {toppingGroup ? "Chỉnh Sửa" : "Thêm"} Nhóm Topping
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tên nhóm */}
          <InputField
            label="Tên Nhóm Topping"
            value={groupData.name}
            onChange={(e) =>
              setGroupData((p) => ({ ...p, name: e.target.value }))
            }
          />

          {/* Cấu hình bắt buộc/tùy chọn */}
          <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
            <h3 className="font-semibold text-gray-700">Quyền tùy chọn</h3>

            <label className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer">
              <span className="text-sm font-medium">Không bắt buộc</span>
              <input
                type="radio"
                name="requiredOption"
                checked={!groupData.required}
                onChange={() =>
                  setGroupData((p) => ({ ...p, required: false, min: 0 }))
                }
                className="text-orange-500 w-4 h-4 border-gray-300 focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer">
              <span className="text-sm font-medium">Bắt buộc</span>
              <input
                type="radio"
                name="requiredOption"
                checked={groupData.required}
                onChange={() =>
                  setGroupData((p) => ({ ...p, required: true, min: 1 }))
                }
                className="text-orange-500 w-4 h-4 border-gray-300 focus:ring-orange-500"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Số lượng tối thiểu"
                type="number"
                value={groupData.min}
                disabled={groupData.required}
                onChange={(e) =>
                  setGroupData((p) => ({ ...p, min: parseInt(e.target.value) }))
                }
              />
              <InputField
                label="Số lượng tối đa"
                type="number"
                value={groupData.max}
                onChange={(e) =>
                  setGroupData((p) => ({ ...p, max: parseInt(e.target.value) }))
                }
              />
            </div>
          </div>

          {/* Danh sách Topping Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Danh sách Topping</h3>
            {groupData.options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50"
              >
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <input
                  type="text"
                  placeholder="Tên Topping"
                  value={option.name}
                  onChange={(e) =>
                    handleOptionChange(option.id, "name", e.target.value)
                  }
                  className="flex-1 p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Giá (₫)"
                  value={option.price}
                  onChange={(e) =>
                    handleOptionChange(
                      option.id,
                      "price",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-24 p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
                <button
                  onClick={() => handleRemoveOption(option.id)}
                  className="text-red-500 p-2 rounded-full hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddOption}
              className="w-full text-orange-500 font-medium py-2 border border-dashed border-orange-300 rounded-lg hover:bg-orange-50 mt-2"
            >
              <PlusIcon className="w-4 h-4 inline mr-1" /> Thêm Topping
            </button>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-xl">
          <button
            onClick={handleSave}
            className="bg-orange-500 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Component quản lý Nhóm Topping (dùng cho tab 'topping')
const ToppingListPage = ({ onEdit }) => (
  <div className="bg-white shadow-xl rounded-xl overflow-hidden">
    <div className="hidden md:flex p-4 border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
      <div className="flex-1">Tên Nhóm Topping</div>
      <div className="w-32 text-center">Tùy Chọn</div>
      <div className="w-24 text-center">Hành Động</div>
    </div>

    {initialToppingGroups.map((group) => (
      <div
        key={group.id}
        className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-800 truncate">
            {group.name}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Gồm {group.options.length} loại topping
          </p>
        </div>
        <div className="w-32 text-center text-sm">
          {group.required ? (
            <span className="text-blue-600 font-semibold">Bắt buộc</span>
          ) : (
            <span className="text-green-600 font-semibold">Tùy chọn</span>
          )}
        </div>
        <div className="w-24 text-center">
          <button
            onClick={() => onEdit(group)}
            className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
            title="Chỉnh Sửa Nhóm"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    ))}

    <div className="p-4 flex justify-between items-center text-sm text-gray-500">
      <span>
        Hiển thị 1 đến {initialToppingGroups.length} trên{" "}
        {initialToppingGroups.length} nhóm
      </span>
    </div>
  </div>
);

// Component Danh sách món ăn
const MenuItem = ({ item, onToggleStatus, onEdit, onReorder }) => {
  const isSaleable = item.isAvailable && item.status === "Đang bán";
  const statusColor = isSaleable
    ? "text-green-600 bg-green-100"
    : "text-red-600 bg-red-100";

  return (
    <div className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">
          {item.name}
          {item.promo && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {item.promo}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {item.category} | {formatCurrency(item.price)}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Trạng thái */}
        <div
          className="text-xs font-semibold uppercase hidden lg:block"
          style={{ width: "80px" }}
        >
          <span className={`px-2 py-1 rounded-full ${statusColor}`}>
            {item.status}
          </span>
        </div>

        {/* Nút chỉnh sửa/xóa (Edit/Reorder) */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
            title="Chỉnh Sửa Món"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onReorder} // Sẽ mở modal sắp xếp nhóm món
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors hidden md:block"
            title="Sắp xếp nhóm món"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSaleable}
            onChange={() => onToggleStatus(item.id)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
        </label>
      </div>
    </div>
  );
};

// Component Trang Quản lý Thực đơn
const MenuManagementPage = () => {
  const [menu, setMenu] = useState(initialMenuItems);
  const [activeTab, setActiveTab] = useState("dish"); // 'dish' hoặc 'topping'

  // State quản lý Modal
  const [modal, setModal] = useState({
    type: null, // 'edit_dish', 'reorder_groups', 'edit_topping_group'
    data: null,
    isOpen: false,
  });

  const handleToggleStatus = (id) => {
    setMenu((prevMenu) =>
      prevMenu.map((item) =>
        item.id === id
          ? {
              ...item,
              isAvailable: !item.isAvailable,
              status: item.isAvailable ? "Hết hàng" : "Đang bán",
            }
          : item
      )
    );
    console.log(`Toggle status cho món ID: ${id}`);
  };

  const handleEditDish = (item) => {
    setModal({ type: "edit_dish", data: item, isOpen: true });
  };

  const handleReorderGroups = () => {
    setModal({ type: "reorder_groups", data: initialCategories, isOpen: true });
  };

  const handleEditToppingGroup = (group) => {
    setModal({ type: "edit_topping_group", data: group, isOpen: true });
  };

  const handleCreateToppingGroup = () => {
    setModal({ type: "edit_topping_group", data: null, isOpen: true }); // data: null -> Create
  };

  const closeModal = () => setModal({ type: null, data: null, isOpen: false });

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thực Đơn</h1>

      {/* Thanh tìm kiếm và Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        {/* Thanh tìm kiếm */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm món, topping, nhóm topping"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Tabs: Món | Nhóm Topping */}
        <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
          <button
            onClick={() => setActiveTab("dish")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "dish"
                ? "bg-white text-orange-600 shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Món ({menu.length})
          </button>
          <button
            onClick={() => setActiveTab("topping")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "topping"
                ? "bg-white text-orange-600 shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Nhóm Topping ({initialToppingGroups.length})
          </button>
        </div>

        {/* Nút thêm mới */}
        <button
          className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors text-sm w-full md:w-auto justify-center md:justify-start"
          onClick={() =>
            activeTab === "dish"
              ? handleEditDish({
                  id: Date.now(),
                  name: "Món Mới",
                  price: 0,
                  category: "Khác",
                  status: "Đang bán",
                  isAvailable: true,
                  promo: null,
                })
              : handleCreateToppingGroup()
          }
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {activeTab === "dish" ? "Thêm Món Mới" : "Thêm Nhóm Topping"}
        </button>
      </div>

      {/* Bảng/Danh sách món ăn hoặc Topping */}
      {activeTab === "dish" ? (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header/Cột tiêu đề */}
          <div className="hidden md:flex p-4 border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <div className="flex-1">Tên Món & Giá</div>
            <div className="w-40 text-center">Trạng Thái</div>
            <div className="w-20 text-center">Hành Động</div>
          </div>

          {/* Danh sách món ăn */}
          {menu.map((item, index) => (
            <MenuItem
              key={item.id}
              item={item}
              index={index}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditDish}
              onReorder={handleReorderGroups} // Mở modal sắp xếp nhóm món
            />
          ))}

          {/* Footer (Phân trang/Tóm tắt) */}
          <div className="p-4 flex justify-between items-center text-sm text-gray-500">
            <span>
              Hiển thị 1 đến {menu.length} trên {menu.length} món
            </span>
            <div className="space-x-2">
              <button className="p-2 border rounded-lg hover:bg-gray-100">
                Trước
              </button>
              <button className="p-2 border rounded-lg bg-orange-500 text-white">
                1
              </button>
              <button className="p-2 border rounded-lg hover:bg-gray-100">
                Sau
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ToppingListPage onEdit={handleEditToppingGroup} />
      )}

      {/* RENDER MODALS */}
      {modal.isOpen && modal.type === "edit_dish" && (
        <EditDishModal dish={modal.data} onClose={closeModal} />
      )}

      {modal.isOpen && modal.type === "reorder_groups" && (
        <ReorderGroupModal
          categories={modal.data}
          onSave={(newList) => console.log("Sắp xếp nhóm món mới:", newList)}
          onClose={closeModal}
        />
      )}

      {modal.isOpen && modal.type === "edit_topping_group" && (
        <ToppingGroupFormModal
          toppingGroup={modal.data} // null cho tạo mới, object cho chỉnh sửa
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Main App Component
const RestaurantDashboard = () => {
  const [currentPage, setCurrentPage] = useState("orders"); // Đặt mặc định là trang orders để test
  const storeName = "Cửa hàng A - Quán cơm văn phòng"; // Tên cửa hàng giả định

  const renderPage = () => {
    switch (currentPage) {
      case "menu":
        return <MenuManagementPage />;
      case "orders":
        return <OrdersPage />; // Trang mới
      case "home":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Trang Chủ Dashboard
            </h1>
            <p className="mt-4 text-gray-600">
              Tổng quan doanh thu, đơn hàng, chất lượng quán...
            </p>
            {/*  */}
            <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg">
              <p className="font-semibold">Mô phỏng giao diện Trang Chủ</p>
              <p className="text-sm">
                Trang này thường hiển thị tổng quan về doanh thu, chất lượng
                quán (Quality Score), và các thông báo quan trọng.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Đang Phát Triển
            </h1>
            <p className="mt-4 text-gray-600">
              Trang {currentPage.toUpperCase()} sẽ sớm được cập nhật!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Load Font Inter (Tailwind default) */}
      <style>
        {`
          body { font-family: 'Inter', sans-serif; }
          /* Tùy chỉnh cho mobile/footer menu */
          @media (max-width: 767px) {
            .main-content { padding-bottom: 60px; } /* Để footer không che mất nội dung */
          }
          /* Animation cho Toast */
          @keyframes slideIn {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
          }
        `}
      </style>

      <Header storeName={storeName} />
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="pt-20 md:ml-16 lg:ml-64 main-content">
        {renderPage()}
      </main>

      {/* Mobile Bottom Navigation (mô phỏng ứng dụng di động) */}
      <footer className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-lg z-20">
        <div className="flex justify-around items-center h-14">
          {[
            { name: "Trang Chủ", icon: Home, page: "home" },
            { name: "Thực Đơn", icon: Menu, page: "menu" },
            { name: "Đơn Hàng", icon: ClipboardList, page: "orders" },
            { name: "Tôi", icon: User, page: "settings" },
          ].map((item) => (
            <button
              key={item.name}
              className={`flex flex-col items-center justify-center p-1 transition-colors ${
                currentPage === item.page ? "text-orange-600" : "text-gray-500"
              }`}
              onClick={() => setCurrentPage(item.page)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default RestaurantDashboard;

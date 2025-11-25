import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/api";

const ORDER_STATUS = [
  "ALL",
  "PENDING",
  "ASSIGNED",
  "CONFIRMED",
  "FINISHED",
  "DELIVERING",
  "DELIVERED",
  "RECEIVED",
];

const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { jwt } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/order/myres`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) {
          console.error("Lỗi lấy orders:", res.status, await res.text());
          setLoading(false);
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jwt) fetchOrders();
  }, [jwt]);

  const handleClickOrder = (order) => {
    navigate(`/merchantadmin/orders/${order.id}`, { state: { order } });
  };

  const badgeColor = (status = "") => {
    const s = String(status).toLowerCase();
    if (s.includes("pending")) return "bg-amber-50 text-amber-700 border-amber-300";
    if (s.includes("assigned")) return "bg-indigo-50 text-indigo-700 border-indigo-300";
    if (s.includes("confirmed") || s.includes("finished")) return "bg-emerald-50 text-emerald-700 border-emerald-300";
    if (s.includes("delivering") || s.includes("delivered") || s.includes("received")) return "bg-sky-50 text-sky-700 border-sky-300";
    if (s.includes("cancel")) return "bg-rose-50 text-rose-700 border-rose-300";
    return "bg-slate-100 text-slate-600 border-slate-300";
  };

  // Helper to safely get a customer's name from order (try common fields)
  const getCustomerName = (order) => {
    return (
      order?.customer?.fullName ||
      order?.customerName ||
      order?.user?.fullName ||
      order?.userName ||
      order?.receiverName ||
      order?.contactName ||
      "Khách"
    );
  };

  // Filtering by search + status
  const filteredOrders = orders.filter((order) => {
    // name match
    const name = String(getCustomerName(order)).toLowerCase();
    const matchesName = name.includes(search.trim().toLowerCase());

    // status match
    const status = String(order.orderStatus || "").toUpperCase();
    const matchesStatus = statusFilter === "ALL" || status === statusFilter;

    return matchesName && matchesStatus;
  });

  // Totals
  const totalOrders = orders.length;
  const today = new Date();
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };
  const ordersToday = orders.filter((o) => {
    if (!o.createdAt) return false;
    const d = new Date(o.createdAt);
    return isSameDay(d, today);
  }).length;
  const ordersThisMonth = orders.filter((o) => {
    if (!o.createdAt) return false;
    const d = new Date(o.createdAt);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
  }).length;

  if (loading) {
    return (
      <div className="p-6 text-gray-700">Đang tải danh sách đơn hàng...</div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-6">
        <div className="text-center py-10 rounded-xl border border-dashed border-gray-300 bg-gray-50">
          <div className="text-4xl mb-3">📭</div>
          <h2 className="text-xl font-semibold text-gray-800">Chưa có đơn hàng nào</h2>
          <p className="text-sm text-gray-500 mt-1">Khi có khách đặt món, đơn hàng sẽ xuất hiện tại đây.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của nhà hàng bạn</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý các đơn hàng khách đã đặt tại nhà hàng của bạn.</p>
      </div>

      {/* Controls + totals */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-black"
          >
            {ORDER_STATUS.map((s) => (
              <option key={s} value={s} className="text-black">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 text-sm">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500">Tổng đơn</div>
            <div className="font-semibold text-lg text-gray-900">{totalOrders}</div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500">Trong hôm nay ({new Date().toLocaleDateString('vi-VN')})</div>
            <div className="font-semibold text-lg text-gray-900">{ordersToday}</div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="text-xs text-gray-500">Trong tháng ({new Date().getMonth() + 1}/{new Date().getFullYear()})</div>
            <div className="font-semibold text-lg text-gray-900">{ordersThisMonth}</div>
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const createdAt = order.createdAt
            ? new Date(order.createdAt).toLocaleString("vi-VN")
            : "---";

          const customerName = getCustomerName(order);

          return (
            <div
              key={order.id}
              onClick={() => handleClickOrder(order)}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow">
                {String(order.id).slice(-1)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-black text-sm md:text-base">Đơn hàng #{order.id}</div>

                <div className="text-sm text-gray-600">
                  <b>Tên khách:</b> <span className="text-black">{customerName}</span>
                </div>

                <div className="text-sm text-gray-600">
                  <b>Ngày đặt:</b> <span className="text-black">{createdAt}</span>
                </div>
              </div>

              <div className="text-right flex flex-col gap-2">
                <span
                  className={`px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wide ${badgeColor(order.orderStatus)}`}
                >
                  {order.orderStatus || "Không rõ"}
                </span>

                <div className="text-sm text-gray-700">
                  <b>Tổng:</b>{' '}
                  <span className="text-black">
                    {((order.totalAmount ?? order.totalPrice ?? 0) + 15000).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="p-4 bg-white border rounded-lg text-center text-sm text-gray-600">Không tìm thấy đơn hàng phù hợp.</div>
        )}
      </div>
    </div>
  );
};

export default MerchantOrders;

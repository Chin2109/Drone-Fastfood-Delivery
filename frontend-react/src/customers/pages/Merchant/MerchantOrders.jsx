// src/pages/Merchant/MerchantOrders.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { jwt } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5454/api/order/myres", {
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

  // Badge màu cho trạng thái (UI only – logic giữ nguyên)
  const badgeColor = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("pending") || s.includes("processing"))
      return "bg-amber-50 text-amber-700 border-amber-300";
    if (s.includes("cancel"))
      return "bg-rose-50 text-rose-700 border-rose-300";
    if (s.includes("delivered") || s.includes("completed"))
      return "bg-emerald-50 text-emerald-700 border-emerald-300";
    return "bg-slate-100 text-slate-600 border-slate-300";
  };

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
          <h2 className="text-xl font-semibold text-gray-800">
            Chưa có đơn hàng nào
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Khi có khách đặt món, đơn hàng sẽ xuất hiện tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Đơn hàng của nhà hàng bạn
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý các đơn hàng khách đã đặt tại nhà hàng của bạn.
        </p>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {orders.map((order) => {
          const createdAt = order.createdAt
            ? new Date(order.createdAt).toLocaleString("vi-VN")
            : "---";

          return (
            <div
              key={order.id}
              onClick={() => handleClickOrder(order)}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer 
                         hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200"
            >
              {/* Avatar chữ cái đầu của user hoặc đơn hàng */}
              <div className="w-14 h-14 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow">
                {String(order.id).slice(-1)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm md:text-base">
                  Đơn hàng #{order.id}
                </div>

                <div className="text-sm text-gray-600">
                  <b>Mã đơn hàng:</b> {order.id}
                </div>

                <div className="text-sm text-gray-600">
                  <b>Ngày đặt:</b> {createdAt}
                </div>
              </div>

              {/* Status + total */}
              <div className="text-right flex flex-col gap-2">
                <span
                  className={`px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wide ${badgeColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus || "Không rõ"}
                </span>

                <div className="text-sm text-gray-700">
                  <b>Tổng:</b>{" "}
                  {(order.totalAmount + 15000 ?? order.totalPrice + 15000 ?? 0).toLocaleString(
                    "vi-VN"
                  )}
                  ₫
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MerchantOrders;

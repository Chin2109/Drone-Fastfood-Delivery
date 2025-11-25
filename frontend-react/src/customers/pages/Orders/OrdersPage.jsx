import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { jwt, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/order/my`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Lỗi lấy orders:", res.status, text);
          setLoading(false);
          return;
        }

        const data = await res.json();
        // giả sử backend trả mảng orders luôn
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jwt) {
      fetchOrders();
    }
  }, [jwt]);

  const handleClickOrder = (order) => {
    // chuyển sang trang chi tiết, kèm theo data order trong state
    navigate(`/my-profile/orders/${order.id}`, { state: { order } });
  };

  // style badge cho status (chỉ là UI, không đổi logic)
  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("pending") || s.includes("processing")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (s.includes("cancel")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (s.includes("delivered") || s.includes("completed") || s.includes("success")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Đơn hàng của bạn
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Đang tải danh sách đơn hàng, vui lòng chờ một chút...
          </p>
        </div>

        {/* skeleton loading */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/60 animate-pulse"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-3 rounded bg-gray-200" />
                <div className="w-40 h-3 rounded bg-gray-200" />
                <div className="w-24 h-3 rounded bg-gray-200" />
              </div>
              <div className="w-20 h-4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 text-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
            <span className="text-2xl">🛒</span>
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Bạn chưa có đơn hàng nào
          </h2>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            Khi bạn đặt món trên DroneFastFood, lịch sử đơn hàng sẽ hiển thị tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Đơn hàng của bạn
          </h1>
          <p className="text-sm text-white/80 mt-1">
            Xem lại các đơn hàng gần đây và theo dõi trạng thái giao hàng.
          </p>
        </div>
        <div className="text-xs md:text-sm text-white/80">
          Tổng số đơn hàng:{" "}
          <span className="font-semibold text-white">{orders.length}</span>
        </div>
      </div>


      {/* List orders */}
      <div className="space-y-3">
        {orders.map((order) => {
          const createdAt = order.createdAt
            ? new Date(order.createdAt).toLocaleString("vi-VN")
            : "---";

          const restaurantName =
            order.restaurant?.name || "Không rõ nhà hàng";

          const amount =
            (order.totalAmount + 15000 ?? order.totalPrice + 15000 ?? 0).toLocaleString(
              "vi-VN"
            );

          return (
            <div
              key={order.id}
              onClick={() => handleClickOrder(order)}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] cursor-pointer hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)] hover:border-emerald-100 hover:bg-emerald-50/40 transition-all duration-200"
            >
              {/* Avatar nhà hàng */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {restaurantName.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-sm font-semibold text-gray-900">
                    Đơn hàng #{order.id}
                  </span>
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {restaurantName}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Ngày đặt: {createdAt}
                </div>
              </div>

              {/* Status + total */}
              <div className="text-right flex flex-col items-end gap-1">
                <span
                  className={
                    "px-2.5 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wide " +
                    getStatusClass(order.orderStatus)
                  }
                >
                  {order.orderStatus || "Không rõ trạng thái"}
                </span>
                <div className="text-sm text-gray-600">
                  Tổng:{" "}
                  <span className="font-semibold text-gray-900">
                    {amount}₫
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { jwt, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5454/api/order/my", {
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

  if (loading) {
    return <div className="p-6">Đang tải danh sách đơn hàng...</div>;
  }

  if (!orders.length) {
    return <div className="p-6">Bạn chưa có đơn hàng nào.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của bạn</h1>

      <div className="space-y-3">
        {orders.map((order) => {
          const createdAt = order.createdAt
            ? new Date(order.createdAt).toLocaleString("vi-VN")
            : "---";

          // tuỳ cấu trúc Restaurant của bạn
          const restaurantName = order.restaurant?.name || "Không rõ nhà hàng";
          const restaurantImage =
            order.restaurant?.image ||
            order.restaurant?.logo ||
            "https://via.placeholder.com/80x80?text=Restaurant";

          return (
            <div
              key={order.id}
              onClick={() => handleClickOrder(order)}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50 transition"
            >
              <img
                src={restaurantImage}
                alt={restaurantName}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold">
                  Đơn hàng #{order.id}
                </div>
                <div className="text-sm text-gray-500">
                  {restaurantName}
                </div>
                <div className="text-sm text-gray-500">
                  Ngày đặt: {createdAt}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-sm font-semibold uppercase"
                >
                  {order.orderStatus}
                </div>
                <div className="text-sm text-gray-500">
                  Tổng: {(order.totalAmount ?? order.totalPrice ?? 0).toLocaleString("vi-VN")}₫
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

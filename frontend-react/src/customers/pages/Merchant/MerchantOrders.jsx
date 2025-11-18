// src/pages/Merchant/MerchantOrders.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MerchantOrders = () => {
  const { jwt } = useSelector((s) => s.auth);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ví dụ: GET /api/merchant/orders
        const res = await fetch("http://localhost:5454/api/merchant/orders", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        console.error("Lỗi lấy orders merchant:", e);
      }
    };

    if (jwt) fetchOrders();
  }, [jwt]);

  if (!orders.length) return <div>Chưa có đơn hàng nào.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của nhà hàng</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded-lg shadow p-4 flex justify-between">
            <div>
              <div className="font-semibold">Đơn #{o.id}</div>
              <div className="text-sm text-gray-500">
                Khách: {o.customerName}
              </div>
              <div className="text-sm text-gray-500">
                Ngày đặt: {o.createdAt}
              </div>
            </div>
            <div className="text-right">
              <div className="uppercase text-sm font-semibold">{o.status}</div>
              <div className="text-sm text-gray-500">
                Tổng: {o.totalFormatted}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantOrders;

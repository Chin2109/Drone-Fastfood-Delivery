import { CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { formatCurrency } from "../../util/formartCurrency";
import OrderRouteMap from "../../components/Address/OrderRouteMap";
import { API_URL } from "../../../config/api";

const MerchantOrderDetail = () => {
  const { orderId } = useParams();
  const { jwt } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/api/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Lỗi lấy chi tiết đơn hàng:", res.status, text);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Fetch order detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jwt && orderId) fetchOrderDetail();
  }, [jwt, orderId]);

  if (loading) return <div className="p-6">Đang tải chi tiết đơn hàng...</div>;
  if (!order) return <div className="p-6">Không tìm thấy đơn hàng.</div>;

  // ===== Chuẩn hoá trạng thái với enum mới =====
  // OrderStatus: PENDING, ASSIGNED, CONFIRMED, FINISHED, DELIVERING, DELIVERED, RECEIVED
  const rawStatus = order.orderStatus || order.status || "PENDING";

  // Nếu backend cũ trả nhầm kiểu "CONFIRM" thì map sang "CONFIRMED"
  const legacyStatusMap = { CONFIRM: "CONFIRMED" };
  const status = legacyStatusMap[rawStatus] || rawStatus;

  const getStatusText = (s) => {
    switch (s) {
      case "PENDING":
        return "Đã tạo đơn hàng, chờ nhà hàng xác nhận";
      case "ASSIGNED":
        return "Admin đã gán drone cho đơn, chờ nhà hàng xác nhận";
      case "CONFIRMED":
        return "Nhà hàng đã xác nhận, đang chuẩn bị món ăn";
      case "FINISHED":
        return "Nhà hàng đã chuẩn bị xong món, chờ admin cho drone bay";
      case "DELIVERING":
        return "Drone đang giao hàng tới khách";
      case "DELIVERED":
        return "Drone đã giao đến vị trí khách, chờ khách xác nhận";
      case "RECEIVED":
        return "Khách đã nhận hàng thành công";
      default:
        return s ? `Trạng thái: ${s}` : "Đang cập nhật...";
    }
  };

  // ===== Action dành cho merchant =====
  // Merchant có thể bấm:
  // - PENDING  -> "Xác nhận đơn hàng" -> CONFIRMED
  // - CONFIRMED -> "Đã chuẩn bị món"  -> FINISHED
  const getActionByStatus = (s) => {
    switch (s) {
      case "PENDING":
        return { label: "Xác nhận đơn hàng", nextStatus: "CONFIRMED" };
      case "CONFIRMED":
        return { label: "Đã chuẩn bị món", nextStatus: "FINISHED" };
      default:
        return null;
    }
  };

  const currentAction = getActionByStatus(status);

  const handleChangeStatus = async () => {
    if (!currentAction || updatingStatus) return;

    try {
      setUpdatingStatus(true);

      const res = await fetch(
        `${API_URL}/api/order/${order.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          // backend đang đọc "status" là String → dùng luôn
          body: JSON.stringify({ status: currentAction.nextStatus }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Lỗi cập nhật trạng thái:", res.status, text);
        return;
      }

      const updated = await res.json();
      const newStatus = updated.orderStatus || updated.status;

      setOrder((prev) => ({
        ...prev,
        orderStatus: newStatus,
        status: newStatus,
      }));
    } catch (err) {
      console.error("Lỗi gọi API cập nhật trạng thái:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl md:rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-white">
          <h1 className="text-2xl font-bold text-gray-900">
            Đơn hàng #{order.id}
          </h1>
          <p className="text-md text-gray-500 mt-1">{order.merchantName}</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Địa chỉ giao */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <MapPin className="w-5 h-5 mr-2 text-red-500" /> Giao đến
            </h2>
            <div className="space-y-2 text-black">
              <div>
                <span className="font-semibold">Địa chỉ giao hàng: </span>
                {order.deliveryAddress || "Không có địa chỉ"}
              </div>

              <OrderRouteMap
                restaurant={order.restaurant}
                deliveryLat={order.deliveryLat}
                deliveryLng={order.deliveryLng}
              />
            </div>
          </section>

          {/* Tóm tắt đơn hàng */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-gray-600" />
              Tóm tắt đơn hàng
            </h2>
            <div className="space-y-1 text-black text-sm">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>{item.totalPriceFormatted}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Thanh toán */}
          <section className="border-b pb-4">
            <h2 className="text-xl font-semibold flex items-center text-gray-800">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Thanh toán qua VNPay
            </h2>
          </section>

          {/* Thông tin thanh toán + trạng thái */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-green-500" />
              Thông tin thanh toán
            </h2>
            <div className="space-y-2 text-black">
              <div>Phí đơn hàng: {formatCurrency(order.subtotal)}</div>
              {/* tuỳ logic của bạn, tạm giữ như cũ */}
              <div>
                Phí giao hàng: {formatCurrency(order.deliveryFee + 15000)}
              </div>
              <div className="font-bold text-lg mt-2">
                Tổng tiền: {formatCurrency(order.finalTotal + 15000)}
              </div>
              <div className="mt-2">
                <span className="font-semibold">Trạng thái đơn hàng: </span>
                <span className="uppercase">{getStatusText(status)}</span>
              </div>
            </div>
          </section>

          {/* Nút hành động cho merchant */}
          {currentAction && (
            <button
              disabled={updatingStatus}
              onClick={handleChangeStatus}
              className={`flex-1 w-full py-3 font-bold rounded-lg shadow-lg text-base sm:text-lg transition duration-150 ${
                updatingStatus
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
              }`}
            >
              {updatingStatus ? "Đang cập nhật..." : currentAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantOrderDetail;

import { CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { formatCurrency } from "../../util/formartCurrency";
import OrderRouteMap from "../Address/OrderRouteMap";
import { API_URL } from "../../../config/api";

const OrderDetail = () => {
  const { orderId } = useParams();
  const { jwt } = useSelector((state) => state.auth || {});

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // droneArrived: dùng cho UX — khi map báo drone đã tới
  const [droneArrived, setDroneArrived] = useState(false);
  const [updatingDelivered, setUpdatingDelivered] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!jwt || !orderId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Lỗi lấy chi tiết đơn hàng:", res.status, text);
        setOrder(null);
        return;
      }

      const data = await res.json();
      setOrder(data);

      // Nếu backend trả về DELIVERED hoặc RECEIVED thì coi như drone đã tới
      const s = data.orderStatus || data.status || "PENDING";
      if (s === "DELIVERED" || s === "RECEIVED") {
        setDroneArrived(true);
      } else {
        // nếu backend chưa nói DELIVERED, giữ trạng thái trước (không reset droneArrived)
        // (do map có thể thông báo trước khi backend cập nhật)
      }
    } catch (err) {
      console.error("Fetch order detail error:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [jwt, orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  if (loading) {
    return <div className="p-6">Đang tải chi tiết đơn hàng...</div>;
  }

  if (!order) {
    return <div className="p-6">Không tìm thấy đơn hàng.</div>;
  }

  // Ưu tiên orderStatus từ backend
  const status = order.orderStatus || order.status || "PENDING";

  // Logic hiển thị:
  const isDelivering = status === "DELIVERING"; // drone đang bay
  const isAwaitingCustomerConfirm = status === "DELIVERED"; // drone đã tới, chờ user bấm đã nhận
  const isReceived = status === "RECEIVED"; // user đã nhận xong

  const // helper to show button when either server says DELIVERED OR local map says arrived
    shouldShowConfirmButton =
      isAwaitingCustomerConfirm || (isDelivering && droneArrived);

  const getStatusText = (s) => {
    switch (s) {
      case "PENDING":
        return "Đã tạo đơn hàng, chờ nhà hàng xác nhận";
      case "ASSIGNED":
        return "Admin đã gán drone cho đơn, chờ nhà hàng xác nhận";
      case "CONFIRMED":
        return "Nhà hàng đã xác nhận, đang chuẩn bị món ăn";
      case "FINISHED":
        return "Nhà hàng đã chuẩn bị xong món, chờ drone bắt đầu bay";
      case "DELIVERING":
        return "Drone đang giao hàng, vui lòng chờ trong giây lát...";
      case "DELIVERED":
        return "Drone đã tới vị trí giao hàng, vui lòng tới nhận và xác nhận";
      case "RECEIVED":
        return "Bạn đã nhận hàng thành công";
      default:
        return s ? `Trạng thái: ${s}` : "Đang cập nhật...";
    }
  };

  const handleConfirmDelivered = async () => {
    // Chỉ cho bấm khi không đang gửi request
    if (updatingDelivered) return;

    // If we don't have order.id (should), use orderId param
    const id = order.id ?? orderId;
    if (!id) {
      console.error("Không có order id để gửi cập nhật RECEIVED");
      return;
    }

    try {
      setUpdatingDelivered(true);

      const res = await fetch(`${API_URL}/order/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        // server expects "status" key; new enum value is RECEIVED
        body: JSON.stringify({ status: "RECEIVED" }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Lỗi cập nhật trạng thái RECEIVED:", res.status, text);
        return;
      }

      const updated = await res.json();
      const newStatus = updated.orderStatus || updated.status || "RECEIVED";

      // Cập nhật local order state ngay
      setOrder((prev) => ({
        ...prev,
        status: newStatus,
        orderStatus: newStatus,
      }));

      // đã nhận hàng rồi thì chắc chắn droneArrived = true
      setDroneArrived(true);
    } catch (err) {
      console.error("Lỗi gọi API cập nhật RECEIVED:", err);
    } finally {
      setUpdatingDelivered(false);
    }
  };

  // Called from map when drone reaches customer (map may call even if backend hasn't updated)
  const handleDroneArrived = async () => {
    setDroneArrived(true);

    // set local status to DELIVERED for immediate UX if server not yet updated
    setOrder((prev) => ({
      ...prev,
      status: prev?.status === "RECEIVED" ? "RECEIVED" : "DELIVERED",
      orderStatus: prev?.orderStatus === "RECEIVED" ? "RECEIVED" : "DELIVERED",
    }));

    // Try refresh from server after a short delay (backend might auto-update)
    setTimeout(() => {
      fetchOrderDetail();
    }, 1500);

    // also notify parent UI if needed
    // (OrderRouteMap may also call this prop)
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl md:rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-white">
          <h1 className="text-2xl font-bold text-gray-900">
            Đơn hàng #{order.id || "----"}
          </h1>
          <p className="text-md text-gray-500 mt-1">{order.merchantName}</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Địa chỉ + route + drone */}
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
                orderId={order.id}
                status={status}
                onDroneArrived={handleDroneArrived}
              />

              {/* Informational messages */}
              {isDelivering && !droneArrived && (
                <p className="text-sm text-blue-600 font-medium mt-2">
                  Drone đang bay tới bạn, vui lòng chờ trong giây lát...
                </p>
              )}

              {(isDelivering && droneArrived) || isAwaitingCustomerConfirm ? (
                <p className="text-sm text-green-600 font-medium mt-2">
                  Drone đã đến! Vui lòng ra vị trí nhận hàng và bấm "Đã nhận được
                  hàng".
                </p>
              ) : null}

              {/* if status is DELIVERED show a small badge */}
              {(status === "DELIVERED" || (droneArrived && status !== "RECEIVED")) && (
                <div className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                  DELIVERED
                </div>
              )}

              {status === "RECEIVED" && (
                <div className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                  RECEIVED
                </div>
              )}
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

          {/* Hình thức thanh toán */}
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
              <div>Phí giao hàng: {formatCurrency(15000)}</div>
              <div className="font-bold text-lg mt-2">
                Tổng tiền: {formatCurrency((order.finalTotal || 0) + 15000)}
              </div>
              <div className="mt-2">
                <span className="font-semibold">Trạng thái đơn hàng: </span>
                <span className="uppercase">{getStatusText(status)}</span>
              </div>
            </div>
          </section>

          {/* Nút xác nhận đã nhận hàng:
              - Hiển thị khi server báo DELIVERED OR when droneArrived true while status still DELIVERING */}
          {shouldShowConfirmButton && (
            <button
              disabled={updatingDelivered}
              onClick={handleConfirmDelivered}
              className={`flex-1 w-full py-3 font-bold rounded-lg shadow-lg text-base sm:text-lg transition duration-150 
              ${
                updatingDelivered
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
              }`}
            >
              {updatingDelivered ? "Đang cập nhật..." : "Đã nhận được hàng"}
            </button>
          )}

          {/* Thông báo khi đơn đã RECEIVED */}
          {isReceived && (
            <div className="mt-2 text-center text-green-600 font-semibold">
              Đơn hàng đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
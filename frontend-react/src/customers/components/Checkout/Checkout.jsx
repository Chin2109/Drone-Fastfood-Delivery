import { CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getAllCartItems } from "../../../State/Customers/Cart/cart.action";
import { checkoutPreview } from "../../../State/Customers/Orders/Action";
import { getRestaurantById } from "../../../State/Customers/Restaurant/restaurant.action";

import Cart from "../../pages/Cart/Cart";
import { formatCurrency } from "../../util/formartCurrency";
import AddressPicker from "../Address/AddressPicker";
import SpecialInstruction from "../Product/SpecialInstruction";

export default function Checkout() {
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { id } = useParams();
  const { jwt } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { restaurant } = useSelector((state) => state.restaurant);
  const order = useSelector((state) => state.order.previews);

  useEffect(() => {
    if (!id || !jwt) return;
    dispatch(getAllCartItems({ merchantId: id, jwt }));
    dispatch(getRestaurantById(id));
  }, [dispatch, id, jwt]);

  // khi user chọn địa chỉ (AddressPicker gọi onLocationSelected)
  const handleLocationSelected = (tempAddressData) => {
    // tempAddressData: { street, location: { type: "Point", coordinates: [lng, lat] }, distance }
    const coords = tempAddressData.location?.coordinates || [];
    const lng = coords[0];
    const lat = coords[1];

    const normalized = {
      address: tempAddressData.street || "Địa chỉ tạm",
      lng,
      lat,
      distance: tempAddressData.distance,
    };

    console.log("normalized address:", normalized, "raw:", tempAddressData);
    setSelectedAddress(normalized);

    dispatch(
      checkoutPreview({
        merchantId: id,
        order: {
          cartItemId: cart?.data?.items?.map((i) => i.id) || [],
          temporaryAddress: tempAddressData, // giữ nguyên format cho backend
          distance: tempAddressData.distance,
        },
        jwt,
      })
    );
  };

  const handlePayment = async () => {
    if (!order) {
      alert("Chưa có thông tin đơn hàng, vui lòng chọn địa chỉ.");
      return;
    }

    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    // thông tin địa chỉ đã chuẩn hoá
    const addressToSave = selectedAddress.address;
    const lng = selectedAddress.lng;
    const lat = selectedAddress.lat;

    if (!addressToSave || lng == null || lat == null) {
      console.error("selectedAddress bị thiếu field:", selectedAddress);
      alert("Thiếu thông tin địa chỉ (address/lng/lat).");
      return;
    }

    try {
      const amount = order?.finalTotal || 0;

      // lấy cartId từ dữ liệu giỏ hàng
      const cartId = cart?.data?.cartId;
      if (!cartId) {
        alert("Không tìm thấy cartId, vui lòng tải lại trang.");
        return;
      }

      // lưu thông tin cần để tạo order sau khi thanh toán thành công
      const orderCreatePayload = {
        cartId,
        address: addressToSave,
        lng,
        lat,
      };

      console.log("Lưu info tạo đơn sau thanh toán:", orderCreatePayload);
      sessionStorage.setItem(
        "orderCreateInfo",
        JSON.stringify(orderCreatePayload)
      );

      console.log("Gọi tới backend VNPay với amount:", amount);

      const res = await fetch(
        `http://localhost:5454/api/v1/payment/vn-pay?amount=${amount}&bankCode=NCB`,
        {
          method: "GET",
        }
      );

      console.log("Status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", res.status, text);
        alert(
          "Backend trả lỗi khi tạo paymentUrl VNPay, mở console để xem chi tiết."
        );
        return;
      }

      const data = await res.json();
      console.log("Data:", data);

      if (data?.paymentUrl) {
        // direct sang sandbox VNPay
        window.location.href = data.paymentUrl;
      } else {
        alert("Không tạo được link thanh toán VNPay (paymentUrl null).");
        console.error("data nhận được:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Có lỗi khi khởi tạo thanh toán VNPay (network/CORS).");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl md:rounded-xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 bg-white">
          <h1 className="text-2xl font-bold text-gray-900">
            Bước cuối cùng - Thanh toán
          </h1>
          <p className="text-md text-gray-500 mt-1">
            {cart?.data?.merchantName}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Địa chỉ giao hàng */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <MapPin className="w-5 h-5 mr-2 text-red-500" /> Giao đến
            </h2>
            <AddressPicker
              restaurant={restaurant}
              onLocationSelected={handleLocationSelected}
            />
          </section>

          {/* Tóm tắt đơn hàng */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-gray-600" />
              Tóm tắt đơn hàng
            </h2>
            <Cart />
            <SpecialInstruction />
          </section>

          {/* Hình thức thanh toán */}
          <section className="border-b pb-4">
            <h2 className="text-xl font-semibold flex items-center text-gray-800">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Thanh toán qua VNPay
            </h2>
          </section>

          {/* Thông tin thanh toán */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-green-500" />
              Thông tin thanh toán
            </h2>
            <div className="space-y-2 text-black">
              <div>Phí đơn hàng: {formatCurrency(order?.subtotal)}</div>
              <div>Phí giao hàng: {formatCurrency(order?.deliveryFee)}</div>
              <div className="font-bold text-lg mt-2">
                Tổng tiền: {formatCurrency(order?.finalTotal)}
              </div>
            </div>
          </section>

          <button
            onClick={handlePayment}
            className="flex-1 w-full py-3 font-bold rounded-lg shadow-lg text-base sm:text-lg transition duration-150 bg-green-500 text-white hover:bg-green-600"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

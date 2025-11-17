import { CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

import { getAllCartItems } from "../../../State/Customers/Cart/cart.action";
import {
  checkoutPreview,
  createOrder,
} from "../../../State/Customers/Orders/Action";
import { getRestaurantById } from "../../../State/Customers/Restaurant/restaurant.action";

import Cart from "../../pages/Cart/Cart";
import { formatCurrency } from "../../util/formartCurrency";
import AddressPicker from "../Address/AddressPicker";
import SpecialInstruction from "../Product/SpecialInstruction";


export default function Checkout() {
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState(null);

  const location = useLocation();
  const { id } = useParams();
  const { jwt, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { restaurant } = useSelector((state) => state.restaurant);
  const order = useSelector((state) => state.order.previews);
  useEffect(() => {
    dispatch(getAllCartItems({ merchantId: id, jwt: jwt }));
    dispatch(getRestaurantById(id));
  }, []);

    // 👇 NEW: khi VNPay redirect về /checkout?vnp_... thì tự tạo đơn hàng
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const vnpTxnRef = params.get("vnp_TxnRef"); // hoặc lấy bất kỳ param nào của VNPay

  //   if (vnpTxnRef && !hasCreatedOrder) {
  //     const storedOrder = sessionStorage.getItem("pendingOrder");
  //     if (storedOrder) {
  //       const orderPayload = JSON.parse(storedOrder);

  //       // luôn coi là thanh toán thành công => tạo đơn hàng
  //       dispatch(createOrder({ order: orderPayload, jwt }));

  //       // dọn dẹp
  //       sessionStorage.removeItem("pendingOrder");
  //       setHasCreatedOrder(true);

  //       // Xoá query VNPay khỏi URL cho sạch
  //       window.history.replaceState({}, document.title, location.pathname);
  //     }
  //   }
  // }, [location.search, hasCreatedOrder, dispatch, jwt]);

  const handleLocationSelected = (tempAddressData) => {
    setSelectedAddress(tempAddressData);
    console.log(selectedAddress, tempAddressData)
    dispatch(
      checkoutPreview({
        merchantId: id,
        order: {
          cartItemId: cart?.data?.items?.map((i) => i.id) || [],
          temporaryAddress: tempAddressData,
          distance: tempAddressData.distance,
        },
        jwt: jwt,
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

    try {
      const amount = order?.finalTotal || 0;

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
        alert("Backend trả lỗi khi tạo paymentUrl VNPay, mở console để xem chi tiết.");
        return;
      }

      const data = await res.json();
      console.log("Data:", data);

      if (data?.paymentUrl) {
        //direct sang sandbox VNPay
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
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <MapPin className="w-5 h-5 mr-2 text-red-500" /> Giao đến
            </h2>
            <AddressPicker
              restaurant={restaurant}
              onLocationSelected={handleLocationSelected}
            />
          </section>

          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-gray-600" />
              Tóm tắt đơn hàng
            </h2>
            <Cart />
            <SpecialInstruction />
          </section>

          {/* 3. Chi tiết thanh toán (Payment Details) */}
          <section className="border-b pb-4">
            <h2 className="text-xl font-semibold flex items-center text-gray-800">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Thanh toán qua stripe
            </h2>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-green-500" />
              Thông tin thanh toán
            </h2>
            <div className="space-y-2 text-black">
              <div>Phí đơn hàng: {formatCurrency(order?.subtotal)}</div>
              <div>Phí giao hàng: {formatCurrency(order?.deliveryFee)}</div>
              <div className="font-bold text-lg mt-2">
                Tổng tiền:
                {formatCurrency(order?.finalTotal)}
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

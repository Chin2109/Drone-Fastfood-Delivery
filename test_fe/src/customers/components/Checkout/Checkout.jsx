import React, { useState } from "react";
import {
  MapPin,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Info,
  ChevronDown,
  Smartphone,
} from "lucide-react";

// Dữ liệu giả định cho giao diện
const initialOrderSummary = {
  total: "147.000 đ",
  tempTotal: "132.000 đ",
  deliveryFee: "15.000 đ",
  note: "Muối Tiêu Đen | Chưa Pha Sẵn",
};

const promotions = [
  {
    name: "ZALOPAY | Giảm 10K, thêm ưu đãi bên dưới",
    code: "ZLPGAMENGAY",
    validity: "Áp dụng: 22/10/2025 - 31/12/2025",
    color: "bg-blue-50 border-blue-400 text-blue-800",
  },
  {
    name: "Thưởng 50 điểm | Quán Đặc Tuyển",
    code: "THUONGDIEM50",
    validity: "Áp dụng: 27/10/2025 - 03/11/2025",
    color: "bg-green-50 border-green-400 text-green-800",
  },
  {
    name: "Thưởng 50 điểm | 7h-9h",
    code: "THUONGDIEM50B",
    validity: "Áp dụng: 27/10/2025 - 03/11/2025",
    color: "bg-green-50 border-green-400 text-green-800",
  },
];

// Component con cho Thẻ Khuyến Mãi
const PromotionCard = ({ promo }) => (
  <div
    className={`flex-shrink-0 w-64 p-3 border rounded-xl shadow-sm ${promo.color}`}
  >
    <p className="text-sm font-semibold mb-1 truncate">{promo.name}</p>
    <p className="text-xs text-gray-600 mb-2">
      Promo Code: <span className="font-mono font-medium">{promo.code}</span>
    </p>
    <div className="flex justify-between items-end mt-3">
      <span className="text-[10px] text-gray-500">{promo.validity}</span>
      <button
        className={`px-3 py-1 text-xs font-semibold rounded-full border transition duration-200 hover:opacity-80
        ${
          promo.color.includes("blue")
            ? "border-blue-700 text-blue-700"
            : "border-green-700 text-green-700"
        }`}
      >
        APPLY
      </button>
    </div>
  </div>
);

// Component chính
const Checkout = () => {
  const [orderSummary, setOrderSummary] = useState(initialOrderSummary);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt"); // State cho phương thức thanh toán

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl md:rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-white">
          <h1 className="text-2xl font-bold text-gray-900">
            Bước cuối cùng - Thanh toán
          </h1>
          <p className="text-md text-gray-500 mt-1">
            Gà Hấp Mắm Nhĩ - Linh Food
          </p>
        </div>

        <div className="p-6 md:p-8 lg:p-10 space-y-10">
          {/* 1. Giao đến (Delivery) */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              Giao đến
            </h2>
            <p className="text-sm font-medium text-green-600 mb-6">
              30 phút (2,7 km away)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Map Placeholder */}
              <div className="h-40 bg-gray-200 rounded-xl relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Address Inputs */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  defaultValue="227 Nguyễn Văn Cừ, P.4, Q.5, TP.HCM"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Chi tiết địa chỉ (Ví dụ: Tầng 3, phòng 302)"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm"
                />
                <textarea
                  placeholder="Ghi chú cho tài xế"
                  rows="2"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-sm resize-none"
                />
              </div>
            </div>
          </section>

          {/* 2. Tóm tắt đơn hàng & Thanh toán (Summary & Pay) */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-gray-600" />
              Tóm tắt đơn hàng
            </h2>

            <div className="bg-green-50 p-5 rounded-xl border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-3xl font-extrabold text-green-600 mt-1">
                    {orderSummary.total}
                  </span>
                </div>
                <button className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-[1.02]">
                  Đặt đơn
                </button>
              </div>

              <p className="text-sm text-gray-700 border-t border-gray-200 pt-4 mb-4">
                <span className="font-medium text-gray-900">Chi tiết:</span>{" "}
                {orderSummary.note}
              </p>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Tổng tạm tính</span>
                  <span className="font-medium">{orderSummary.tempTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Phí áp dụng{" "}
                    <Info className="w-3 h-3 inline ml-1 text-gray-400" />
                  </span>
                  <span className="font-medium">
                    {orderSummary.deliveryFee}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Chi tiết thanh toán (Payment Details) */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Chi tiết thanh toán
            </h2>

            <div className="space-y-4">
              {/* Payment Method Selector */}
              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="appearance-none w-full p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
                >
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Thẻ tín dụng/ghi nợ">
                    Thẻ tín dụng/ghi nợ
                  </option>
                  <option value="Ví điện tử (Momo, ZaloPay)">
                    Ví điện tử (Momo, ZaloPay)
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Conditional inputs based on payment method */}
              {paymentMethod === "Thẻ tín dụng/ghi nợ" && (
                <input
                  type="text"
                  placeholder="Số thẻ"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
                />
              )}

              {/* Mã số - Giả định là mã giảm giá hoặc mã khách hàng */}
              <input
                type="text"
                placeholder="Mã số (nếu có)"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
              />

              {/* Loại tài khoản */}
              <div className="relative">
                <select className="appearance-none w-full p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm">
                  <option>Personal</option>
                  <option>Business</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </section>

          {/* 4. Khuyến mãi (Promotions) */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />
              Khuyến mãi
            </h2>

            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                placeholder="Nhập mã khuyến mãi"
                className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition shadow-sm"
              />
              <button className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition duration-300 active:scale-[0.98]">
                Áp dụng
              </button>
            </div>

            {/* Promotion Cards - Horizontal Scroll */}
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {promotions.map((promo, index) => (
                <PromotionCard key={index} promo={promo} />
              ))}
            </div>

            {/* Custom Scrollbar Hide for visual only */}
            <style jsx="true">{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
              }
            `}</style>
          </section>

          {/* Footer App Link & Copyright */}
          <div className="pt-6">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-shrink-0 mt-1">
                {/* Simplified Character Icon */}
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-xl shadow-md">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Dùng phương thức thanh toán khác để nhận ưu đãi hấp dẫn. Chỉ
                  có trên ứng dụng{" "}
                  <span className="font-bold text-green-600">Grab</span>.
                </p>
                <div className="flex space-x-4 mt-2 text-sm">
                  <a
                    href="#"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Google Play
                  </a>
                  <a
                    href="#"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Appstore
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright Links */}
            <div className="mt-8 text-center text-xs text-gray-500 space-x-4">
              <span>© 2025 Grab.</span>
              <a href="#" className="hover:underline">
                Câu hỏi thường gặp
              </a>
              <a href="#" className="hover:underline">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

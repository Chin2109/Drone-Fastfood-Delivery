import { MapPin, ShoppingCart } from "lucide-react";
import AddressPicker from "../Address/AddressPicker";

export default function Checkout() {
  const orderSummary = {
    total: "147.000 đ",
    tempTotal: "132.000 đ",
    deliveryFee: "15.000 đ",
    note: "Muối Tiêu Đen | Chưa Pha Sẵn",
  };

  const handleAddressChange = (address) => {
    console.log("Địa chỉ khách chọn:", address);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl md:rounded-xl overflow-hidden">
        <div className="p-8 border-b bg-white">
          <h1 className="text-2xl font-bold">Bước cuối cùng - Thanh toán</h1>
          <p className="text-md text-gray-500">Gà Hấp Mắm Nhĩ - Linh Food</p>
        </div>

        <div className="p-8 space-y-6">
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <MapPin className="w-5 h-5 mr-2 text-red-500" /> Giao đến
            </h2>
            <AddressPicker onAddressChange={handleAddressChange} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-green-500" /> Thanh
              toán
            </h2>
            <div className="space-y-2 text-black">
              <div>Subtotal: {orderSummary.tempTotal}</div>
              <div>Phí giao hàng: {orderSummary.deliveryFee}</div>
              <div>Note: {orderSummary.note}</div>
              <div className="font-bold text-lg mt-2">
                Total: {orderSummary.total}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

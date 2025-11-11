export const CartFooter = ({ formattedTotal, onClick }) => (
  <footer className="p-4 border-t border-gray-200 sticky bottom-0 bg-white shadow-2xl">
    <div className="flex justify-between items-center mb-4">
      <p className="text-lg font-bold text-gray-900">Tổng cộng</p>
      <p className="text-lg font-bold text-gray-900">{formattedTotal}</p>
    </div>
    <button className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 transform active:scale-[0.99]">
      Xem lại đơn hàng
    </button>
  </footer>
);
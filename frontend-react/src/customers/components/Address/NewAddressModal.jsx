import AddressPicker from "./AddressPicker";

const NewAddress = () => {
  // Các class Tailwind màu GrabFood
  const primaryColor = "bg-[#00B14F]";
  const primaryHover = "hover:bg-[#009A45]";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-inter">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className={`${primaryColor} text-white p-5`}>
          <h2 className="text-2xl font-bold">Thêm địa chỉ giao hàng mới</h2>
        </div>

        <form className="p-6 space-y-5">
          {/* Dropdown Tỉnh/Quận/Phường */}

          <AddressPicker />

          {/* Nút Submit */}
          <button
            type="submit"
            className={`w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200 ${primaryColor} ${primaryHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B14F]`}
          >
            Xác Nhận Địa Chỉ Giao Hàng
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAddress;

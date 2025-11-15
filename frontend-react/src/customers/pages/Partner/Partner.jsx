import React, { useState, useCallback } from "react";

// Cấu hình Tailwind CSS CDN được giả định là đã tải trước trong môi trường này.

/**
 * Component Form Đăng Ký Đối Tác Đơn Giản, lấy cảm hứng từ Grab.
 * Chỉ bao gồm Email và Địa chỉ.
 */
const Partner = () => {
  // State quản lý dữ liệu form
  const [form, setForm] = useState({
    email: "",
    address: "",
  });

  // State cho thông báo trạng thái
  const [status, setStatus] = useState({ message: "", type: "" }); // type: 'success' | 'error'
  const [isLoading, setIsLoading] = useState(false);

  // Helper cho việc cập nhật form
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  }, []);

  // Hàm xử lý submit form (sử dụng mock API để mô phỏng gửi dữ liệu)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: "", type: "" });

    // Kiểm tra cơ bản
    if (!form.email || !form.address) {
      setStatus({
        message: "Vui lòng nhập đầy đủ Email và Địa chỉ.",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    // Giả lập gửi dữ liệu lên server (sử dụng một API giả lập cho form đơn giản này)
    const mockApiEndpoint = "/api/v1/simple-partner-signup";

    try {
      const response = await fetch(mockApiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Giả lập gửi dữ liệu JSON
        body: JSON.stringify(form),
      });

      // Giả lập kết quả thành công sau 1.5 giây
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Giả sử API luôn thành công trong trường hợp mock này,
      // hoặc xử lý response thực tế nếu có:
      if (!response.ok) {
        // Xử lý lỗi nếu có
        const errorData = await response.json();
        throw new Error(errorData.message || "Gửi đăng ký thất bại.");
      }

      // Thành công
      setStatus({
        message: "Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn qua Email.",
        type: "success",
      });
      setForm({ email: "", address: "" }); // Xóa form sau khi gửi thành công
    } catch (err) {
      console.error("Lỗi gửi hồ sơ:", err);
      setStatus({
        message: err.message || "Đã xảy ra lỗi không xác định.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper cho giao diện Status Message
  const renderStatusMessage = () => {
    if (!status.message) return null;

    const baseClasses = "p-3 mt-4 rounded-lg text-sm font-semibold shadow-md";
    const successClasses =
      "bg-green-100 text-green-800 border border-green-300";
    const errorClasses = "bg-red-100 text-red-800 border border-red-300";

    return (
      <div
        className={`${baseClasses} ${
          status.type === "success" ? successClasses : errorClasses
        }`}
        role="alert"
      >
        {status.message}
      </div>
    );
  };

  // Class chung cho các input để đảm bảo giao diện Grab
  const inputClass =
    "px-4 py-3 text-black border-2 border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out text-base w-full placeholder-gray-400";
  const labelClass = "text-sm font-medium text-gray-600 mb-1 block";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        <header className="mb-8 text-center">
          <svg
            className="w-10 h-10 text-green-600 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M3 14h18m-9-4v8m-9-4h9"
            ></path>
          </svg>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Trở thành Đối tác của Grab
          </h1>
          <p className="text-gray-500 mt-2 text-md">
            Điền thông tin cơ bản để chúng tôi có thể liên hệ.
          </p>
        </header>

        {renderStatusMessage()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Địa chỉ email hợp lệ"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Address Input */}
          <div className="flex flex-col">
            <label htmlFor="address" className={labelClass}>
              Địa chỉ Cửa hàng/Kinh doanh{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Ví dụ: 123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM"
              value={form.address}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* NÚT SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-6 text-white font-bold text-lg rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.01]
              ${
                isLoading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-green-500/50"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang gửi...
              </span>
            ) : (
              "Đăng Ký Ngay"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Partner;

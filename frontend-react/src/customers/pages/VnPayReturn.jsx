import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VnPayReturn() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("vnp_ResponseCode");

      if (code === "00") {
        try {
          // Lấy thông tin đã lưu trước khi redirect sang VNPay
          const raw = sessionStorage.getItem("orderCreateInfo");

          if (!raw) {
            alert("Thanh toán thành công, nhưng không tìm thấy thông tin tạo đơn.");
            console.error("Không có orderCreateInfo trong sessionStorage");
            navigate("/");
            return;
          }

          const payload = JSON.parse(raw);
          console.log("Tạo order với payload:", payload);

          const res = await fetch("http://localhost:5454/api/order/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });


          const order = await res.json();
          console.log("Order tạo thành công:", order);

          // dọn dẹp
          sessionStorage.removeItem("orderCreateInfo");

          alert("Thanh toán thành công và đã tạo đơn hàng!");
          // chuyển tới trang success / chi tiết đơn:
          navigate("/payment-success");
          // hoặc navigate(`/orders/${order.id}`);
        } catch (err) {
          console.error("Lỗi khi gọi API tạo order:", err);
          navigate("/");
        }
      } else {
        alert("Thanh toán thất bại!");
        navigate("/");
      }
    };

    run();
  }, [location.search, navigate]);

  return <div>Đang xử lý...</div>;
}

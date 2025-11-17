import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VnPayReturn() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("vnp_ResponseCode");

    if (code === "00") {
      alert("Thanh toán thành công!");
    } else {
      alert("Thanh toán thất bại!");
    }

    // Optionally về trang home
    // navigate("/");
  }, []);

  return <div>Đang xử lý...</div>;
}

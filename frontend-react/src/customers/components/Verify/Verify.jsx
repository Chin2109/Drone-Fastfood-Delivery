import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { verify } from "../../../State/Authentication/Action";

const Verify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth?.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Mã OTP phải có 6 chữ số");
      return;
    }
    setLoading(true);

    try {
      dispatch(
        verify({ userData: { otp: otp, email: user?.data?.email }, navigate })
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute inset-0 bg-cover bg-center" />
      <div className="absolute inset-0 bg-white opacity-70" />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="relative z-10 bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Xác thực tài khoản
          </h2>
          <p className="text-gray-600 mt-2">
            Chúng tôi đã gửi mã OTP 6 số đến email
            <br />
            <span className="font-medium text-gray-900">
              {user?.data?.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Mã OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Nhập 6 chữ số"
              maxLength={6}
              className="w-full text-black mt-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-center text-lg tracking-[0.5em]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Đang kiểm tra..." : "Xác thực"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mt-4">
            <Link to="/login/customer" className="hover:underline">
              Quay lại Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;

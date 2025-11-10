import { ErrorMessage, Field, Form, Formik } from "formik";
import { CheckCircle, Eye, EyeOff } from "lucide-react"; // Sử dụng lucide-react cho icons
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { loginUser } from "../../../State/Authentication/Action";


// --- Cấu hình Formik và Validation (Giữ nguyên logic cũ) ---
const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Định dạng email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string().required("Mật khẩu là bắt buộc"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Login form values:", values);
    setSubmitting(true);
    dispatch(loginUser({ data: values, navigate }));
  };

  // Custom Input Field Component để tích hợp ErrorMessage và Tailwind
  const CustomInputField = ({
    field,
    form: { touched, errors },
    label,
    placeholder,
    type,
    children,
  }) => {
    const isError = touched[field.name] && errors[field.name];

    return (
      <div className="mb-5">
        <label
          htmlFor={field.name}
          className="block text-left text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <div className="relative">
          <input
            {...field}
            id={field.name}
            type={type === "password" && showPassword ? "text" : type}
            placeholder={placeholder}
            className={`
              w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none  transition-all duration-150 text-black
              ${isError ? "border-red-500" : "border-gray-300"}
            `}
          />
          {children} {/* Dành cho nút toggle password */}
        </div>
        {isError && (
          <p className="text-sm text-red-500 mt-1">
            <ErrorMessage name={field.name} />
          </p>
        )}
      </div>
    );
  };

  return (
    // Dùng Tailwind CSS cho toàn bộ layout
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      {/* Main Container Card */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden relative z-10">
        {/* Left side: Information/Branding */}
        <div
          className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-10 relative bg-emerald-600/90"
          style={{
            backgroundImage: "url('/img1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-center">
            <CheckCircle size={48} className="mx-auto mb-4 text-white" />
            <h2 className="text-4xl font-extrabold mb-4">
              FOOD DELIVERY LOGIN
            </h2>
            <p className="text-center text-md font-light opacity-90">
              Đăng nhập để tiếp tục trải nghiệm đặt món nhanh chóng và tiện lợi.
            </p>
          </div>
        </div>

        {/* Right side: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Đăng nhập tài khoản
          </h3>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Email Field */}
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Nhập địa chỉ email của bạn"
                  component={CustomInputField}
                />

                {/* Password Field */}
                <Field
                  name="password"
                  type="password"
                  label="Mật khẩu"
                  placeholder="********"
                  component={CustomInputField}
                >
                  {/* Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 bg-transparent hover:text-emerald-600 transition-colors focus:outline-none"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </Field>

                {/* Submit button (Giữ nguyên fullWidth và style) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full font-semibold py-3 rounded-lg text-white transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                  `}
                >
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Footer (Giữ nguyên đường dẫn '/account/register') */}
          <p className="text-sm text-gray-600 text-center mt-8">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors focus:outline-none"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Xuất component App làm default export
export default LoginForm;

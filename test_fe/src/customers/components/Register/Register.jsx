import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { registerUser } from "../../../State/Authentication/Action";

const initialValues = {
  email: "",
  password: "",
  confirmPassword: "",
  role: "customer",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Định dạng email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
  role: Yup.string().required("Loại tài khoản là bắt buộc"),
});

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
        className="block text-gray-700 text-sm font-medium mb-1 text-left"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...field}
          id={field.name}
          type={type}
          placeholder={placeholder}
          className={`
              w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none pr-10
          
            `}
        />
        {children}
      </div>
      <ErrorMessage
        name={field.name}
        component="p"
        className="text-sm text-red-500 mt-1 text-left"
      />
    </div>
  );
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = (values) => {
    console.log("Login form values:", values);
    dispatch(registerUser({ userData: values, navigate }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute inset-0 bg-white opacity-80" />

      {/* Khung chính */}
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Bên trái (Branding) */}
        <div
          className="hidden md:flex w-1/2 flex-col justify-center items-center text-white p-10 bg-emerald-600/90"
          style={{
            backgroundImage: "url('/img1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-4xl font-extrabold mb-3">FASTFOOD DELIVERY</h2>
          <p className="text-center text-md font-light opacity-90">
            Đăng ký để truy cập vào hệ thống đặt món nhanh chóng và tiện lợi.
          </p>
        </div>

        {/* Form đăng ký (Bên phải) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Đăng ký tài khoản
          </h3>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 text-black">
                {/* Email */}
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="user@example.com"
                  component={CustomInputField}
                />

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-medium mb-1 text-left"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="********"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center focus:outline-none bg-transparent"
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-sm text-red-500 mt-1 text-left"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 text-sm font-medium mb-1 text-left"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none bg-transparent"
                      aria-label={
                        showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="text-sm text-red-500 mt-1 text-left"
                  />
                </div>

                {/* Role Selection (Dùng Field cho Select) */}
                <div className="pt-2">
                  <label
                    htmlFor="role"
                    className="block text-gray-700 text-sm font-medium mb-1 text-left"
                  >
                    Loại tài khoản
                  </label>
                  <Field
                    as="select"
                    name="role"
                    id="role"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="customer">Khách hàng</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="p"
                    className="text-sm text-red-500 mt-1 text-left"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 mt-6 disabled:opacity-50"
                >
                  Đăng ký
                </button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <p className="text-sm text-gray-600 text-center mt-6">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-medium hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;

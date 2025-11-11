import { Typography } from "@mui/material";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenuItems } from "../../../State/Customers/Menu/menu.action";
import MenuItemCard from "../../components/MenuItem/MenuItemCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const { menuItems, loading, error } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(getAllMenuItems({ page: 1, limit: 6 }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 1. Header & Hero Section */}
      <header className="relative h-[600px] lg:h-[700px] w-full">
        {/* Background Image Placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://karlobag.eu/images/upload/j1d0u.jpg")',
            filter: "brightness(80%)",
          }}
        ></div>

        {/* Hero Content Card */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] lg:w-[700px]">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Good Morning
            </h1>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Where should we deliver your food today?
            </h2>

            {/* Location Input Group */}
            <div className="relative flex border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-green-500 transition duration-300">
              <input
                type="text"
                placeholder="Enter location"
                className="w-full p-4 pl-12 text-gray-700 focus:outline-none text-base"
              />
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button className="bg-green-500 text-white font-bold px-6 py-4 hover:bg-green-600 transition duration-300 flex items-center">
                Search
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* NEW: Offers/Restaurant List Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 pt-0">
        <Typography
          variant="h3"
          component="h3"
          className="text-xl md:text-2xl font-bold text-gray-800 mb-6"
        >
          Ưu đãi tại:{" "}
          <span className="text-green-600">
            Phạm Hùng, X.Bình Hưng, TP.Hồ Chí Minh, 70000, Vietnam
          </span>
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <MenuItemCard key={index} data={item} />
          ))}
        </div>
      </section>

      {/* 6. Main Footer */}
      {/* Giữ nguyên Footer */}
      <footer className="bg-green-600 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Logo */}
          <h2 className="text-4xl font-extrabold mb-8">GrabFood</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-green-500 pb-8 mb-8">
            {/* Cột 1: Về Grab */}
            <div>
              <h4 className="font-bold mb-4">Về Grab</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-green-200">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-200">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-200">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Cột 2: Liên hệ & Hỗ trợ */}
            <div>
              <h4 className="font-bold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-green-200">
                    Trung tâm hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-200">
                    Liên hệ với chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-200">
                    Hợp tác nhà hàng
                  </a>
                </li>
              </ul>
            </div>

            {/* Cột 3: Chính sách */}
            <div>
              <h4 className="font-bold mb-4">Điều khoản & Chính sách</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-green-200">
                    Điều khoản dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-200">
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

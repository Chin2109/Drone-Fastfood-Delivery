import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllMenuItems } from "../../../State/Customers/Menu/menu.action";
import {
  getRestaurantById,
  getRestaurantsCategory,
} from "../../../State/Customers/Restaurant/restaurant.action";
import ProductCard from "../../components/Product/ProductCard";
import { getAllCartItems } from "../../../State/Customers/Cart/cart.action";

const Restaurant = () => {
  const { id } = useParams();
  const { jwt } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  const [activeTab, setActiveTab] = useState(null);

  const { restaurant } = useSelector((state) => state?.restaurant);
  const { menuItems } = useSelector((state) => state.menu);

  // Gom nhóm sản phẩm theo danh mục
  const groupedByCategory = useMemo(() => {
    if (!menuItems) return [];
    const grouped = menuItems.reduce((acc, item) => {
      const catName = item.category?.name || "Khác";
      const catId = item.category?.id || 0;
      if (!acc[catId]) acc[catId] = { id: catId, name: catName, products: [] };
      acc[catId].products.push(item);
      return acc;
    }, {});
    return Object.values(grouped);
  }, [menuItems]);

  // Gọi API
  useEffect(() => {
    if (id) {
      dispatch(getRestaurantById(id));
      dispatch(getRestaurantsCategory(id));
      dispatch(getAllMenuItems({ merchantId: id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && jwt) {
      dispatch(getAllCartItems({ merchantId: id, jwt }));
    }
  }, [id, jwt, dispatch]);

  // Scroll tới danh mục
  const scrollToSection = (catId) => {
    setActiveTab(catId);
    const section = document.getElementById(`cat-${catId}`);
    if (section) {
      const yOffset = -100; // khoảng cách để tiêu đề category hiện rõ + thấy sản phẩm bên dưới
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* HEADER */}

        <header className="mb-6 bg-white p-5 rounded-xl shadow-md">
          {/* Ảnh nền có chiều cao ngắn */}
          <div className="w-full h-40 sm:h-52 overflow-hidden rounded-lg">
            <img
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1OyBBBk4CXNGuHuUCrayOcGU2WB4EDDcbxQ&s"
              }
              alt="Restaurant Banner"
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Nội dung nhà hàng */}
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">
            {restaurant?.name || "Tên nhà hàng"}
          </h1>

          <div className="flex flex-col text-sm text-gray-500 mt-2">
            <span className="mr-4">{restaurant?.description}</span>
            {/* <span className="mr-4">Giờ mở cửa: 7:00 - 22:00</span> */}
            {/* <span
              className={`font-medium ${
                restaurant?.is_temporarily_closed === false
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {restaurant?.is_temporarily_closed === false
                ? "Đang mở cửa"
                : "Đã đóng cửa"}
            </span> */}
          </div>
        </header>

        {/* NAV - Danh mục */}
        <nav className="sticky top-0 bg-white z-20 py-3 border-b border-gray-200 shadow-md mb-6 overflow-x-auto whitespace-nowrap">
          <div className="flex space-x-3 pb-1">
            {groupedByCategory.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`px-4 py-2 ml-5 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  activeTab === cat.id
                    ? "text-white bg-red-600 shadow-md"
                    : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>

        {/* DANH SÁCH SẢN PHẨM */}
        {groupedByCategory.map((cat) => (
          <section key={cat.id} className="mb-10 pt-4">
            <h2
              id={`cat-${cat.id}`}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 pb-3 tracking-wide"
            >
              {cat.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.products.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductClick(item.id)}
                  className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                >
                  <ProductCard
                    title={item.name}
                    description={item.description || "Không có mô tả"}
                    price={item.basePrice || 0}
                    oldPrice={item.oldPrice || null}
                    discount={item.discount || null}
                    imageUrl={item.image || "https://placehold.co/300x300"}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* FOOTER */}
        <div className="text-center text-sm text-gray-400 mt-10 p-4 border-t">
          --- Kết thúc danh sách sản phẩm ---
        </div>
      </div>
    </div>
  );
};

export default Restaurant;

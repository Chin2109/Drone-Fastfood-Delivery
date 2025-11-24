import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
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
      const yOffset = -80; // vừa đủ để thấy tiêu đề + sản phẩm
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Đọc street address (fallback an toàn)
  const street = restaurant?.address?.street || "";
  const addressDisplay = street;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Thu nhỏ max-width để gom giữa, giảm padding */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        {/* HEADER */}
        <header className="mb-4 bg-white p-4 rounded-xl shadow-sm">
          {/* Ảnh nền nhỏ hơn để gọn */}
          <div className="w-full h-32 sm:h-40 overflow-hidden rounded-lg">
            <img
              src={
                restaurant?.banner ||
                "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80"
              }
              alt="Restaurant Banner"
              className="w-full h-full object-cover opacity-95"
            />
          </div>

          {/* Nội dung nhà hàng */}
          <h1 className="mt-3 text-xl sm:text-2xl font-semibold text-gray-800">
            {restaurant?.name || "Tên nhà hàng"}
          </h1>

          {/* Address line (street) */}
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="truncate">{addressDisplay}</span>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            <p className="mb-1">{restaurant?.description}</p>
            {/* trạng thái mở cửa nếu cần - để comment nếu muốn bật */}
            {/* <span className={`font-medium ${restaurant?.is_temporarily_closed === false ? "text-green-600" : "text-red-500"}`}>
              {restaurant?.is_temporarily_closed === false ? "Đang mở cửa" : "Đã đóng cửa"}
            </span> */}
          </div>
        </header>

        {/* NAV - Danh mục (gọn, căn giữa) */}
        <nav className="sticky top-4 bg-white z-20 py-2 mb-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto px-2">
            {groupedByCategory.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-150 whitespace-nowrap ${
                  activeTab === cat.id
                    ? "text-white bg-red-600 shadow"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>

        {/* DANH SÁCH SẢN PHẨM */}
        <div className="space-y-8">
          {groupedByCategory.map((cat) => (
            <section key={cat.id} className="pt-2">
              <h2
                id={`cat-${cat.id}`}
                className="text-lg sm:text-xl font-bold text-gray-900 mb-4"
              >
                {cat.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cat.products.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="cursor-pointer hover:scale-[1.01] transition-transform duration-150"
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

          {/* Nếu không có category/trống */}
          {groupedByCategory.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Không có sản phẩm để hiển thị.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-gray-400 mt-8 py-4 border-t">
          --- Kết thúc danh sách sản phẩm ---
        </div>
      </div>
    </div>
  );
};

export default Restaurant;

import { Typography } from "@mui/material";
import { MapPin, X, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenuItems } from "../../../State/Customers/Menu/menu.action";
import MenuItemCard from "../../components/MenuItem/MenuItemCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const { menuItems = [], loading, error } = useSelector((state) => state.menu);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    // Lấy danh sách ban đầu
    dispatch(getAllMenuItems({ page: 1, limit: 50, available: true }));
  }, [dispatch]);

  // Debounce để cập nhật hiển thị thông tin tìm kiếm tự động khi gõ,
  // nhưng nút "Tìm" sẽ kích hoạt tìm ngay lập tức bằng doSearch().
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery((q) => (q ? q : "")), 300);
    return () => clearTimeout(t);
  }, []);

  // Hàm thực hiện tìm ngay (khi bấm nút hoặc Enter)
  const doSearch = (q = query) => {
    setDebouncedQuery(q.trim());
    // Nếu muốn server-side search thay vì client-side, dispatch action ở đây:
    // dispatch(getAllMenuItems({ page:1, limit:50, q: q.trim() }));
  };

  // Lọc client-side theo tên món (case-insensitive)
  const filteredItems = useMemo(() => {
    if (!debouncedQuery) return menuItems;
    const q = debouncedQuery.toLowerCase();
    return menuItems.filter((it) => {
      const name = (it.name || it.title || "").toString().toLowerCase();
      return name.includes(q);
    });
  }, [menuItems, debouncedQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 font-sans">
      {/* Header & Hero Section */}
      <header className="relative h-[520px] md:h-[600px] lg:h-[650px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://i.dailymail.co.uk/1s/2024/01/18/03/80156527-12976399-image-a-29_1705548092012.jpg")',
            filter: "brightness(72%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="w-[92%] sm:w-[85%] md:w-[600px] lg:w-[720px] mt-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-6 md:p-10 border border-white/70">
              <p className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                Đặt món trong 1 phút • Nhận đồ ăn trong nháy mắt
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Xin chào
              </h1>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-snug">
                Hôm nay bạn muốn drone giao món gì?
              </h2>

              <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-7">
                Nhập tên món vào ô bên dưới rồi nhấn "Tìm nhà hàng gần bạn".
              </p>

              {/* Gộp thành 1 input: dùng để tìm món (không phải địa chỉ nữa) */}
              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") doSearch();
                    }}
                    placeholder="Tìm món ăn theo tên — ví dụ: phở, cơm, burger..."
                    className="w-full pl-11 pr-10 py-3.5 md:py-4 text-black bg-transparent focus:outline-none text-sm md:text-base border-2 border-gray-200 rounded-xl shadow-sm"
                    // CHÚ Ý: đảm bảo chữ màu đen bằng "text-black"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                      aria-label="clear"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => doSearch()}
                  className="w-full sm:w-auto bg-emerald-500 text-white font-semibold px-5 md:px-7 py-3.5 md:py-4 text-sm md:text-base hover:bg-emerald-600 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Tìm nhà hàng gần bạn</span>
                </button>
              </div>

              <p className="mt-3 text-[12px] text-gray-500">
                Gợi ý: gõ tên món rồi nhấn nút hoặc Enter. Muốn tìm chính xác hơn,
                thêm từ khóa (ví dụ: "bún bò", "pizza").
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Offers / Restaurant List Section */}
      <section className="container mx-auto px-4 lg:px-6 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 md:mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500 mb-1">
              Gợi ý hôm nay
            </p>
            <Typography
              variant="h3"
              component="h3"
              className="!text-xl md:!text-2xl !font-bold !text-gray-900"
            >
              Ưu đãi tại{" "}
              <span className="text-emerald-600">
                Phạm Hùng, X.Bình Hưng, TP.Hồ Chí Minh
              </span>
            </Typography>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Được chuẩn bị bởi các nhà hàng đối tác DroneFastFood, giao bằng
              drone trong thời gian cực ngắn.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] md:text-xs text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
              Món hot
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
              Giảm giá quanh bạn
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
              Giao siêu tốc
            </span>
          </div>
        </div>

        {/* Search status / results info */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            {debouncedQuery ? (
              <span>
                Kết quả cho "<span className="font-medium">{debouncedQuery}</span>":{" "}
                <span className="font-semibold text-gray-900">{filteredItems.length}</span>
              </span>
            ) : (
              <span>
                Hiển thị <span className="font-semibold text-gray-900">{menuItems.length}</span> món
              </span>
            )}
          </div>
          {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
        </div>

        {/* List menu items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <MenuItemCard key={item.id ?? index} data={item} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              {loading ? "Đang tải..." : "Không tìm thấy món nào khớp."}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-700 text-white pt-10 pb-12 md:pt-12 md:pb-16 mt-4">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Drone<span className="text-yellow-300">FastFood</span>
            </h2>
            <span className="hidden sm:inline-flex text-xs md:text-sm text-emerald-100">
              Ăn ngon, nhận nhanh, không lo kẹt xe.
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-t border-emerald-500/50 pt-8">
            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">
                Về DroneFastFood
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-emerald-100/90">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">Liên hệ</h4>
              <ul className="space-y-2 text-xs md:text-sm text-emerald-100/90">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trung tâm hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Liên hệ với chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hợp tác nhà hàng
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">
                Điều khoản & Chính sách
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-emerald-100/90">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Điều khoản dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold mb-4 text-sm md:text-base">Tải ứng dụng</h4>
              <div className="flex flex-wrap gap-3">
                <div className="h-10 md:h-11 w-32 rounded-lg bg-black/80 flex items-center justify-center text-[11px] md:text-xs font-medium">
                  App Store
                </div>
                <div className="h-10 md:h-11 w-32 rounded-lg bg-black/80 flex items-center justify-center text-[11px] md:text-xs font-medium">
                  Google Play
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-[11px] md:text-xs text-emerald-100/80 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span>© {new Date().getFullYear()} DroneFastFood. All rights reserved.</span>
            <span>Made with ❤️ somewhere above the city.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

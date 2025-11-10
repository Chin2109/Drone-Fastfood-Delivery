import { Plus } from "lucide-react";
const ProductCard = ({
  title,
  description,
  price,
  oldPrice,
  discount,
  imageUrl,
}) => (
  <div className="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300">
    {/* Hình ảnh sản phẩm */}
    <div className="relative w-full aspect-square overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/300x300/f1f1f1/000?text=No+Image";
        }}
      />
    </div>

    {/* Nội dung sản phẩm */}
    <div className="flex flex-col flex-grow p-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 flex-grow">
        {description}
      </p>

      {/* Giá  */}
      <div className="mt-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            {price.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </div>

      {/* Nút thêm */}
      <div className="flex justify-end mt-3">
        <button
          className="text-green-600 border-2 border-green-500 bg-green-50 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 hover:bg-green-100 active:bg-green-200"
          aria-label={`Thêm ${title} vào giỏ hàng`}
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  </div>
);
export default ProductCard;

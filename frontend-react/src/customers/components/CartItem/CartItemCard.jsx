import { formatCurrency } from "../../util/formartCurrency";

const CartItemCard = ({
  product,
  subTotal,
  quantity,
  toppings,
  onQuantityChange,
}) => (
  <section className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5 transition-all hover:shadow-md">
    {/* Nút Tăng/Giảm số lượng */}
    <div className="flex items-center space-x-3 mr-4 flex-shrink-0">
      <button
        onClick={() => onQuantityChange(-1)}
        className={`w-9 h-9 flex items-center justify-center rounded-full text-lg font-bold transition-all
            ${
              quantity === 1
                ? "text-red-500 border border-red-400 hover:bg-red-50"
                : "text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:scale-105"
            }
          `}
      >
        −
      </button>

      <span className="font-bold text-lg text-gray-800 min-w-[2ch] text-center">
        {quantity}
      </span>

      <button
        onClick={() => onQuantityChange(1)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-lg font-bold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-all hover:scale-105"
      >
        +
      </button>
    </div>

    {/* Nội dung chính: ảnh + mô tả + giá */}
    <div className="flex items-center space-x-4 flex-grow min-w-0">
      {/* Ảnh món ăn - to hơn, bo tròn */}
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl overflow-hidden shadow-md flex-shrink-0">
        <img
          src={product?.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/80x80/EAB308/ffffff?text=FOOD";
          }}
        />
      </div>

      {/* Mô tả món ăn */}
      <div className="flex-grow min-w-0">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1"></p>
        {toppings?.length > 0 && (
          <div className="mt-1 text-xs text-gray-600">
            {toppings?.map((topping) => (
              <div key={topping?.id}>{topping?.name}</div>
            ))}
          </div>
        )}
      </div>

      {/* Giá - căn phải, to hơn */}
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-bold text-gray-900">
          {formatCurrency(subTotal)}
        </p>
      </div>
    </div>
  </section>
);

export default CartItemCard;

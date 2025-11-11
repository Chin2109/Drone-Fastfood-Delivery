import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "../../../State/Customers/Cart/cart.action";
import { formatCurrency } from "../../util/formartCurrency";

const AddToCartButton = ({
  quantity,
  setQuantity,
  totalPrice,
  product,
  toppingSelections,
  notes,
  isFormValid,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jwt } = useSelector((state) => state.auth);
  const merchantId = product?.category?.merchantId;

  const handleAddToCart = () => {
    const selectedToppingIds = Object.values(toppingSelections)
      .flat()
      .filter(Boolean);
    const reqData = {
      merchantId: merchantId,
      cartItem: {
        productId: product.id,
        quantity,
        notes,
        selectedToppingIds,
      },
      jwt: jwt,
    };

    dispatch(addItemToCart(reqData));
    navigate(`/cart/${merchantId}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t border-gray-200 z-20">
      <div className="flex justify-between items-center">
        {/* Số lượng */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <Minus size={20} />
          </button>
          <span className="text-xl font-bold text-gray-800 w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition hover:bg-red-500 hover:text-white"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Nút thêm vào giỏ hàng */}
        <button
          disabled={!isFormValid}
          onClick={handleAddToCart}
          className={`flex-1 ml-4 py-3 font-bold rounded-lg shadow-lg text-base sm:text-lg transition duration-150 ${
            isFormValid
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {`Thêm vào giỏ hàng – ${formatCurrency(totalPrice)}`}
        </button>
      </div>
    </div>
  );
};

export default AddToCartButton;

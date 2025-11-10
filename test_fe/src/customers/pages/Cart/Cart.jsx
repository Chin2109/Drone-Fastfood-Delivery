import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAllCartItems,
  removeCartItem,
  updateCartItem,
} from "../../../State/Customers/Cart/cart.action";
import { CartFooter } from "../../components/CartItem/CartFooter";
import { CartHeader } from "../../components/CartItem/CartHeader";
import CartItemCard from "../../components/CartItem/CartItemCard";
import { formatCurrency } from "../../util/formartCurrency";
const Cart = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { jwt } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(getAllCartItems({ merchantId: id, jwt: jwt }));
  }, []);

  const handleQuantityChange = async (cartItemId, delta, currentQuantity) => {
    if (!cartItemId) return;

    try {
      if (delta < 0 && currentQuantity === 1) {
        // Nếu đang là 1 và giảm => xoá item
        await dispatch(
          removeCartItem({ reqData: { merchantId: id, cartItemId, jwt } })
        );
        
      } else {
        const action = delta > 0 ? "increment" : "decrement";
        await dispatch(
          updateCartItem({ cartItemId, merchantId: id, action, jwt })
        );
      }

      // Cập nhật lại toàn bộ cart sau khi thay đổi
      dispatch(getAllCartItems({ merchantId: id, jwt }));
    } catch (err) {
      console.error("Cập nhật số lượng thất bại", err);
    }
  };

  const formattedTotal = cart ? formatCurrency(cart?.data?.total) : "0";

  return (
    <div className="flex justify-center min-w-screen mx-auto bg-white w-full min-h-screen flex flex-col font-sans shadow-xl">
      <CartHeader />

      <main className="flex-grow p-4 overflow-y-auto">
        {/* Tên quán */}
        <section className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {cart?.data?.merchantName}
          </h2>
        </section>

        {cart?.data?.items.map((item) => (
          <section>
            <CartItemCard
              key={item?.id}
              item={item?.id}
              product={item?.product}
              quantity={item?.quantity}
              toppings={item?.toppings}
              subTotal={item?.subTotal}
              formattedTotal={formattedTotal}
              onQuantityChange={(delta) =>
                handleQuantityChange(item.id, delta, item.quantity)
              }
            />
          </section>
        ))}

        {/* Tổng và Phí giao hàng */}
        <section>
          <div className="flex justify-between items-center mb-1">
            <p className="text-base font-normal text-gray-800">Tổng</p>
            <p className="text-base font-semibold text-gray-900">
              {formattedTotal}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Phí vận chuyển sẽ xuất hiện sau khi bạn xem lại đơn hàng
          </p>
        </section>
      </main>

      {/* Component CartFooter */}
      <CartFooter formattedTotal={formattedTotal} />
    </div>
  );
};

export default Cart;

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMenuItemDetail } from "../../../State/Customers/Menu/menu.action";
import AddToCartButton from "../../components/Product/AddToCartButton";
import ProductImageInfo from "../../components/Product/ProductImageInfo";
import SpecialInstruction from "../../components/Product/SpecialInstruction";
import ToppingGroup from "../../components/Product/ToppingGroup";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { menuItem } = useSelector((state) => state.menu);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [toppingSelections, setToppingSelections] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch product
  useEffect(() => {
    if (id) dispatch(getMenuItemDetail(id));
  }, [id, dispatch]);

  // Init topping selection
  useEffect(() => {
    if (menuItem?.productToppingGroups) {
      const init = {};
      menuItem.productToppingGroups.forEach((g) => {
        init[g.toppingGroupId] = [];
      });
      setToppingSelections(init);
    }
  }, [menuItem]);

  const handleToppingSelect = (groupId, toppingId) => {
    setToppingSelections((prev) => {
      const current = prev[groupId] || [];
      const group = menuItem.productToppingGroups.find(
        (g) => g.toppingGroupId === groupId
      );
      const isSelected = current.includes(toppingId);
      let newSelection = isSelected
        ? current.filter((id) => id !== toppingId)
        : [...current, toppingId].slice(0, group.toppingGroup.maxSelection);
      return { ...prev, [groupId]: newSelection };
    });
  };

  // Total price
  const totalPrice = useMemo(() => {
    let total = menuItem?.basePrice || 0;
    menuItem?.productToppingGroups?.forEach((group) => {
      (toppingSelections[group.toppingGroupId] || []).forEach((tid) => {
        const topping = group.toppingGroup?.toppings?.find((t) => t.id === tid);
        if (topping) total += topping.price;
      });
    });
    return total * quantity;
  }, [menuItem, toppingSelections, quantity]);

  // Validate required toppings
  useEffect(() => {
    if (!menuItem) return;
    const newErrors = {};
    menuItem.productToppingGroups.forEach((group) => {
      if (
        group.toppingGroup.is_required &&
        (toppingSelections[group.toppingGroupId]?.length || 0) === 0
      ) {
        newErrors[group.toppingGroupId] =
          "Vui lòng chọn ít nhất 1 lựa chọn bắt buộc.";
      }
    });
    setErrors(newErrors);
  }, [toppingSelections, menuItem]);

  const isFormValid = Object.keys(errors).length === 0;

  if (!menuItem)
    return <div className="p-10 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-28">
      <ProductImageInfo product={menuItem} />

      {menuItem.productToppingGroups?.map((group) => (
        <ToppingGroup
          key={group.id}
          group={group}
          selected={toppingSelections[group.toppingGroupId] || []}
          onSelect={handleToppingSelect}
          errorMessage={errors[group.toppingGroupId]}
        />
      ))}

      <SpecialInstruction
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        notes={notes}
        setNotes={setNotes}
      />

      <AddToCartButton
        quantity={quantity}
        setQuantity={setQuantity}
        totalPrice={totalPrice}
        product={menuItem}
        toppingSelections={toppingSelections}
        notes={notes}
        isFormValid={isFormValid}
      />
    </div>
  );
};

export default ProductDetail;

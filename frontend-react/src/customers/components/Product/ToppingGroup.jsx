// ToppingGroup.jsx
import { X } from "lucide-react";
import { formatCurrency } from "../../util/formartCurrency";

const ToppingGroup = ({ group, selected, onSelect, errorMessage }) => {
  const { toppingGroup } = group;

  return (
    <div className="bg-white mt-3 border-b border-gray-100 p-5 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">{toppingGroup.name}</h2>
        <span className="text-sm text-gray-500">
          {toppingGroup.is_required ? "(Bắt buộc)" : "(Tùy chọn)"} – Chọn tối đa{" "}
          {toppingGroup.maxSelection}
        </span>
      </div>

      <div className="space-y-2">
        {toppingGroup.toppings.map((topping) => (
          <label
            key={topping.id}
            className="flex justify-between items-center cursor-pointer px-2 py-1 rounded hover:bg-gray-50"
            onClick={() => onSelect(group.toppingGroupId, topping.id)}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-5 h-5 flex items-center justify-center border-2 rounded-md transition-all ${
                  selected.includes(topping.id)
                    ? "bg-red-500 border-red-500"
                    : "border-gray-400"
                }`}
              >
                {selected.includes(topping.id) && (
                  <X size={14} className="text-white" />
                )}
              </div>
              <span className="text-gray-700">{topping.name}</span>
            </div>
            <span className="text-gray-600 text-sm font-medium">
              +{formatCurrency(topping.price)}
            </span>
          </label>
        ))}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-xs mt-2 font-medium">{errorMessage}</p>
      )}
    </div>
  );
};

export default ToppingGroup;

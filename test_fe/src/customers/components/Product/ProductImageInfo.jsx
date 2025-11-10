import { formatCurrency } from "../../util/formartCurrency";

const ProductImageInfo = ({ product }) => (
  <div className="bg-white shadow-md">
    <img
      src={product.image || "https://placehold.co/600x300"}
      alt={product.name}
      className="w-full h-48 sm:h-64 object-cover rounded-b-2xl"
    />
    <div className="p-5">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-sm text-gray-600 mt-1">
        {product.description || "Không có mô tả"}
      </p>
      <p className="text-2xl font-extrabold text-red-500 mt-3">
        {formatCurrency(product.basePrice)}
      </p>
    </div>
  </div>
);

export default ProductImageInfo;

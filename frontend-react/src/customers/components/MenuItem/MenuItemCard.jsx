import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../util/formartCurrency";

const MenuItemCard = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (data.category.merchantId) {
      navigate(`/restaurant/${data.category.merchantId}`);
    } else {
      console.warn("Không có merchantId trong item:", data);
    }
  };
  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
    >
      {/* Hình ảnh */}
      <div className="relative h-40">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nội dung */}
      <div className="p-3">
        <Typography
          variant="subtitle1"
          component="h4"
          className="font-bold text-gray-800 text-base mb-1 truncate"
          title={data.name}
        >
          {data.name}
        </Typography>
        <Typography
          variant="body2"
          className="text-gray-500 text-sm mb-2 truncate"
        >
          {formatCurrency(data?.basePrice)}
        </Typography>
      </div>
    </div>
  );
};

export default MenuItemCard;

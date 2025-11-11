import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
      <div className="relative h-36">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        {/* Tag Promo */}
        {/* <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {data.promo}
        </div> */}
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
          {data.basePrice}
        </Typography>

        {/* Chi tiết */}
        {/* <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" />
            {data.rating}
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 text-gray-400 mr-1" />
            {data.time}
          </div>
          <div>• {data.distance}</div>
        </div> */}

        {/* Khuyến mãi */}
        {/* <div className="text-xs font-semibold text-green-600 bg-green-50 p-1 rounded-md">
          {data.note}
        </div> */}
      </div>
    </div>
  );
};

export default MenuItemCard;

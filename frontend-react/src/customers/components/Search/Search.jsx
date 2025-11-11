// import React, { useState } from "react";
// import SearchIcon from "@mui/icons-material/Search";
// import { topMeels } from "../../../Data/topMeels";
// import { PopularCuisines } from "./PopularCuisines";
// import SearchDishCard from "./SearchDishCard";
// import { useDispatch, useSelector } from "react-redux";
// import { searchMenuItem } from "../../../State/Customers/Menu/menu.action";

// const dish = [1, 1, 1, 1];
// const Search = () => {
//   const dispatch = useDispatch();
//   const { menu,auth } = useSelector((store) => store);
//   const jwt=localStorage.getItem("jwt")

//   const handleSearchMenu = (keyword) => {
//     dispatch(searchMenuItem({keyword,jwt:auth.jwt || jwt }));
//   };
  
//   return (
//     <div className="px-5 lg:px-[18vw]">
//       <div className="relative py-5">
//         <SearchIcon className="absolute top-[2rem] left-2" />
//         <input
//           onChange={(e) => handleSearchMenu(e.target.value)}
//           className="p-2 py-3 pl-12 w-full bg-[#242B2E] rounded-sm outline-none"
//           type="text"
//           placeholder="search food..."
//         />
//       </div>
//       <div>
//         <h1 className="py-5 text-2xl font-semibold">Popular Cuisines</h1>
//         <div className="flex flex-wrap ">
//           {topMeels.slice(0, 9).map((item) => (
//             <PopularCuisines image={item.image} title={item.title} />
//           ))}
//         </div>
//       </div>
//       <div className=" mt-7">
//         {menu.search.map((item) => (
//           <SearchDishCard item={item} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Search;

import React, { useState } from "react";

// Thành phần SVG cho biểu tượng tìm kiếm (Search Icon).
// Sử dụng SVG nội tuyến để đảm bảo đây là một tệp duy nhất.
const SearchIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/**
 * Component Thanh Tìm Kiếm (Search Bar)
 * Bao gồm ô input và icon tìm kiếm
 */
const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm xử lý sự kiện khi nhập liệu
  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  // Hàm xử lý khi nhấn Enter (tương đương với tìm kiếm)
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  // Hàm xử lý khi nhấn vào icon (tương đương với tìm kiếm)
  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    // Container chính: Đảm bảo responsive (chiều rộng tối đa 600px trên desktop, full width trên mobile)
    <div className="w-full max-w-xl mx-auto px-4 sm:px-0 mb-2">
      <div className="relative flex items-center w-full">
        {/* Input Field */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, bài viết, hoặc dịch vụ..." // Placeholder tiếng Việt
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          // Tailwind Classes cho Input
          className="
            w-full 
            py-3 
            pl-4 
            pr-12         /* Tạo khoảng trống cho icon */
            text-gray-800 
            bg-white 
            border 
            border-gray-300 
            rounded-xl 
            shadow-lg
            transition-all 
            duration-200
            focus:outline-none 
            focus:ring-2 
            focus:ring-indigo-500 
            focus:border-transparent
            placeholder-gray-500
            text-base
          "
        />

        {/* Icon Tìm Kiếm */}
        <button
          onClick={handleSearchClick}
          aria-label="Tìm kiếm" // Accessibility label
          // Tailwind Classes cho Button/Icon
          className="
            absolute 
            right-3 
            p-2
            text-gray-500 
            hover:text-indigo-600 
            transition-colors 
            duration-200
            rounded-full
          "
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Search;
/**
 * Component App chính để hiển thị SearchBar
 */


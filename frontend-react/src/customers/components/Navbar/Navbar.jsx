import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar, Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { pink } from "@mui/material/colors";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../State/Authentication/Action";
import Auth from "../../pages/Auth/Auth";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, cart } = useSelector((store) => store);
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const isRestaurantPage =
    /^\/restaurant\/\d+$/.test(location.pathname) ||
    /^\/cart\/\d+$/.test(location.pathname);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const navigateToCart = () => {
    const path = location.pathname;
    const match = path.match(/\/restaurant\/(\d+)/);
    const merchantId = match ? match[1] : null;

    if (merchantId) {
      navigate(`/cart/${merchantId}`); // chuyển route
    } else {
      console.warn("Không thể mở giỏ hàng: không xác định merchantId");
    }
  };

  const navigateToProfile = (e) => {
    user?.data?.roles[0] == "customer"
      ? navigate("/my-profile")
      : navigate("/admin/restaurant");
  };

  const handleCloseAuthModel = () => {
    navigate("/");
  };
  const navigateToHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseMenu();
  };

  return (
    <div className="px-5 z-50 py-[.8rem] bg-green-500 lg:px-20 flex justify-between">
      <div className="flex items-center space-x-4">
        <div
          onClick={navigateToHome}
          className="lg:mr-10 cursor-pointer flex items-center space-x-4"
        >
          {/* <li className="">
            <img src="/nav5.jpg" alt="Logo" className="h-12 w-12" />
          </li> */}
        </div>

        {/* <li className="font font-semibold">Home</li> */}
      </div>
      <div className="flex items-center space-x-2 lg:space-x-10">
        <div className="flex items-center space-x-2">
          {user?.data?.email ? (
            <span
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={
                user?.data?.roles[0] === "merchant"
                  ? handleOpenMenu
                  : navigateToProfile
              }
              className=" font-semibold cursor-pointer"
            >
              <Avatar
                sx={{ bgcolor: "white", color: pink.A400 }}
                className="bg-white"
              >
                {user?.data?.email.toUpperCase()}
              </Avatar>
            </span>
          ) : (
            <IconButton onClick={() => navigate("/login")}>
              <PersonIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() =>
                auth.user?.role === "merchant"
                  ? navigate("/admin")
                  : navigate("/super-admin")
              }
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>

        {/* <IconButton onClick={navigateToCart}>
          <Badge color="black" badgeContent={cart.cartItems.length}>
            <ShoppingCartIcon className="text-4xl" sx={{ fontSize: "2rem" }} />
          </Badge>
        </IconButton> */}
        {isRestaurantPage && (
          <IconButton onClick={navigateToCart}>
            <Badge color="black" badgeContent={cart?.cart?.data?.items?.length}>
              <ShoppingCartIcon
                className="text-4xl"
                sx={{ fontSize: "2rem" }}
              />
            </Badge>
          </IconButton>
        )}
      </div>

      <Auth handleClose={handleCloseAuthModel} />
    </div>
  );
};

export default Navbar;

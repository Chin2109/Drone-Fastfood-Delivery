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
      navigate(`/cart/${merchantId}`);
    } else {
      console.warn("Không thể mở giỏ hàng: không xác định merchantId");
    }
  };

  const navigateToProfile = (e) => {
    user?.data?.roles[0] === "customer"
      ? navigate("/my-profile")
      : navigate("/admin/restaurant");
  };

  const handleCloseAuthModel = () => {
    navigate("/");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToPartner = () => {
    navigate("/merchant");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    handleCloseMenu();
  };

  return (
    <header className="sticky top-0 z-50 navbar-shadow bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* LEFT: LOGO + BRAND */}
        <div
          onClick={navigateToHome}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="h-9 w-9 rounded-2xl bg-white/90 flex items-center justify-center shadow-md">
            <span className="text-lg font-extrabold text-emerald-500">
              DF
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              Drone<span className="text-yellow-200">FastFood</span>
            </span>
            <span className="hidden sm:block text-xs text-white/80">
              Giao đồ ăn cực nhanh bằng drone
            </span>
          </div>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Become partner */}
          <button
            onClick={navigateToPartner}
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-medium text-white/90 border border-white/30 hover:bg-white/10 transition-all duration-200"
          >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-yellow-300 animate-pulse" />
            Trở thành đối tác
          </button>

          {/* User */}
          <div className="flex items-center gap-2">
            {user?.data?.email ? (
              <div className="flex items-center gap-2">
                <button
                  id="demo-positioned-button"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={
                    user?.data?.roles[0] === "merchant"
                      ? handleOpenMenu
                      : navigateToProfile
                  }
                  className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 pl-1 pr-3 py-0.5 transition-all duration-200"
                >
                  <Avatar
                    sx={{
                      bgcolor: "white",
                      color: pink.A400,
                      width: 34,
                      height: 34,
                      fontSize: ".8rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                    }}
                    className="bg-white"
                  >
                    {user?.data?.email.toUpperCase()}
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-[11px] text-white/70">Xin chào</span>
                    <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                      {user?.data?.email}
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <IconButton
                onClick={() => navigate("/login")}
                className="bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
              >
                <PersonIcon sx={{ fontSize: "1.9rem" }} htmlColor="#ffffff" />
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
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 160,
                },
              }}
            >
              <MenuItem
                onClick={() =>
                  auth.user?.role === "merchant"
                    ? navigate("/admin")
                    : navigate("/merchantadmin")
                }
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>

          {/* Cart */}
          {isRestaurantPage && (
            <IconButton
              onClick={navigateToCart}
              className="bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <Badge
                color="error"
                overlap="circular"
                badgeContent={cart?.cart?.data?.items?.length || 0}
              >
                <ShoppingCartIcon
                  className="text-white"
                  sx={{ fontSize: "1.9rem" }}
                />
              </Badge>
            </IconButton>
          )}
        </div>
      </div>

      <Auth handleClose={handleCloseAuthModel} />
    </header>
  );
};

export default Navbar;

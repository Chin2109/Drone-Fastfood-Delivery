import React from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Divider, Drawer, useMediaQuery } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { logout } from "../../../State/Authentication/Action";

const menu = [
  { title: "Orders", icon: <ShoppingBagIcon fontSize="small" /> },
  { title: "Logout", icon: <LogoutIcon fontSize="small" /> },
];

const ProfileNavigation = ({ handleClose, open }) => {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNavigate = (item) => {
    navigate(`/my-profile/${item.title.toLowerCase()}`);
    if (item.title === "Logout") {
      handleLogout();
      navigate("/");
    }
    if (isSmallScreen && handleClose) {
      handleClose();
    }
  };

  // Xác định item đang active dựa trên URL
  const isActive = (item) => {
    const basePath = `/my-profile/${item.title.toLowerCase()}`;
    return location.pathname.startsWith(basePath);
  };

  return (
    <React.Fragment>
      <Drawer
        sx={{ zIndex: 1 }}
        anchor={"left"}
        open={open}
        onClose={handleClose}
        variant={isSmallScreen ? "temporary" : "permanent"}
        PaperProps={{
          sx: {
            background:
              "linear-gradient(160deg, #020617 0%, #0f172a 40%, #022c22 100%)",
            color: "rgba(255,255,255,0.95)",
            borderRight: "1px solid rgba(148,163,184,0.25)",
          },
        }}
      >
        <div className="w-[65vw] sm:w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col pt-6 pb-8">
          {/* Header nhỏ trên sidebar */}
          <div className="px-5 pb-5 border-b border-slate-700/70">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-300/90">
              Tài khoản
            </p>
            <p className="mt-1 text-sm font-medium text-slate-100">
              Trung tâm quản lý
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">

            </p>
          </div>

          {/* Menu items */}
          <div className="flex-1 flex flex-col justify-start text-[14px] space-y-1 pt-4">
            {menu.map((item, i) => (
              <React.Fragment key={item.title}>
                <div
                  onClick={() => handleNavigate(item)}
                  className={`px-5 py-2.5 flex items-center space-x-3 cursor-pointer rounded-xl transition-all duration-200
                    ${
                      isActive(item)
                        ? "bg-emerald-500/90 text-white shadow-[0_10px_30px_rgba(16,185,129,0.45)]"
                        : "text-slate-200 hover:bg-slate-800/70 hover:text-white"
                    }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-[18px] 
                      ${
                        isActive(item)
                          ? "bg-emerald-50/20"
                          : "bg-slate-800/80 text-slate-200"
                      }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </div>
                {i !== menu.length - 1 && (
                  <Divider
                    sx={{
                      my: 0.5,
                      borderColor: "rgba(51,65,85,0.7)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Footer nhỏ */}
          <div className="px-5 mt-auto pt-4 border-t border-slate-700/70 text-[11px] text-slate-400">
            <p>DroneFastFood • Profile Center</p>
            <p className="mt-0.5 opacity-80">
              Quản lý trải nghiệm đặt đồ ăn của bạn.
            </p>
          </div>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default ProfileNavigation;

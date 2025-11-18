import React from "react";
import ProfileNavigation from "../../components/ProfileNavigation/ProfileNavigation";
import { Divider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import OrdersPage from "../Orders/OrdersPage";
import OrderDetail from "../../components/Order/OrderDetail";

const Profile = () => {
  return (
    <div className="lg:flex justify-between">
      <div className="sticky h-[80vh] lg:w-[20%]">
        <ProfileNavigation />
      </div>
      {/* <Divider orientation="vertical" flexItem /> */}
      <div className="lg:w-[80%]">
        <Routes>
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          {/* các tab khác: profile info, addresses, v.v... */}
        </Routes>
      </div>
    </div>
  );
};

export default Profile;

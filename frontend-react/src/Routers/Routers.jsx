import React from "react";
import { Route, Routes } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";
import Admin from "../Admin/Admin";
import AdminDashboard from "../Admin/Dashboard/AdminDashboard";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import { useSelector } from "react-redux";
import NotFound from "../customers/pages/NotFound/NotFound";
import IngredientsList from "../Data/Demo";
import CreateRestaurantForm from "../Admin/AddRestaurants/CreateRestaurantForm";
import AdminRouters from "./AdminRouters";
import RestaurantRoutes from "./MerchentRoutes.jsx";

const Routers = () => {
  const { auth } = useSelector((store) => store);

  return (
    <>
   
    <Routes>
      
      <Route
        path="/admin/restaurant/*"
        element={<AdminRouters/>}
      />
      <Route path="/*" element={<CustomerRoutes />} />
      <Route path="/restaurant/*" element={<RestaurantRoutes/>} />
    </Routes>
    </>
    
  );
};

export default Routers;

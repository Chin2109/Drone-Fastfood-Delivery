import React, { useState, useEffect } from "react";
import MerchantNavigation from "../components/MerchantNavigation.jsx";
import axios from "axios";

const MerchantDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="sticky h-[80vh] lg:w-[20%]">
        <MerchantNavigation />
      </div>

    </div>
  );
};

export default MerchantDashboard;
import React, { useEffect } from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { green } from "@mui/material/colors";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCartAction } from "../../../State/Customers/Cart/cart.action";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const navigateToHome = () => navigate("/");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCartAction());
  }, []);

  return (
    <div className="min-h-screen bg-white  px-5">
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <div className="box w-full bg-green-700 lg:w-1/4 flex flex-col items-center rounded-md">
          <TaskAltIcon sx={{ fontSize: "5rem", color: green[600] }} />
          <h1 className="py-5 text-2xl font-semibold">Thanh toán thành công !</h1>
          <p className="py-3 text-center text-white">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
          </p>
          <p className="py-2 text-white text-center text-gray-200 text-lg">
            Chúc bạn 1 ngày tốt lành !
          </p>
          <Button
            variant="contained"
            className="my-5"
            sx={{ margin: "1rem 0rem" }}
            onClick={navigateToHome}
          >
            Trở về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Admin from "../Admin/Admin";

const AdminRouters = () => {
  const { auth, restaurant } = useSelector((store) => store);
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default AdminRouters;

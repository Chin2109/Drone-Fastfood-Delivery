import { Route, Routes } from "react-router-dom";
import CreateRestaurantForm from "../Admin/AddRestaurants/CreateRestaurantForm";
import Checkout from "../customers/components/Checkout/Checkout";
import LoginForm from "../customers/components/Login/Login";
import Navbar from "../customers/components/Navbar/Navbar";

import RegistrationForm from "../customers/components/Register/Register";
import Search from "../customers/components/Search/Search";
import PasswordChangeSuccess from "../customers/pages/Auth/PasswordChangeSuccess";
import Cart from "../customers/pages/Cart/Cart";
import HomePage from "../customers/pages/Home/HomePage";
import NotFound from "../customers/pages/NotFound/NotFound";
import PaymentSuccess from "../customers/pages/PaymentSuccess/PaymentSuccess";
import Profile from "../customers/pages/Profile/Profile";
import Restaurant from "../customers/pages/Restaurant/Restaurant";
import Verify from "../customers/components/Verify/Verify";
import ProductDetail from "../customers/pages/Product-detail/Product-detail";

const CustomerRoutes = () => {
  return (
    <div className="relative">
      <nav className="sticky top-0 z-50">
        <Navbar />
      </nav>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/account/register" element={<HomePage />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/register" element={<RegistrationForm />} />
        <Route exact path="/verify" element={<Verify />} />

        <Route exact path="/restaurant/:id" element={<Restaurant />} />

        <Route
          exact
          path="product-detail/:id"
          element={<ProductDetail />}
        />

        <Route exact path="checkout/:id" element={<Checkout />} />

        <Route path="/cart/:id" element={<Cart />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/my-profile/*" element={<Profile />} />

        <Route path="/search" element={<Search />} />
        <Route
          path="/admin/add-restaurant"
          element={<CreateRestaurantForm />}
        />
        <Route
          exact
          path="/password_change_success"
          element={<PasswordChangeSuccess />}
        />
        <Route exact path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default CustomerRoutes;

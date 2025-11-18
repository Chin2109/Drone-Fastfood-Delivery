import { Route, Routes} from "react-router-dom";
import MerchantDashboard from "../merchant/pages/MerchantDashboard.jsx";
import MerchantAddFood from "../merchant/pages/MerchantAddFood.jsx";
const RestaurantRoutes = () => {
    return (
        <div>
            <Routes>
                <Route index element={<MerchantDashboard/>}></Route>
                <Route path="orders" element={<div>Orders Page</div>}></Route>
                <Route path="food" element={<div>Food Page</div>}></Route>
                <Route path="add-food" element={<MerchantAddFood merchantId={1}/>}></Route>
            </Routes>
        </div>
    )
} 

export default RestaurantRoutes;
import { Route, Routes} from "react-router-dom";
import RestaurantDashboard from "../merchent/pages/RestaurantDashboard.jsx";
import RestaurantAddFood from "../merchent/pages/RestaurantAddFood.jsx";
const RestaurantRoutes = () => {
    return (
        <div>
            <Routes>
                <Route index element={<RestaurantDashboard/>}></Route>
                <Route path="orders" element={<div>Orders Page</div>}></Route>
                <Route path="food" element={<div>Food Page</div>}></Route>
                <Route path="add-food" element={<RestaurantAddFood merchantId={1}/>}></Route>
            </Routes>
        </div>
    )
} 

export default RestaurantRoutes;
// // import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
// // import thunk from "redux-thunk";
// // import authReducer from "../Authentication/Reducer";
// // import restaurantReducer from "../Customers/Restaurant/Reducer";
// // import menuItemReducer from "../Customers/Menu/Reducer";
// // import cartReducer from "../Customers/Cart/Reducer";
// // import { orderReducer } from "../Customers/Orders/order.reducer";
// // import restaurantsOrderReducer from "../Admin/Order/restaurants.order.reducer";
// // import superAdminReducer from "../SuperAdmin/superAdmin.reducer";
// // import { ingredientReducer } from "../Admin/Ingredients/Reducer";

// // const rootReducer=combineReducers({

// //     auth:authReducer,
// //     restaurant:restaurantReducer,
// //     menu:menuItemReducer,
// //     cart:cartReducer,
// //     order:orderReducer,

// //     // admin
// //     restaurantsOrder:restaurantsOrderReducer,
// //     ingredients:ingredientReducer,

// //     // super admin
// //     superAdmin:superAdminReducer
// // })

// // export const store=legacy_createStore(rootReducer,applyMiddleware(thunk))

// import {
//   applyMiddleware,
//   combineReducers,
//   compose,
//   legacy_createStore,
// } from "redux";
// import thunk from "redux-thunk";
// import { ingredientReducer } from "../Admin/Ingredients/Reducer";
// import restaurantsOrderReducer from "../Admin/Order/restaurants.order.reducer";
// import authReducer from "../Authentication/Reducer";
// import cartReducer from "../Customers/Cart/Reducer";
// import menuItemReducer from "../Customers/Menu/Reducer";
// import { orderReducer } from "../Customers/Orders/order.reducer";
// import restaurantReducer from "../Customers/Restaurant/Reducer";
// import superAdminReducer from "../SuperAdmin/superAdmin.reducer";

// const rootReducer = combineReducers({
//   auth: authReducer,
//   restaurant: restaurantReducer,
//   menu: menuItemReducer,
//   cart: cartReducer,
//   order: orderReducer,
//   restaurantsOrder: restaurantsOrderReducer,
//   ingredients: ingredientReducer,
//   superAdmin: superAdminReducer,
// });

// // 👉 Tích hợp Redux DevTools
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export const store = legacy_createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(thunk))
// );

import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore,
} from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // mặc định dùng localStorage

// reducers
import authReducer from "../Authentication/Reducer";
import restaurantReducer from "../Customers/Restaurant/Reducer";
import menuItemReducer from "../Customers/Menu/Reducer";
import cartReducer from "../Customers/Cart/Reducer";
import { orderReducer } from "../Customers/Orders/order.reducer";
import restaurantsOrderReducer from "../Admin/Order/restaurants.order.reducer";
import superAdminReducer from "../SuperAdmin/superAdmin.reducer";
import { ingredientReducer } from "../Admin/Ingredients/Reducer";

// --- B1: gộp reducers
const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  menu: menuItemReducer,
  cart: cartReducer,
  order: orderReducer,
  restaurantsOrder: restaurantsOrderReducer,
  ingredients: ingredientReducer,
  superAdmin: superAdminReducer,
});

// --- B2: cấu hình persist (chỉ lưu reducer auth)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // chỉ lưu state auth
};

// --- B3: tạo persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- B4: tích hợp Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// --- B5: tạo store
export const store = legacy_createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// --- B6: tạo persistor
export const persistor = persistStore(store);

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```
frontend-react
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  └─ robots.txt
├─ README.md
├─ src
│  ├─ Admin
│  │  ├─ AddRestaurants
│  │  │  ├─ CreateRestaurantForm.jsx
│  │  │  └─ Demo.jsx
│  │  ├─ Admin.jsx
│  │  ├─ AdminNavbar.jsx
│  │  ├─ AdminSidebar.jsx
│  │  ├─ Category
│  │  │  ├─ Category.jsx
│  │  │  └─ CreateCategory.jsx
│  │  ├─ Dashboard
│  │  │  ├─ AddRestaurantCard.jsx
│  │  │  ├─ AdminDashboard.jsx
│  │  │  ├─ RestaurantCard.jsx
│  │  │  └─ RestaurantDashboard.jsx
│  │  ├─ Details
│  │  │  └─ Details.jsx
│  │  ├─ Events
│  │  │  ├─ EventCard.jsx
│  │  │  └─ Events.jsx
│  │  ├─ Food
│  │  │  ├─ AddMenuForm.jsx
│  │  │  ├─ MenuItemTable.jsx
│  │  │  └─ RestaurantsMenu.jsx
│  │  ├─ Ingredients
│  │  │  ├─ CreateIngredientCategory.jsx
│  │  │  ├─ CreateIngredientForm.jsx
│  │  │  └─ Ingredients.jsx
│  │  ├─ Orders
│  │  │  ├─ OrderTable.jsx
│  │  │  └─ RestaurantsOrder.jsx
│  │  ├─ ReportCard
│  │  │  └─ ReportCard.jsx
│  │  └─ utils
│  │     └─ UploadToCloudnary.js
│  ├─ App.css
│  ├─ App.js
│  ├─ App.test.js
│  ├─ config
│  │  ├─ api.js
│  │  └─ logic.jsx
│  ├─ customers
│  │  ├─ components
│  │  │  ├─ Address
│  │  │  │  ├─ AddressCard.jsx
│  │  │  │  └─ NewAddressModal.jsx
│  │  │  ├─ CartItem
│  │  │  │  └─ CartItemCard.jsx
│  │  │  ├─ Login
│  │  │  │  └─ Login.jsx
│  │  │  ├─ MenuItem
│  │  │  │  └─ MenuItemCard.jsx
│  │  │  ├─ MultiItemCarousel
│  │  │  │  ├─ CarouselItem.jsx
│  │  │  │  └─ MultiItemCarousel.jsx
│  │  │  ├─ Navbar
│  │  │  │  ├─ Navbar.css
│  │  │  │  └─ Navbar.jsx
│  │  │  ├─ Order
│  │  │  │  └─ OrderCard.jsx
│  │  │  ├─ ProfileNavigation
│  │  │  │  └─ ProfileNavigation.jsx
│  │  │  ├─ Register
│  │  │  │  └─ Register.jsx
│  │  │  ├─ RestarentCard
│  │  │  │  ├─ Restaurant.css
│  │  │  │  └─ RestaurantCard.jsx
│  │  │  └─ Search
│  │  │     ├─ PopularCuisines.jsx
│  │  │     ├─ Search.jsx
│  │  │     └─ SearchDishCard.jsx
│  │  ├─ pages
│  │  │  ├─ Auth
│  │  │  │  ├─ Auth.jsx
│  │  │  │  ├─ PasswordChangeSuccess.jsx
│  │  │  │  ├─ ResetPasswordForm.jsx
│  │  │  │  └─ ResetPaswordRequest.jsx
│  │  │  ├─ Cart
│  │  │  │  ├─ Cart.jsx
│  │  │  │  └─ totalPay.js
│  │  │  ├─ Favorite
│  │  │  │  └─ Favorite.jsx
│  │  │  ├─ Home
│  │  │  │  ├─ HomePage.css
│  │  │  │  └─ HomePage.jsx
│  │  │  ├─ NotFound
│  │  │  │  └─ NotFound.jsx
│  │  │  ├─ Orders
│  │  │  │  └─ Orders.jsx
│  │  │  ├─ PaymentSuccess
│  │  │  │  └─ PaymentSuccess.jsx
│  │  │  ├─ Profile
│  │  │  │  ├─ CustomerEvents.jsx
│  │  │  │  ├─ Notifications.jsx
│  │  │  │  ├─ Profile.jsx
│  │  │  │  └─ UserProfile.jsx
│  │  │  ├─ Restaurant
│  │  │  │  └─ Restaurant.jsx
│  │  │  └─ UsersAdresses
│  │  │     └─ UsersAddresses.jsx
│  │  └─ util
│  │     ├─ CategorizeIngredients.js
│  │     └─ ValidToOrder.jsx
│  ├─ Data
│  │  ├─ Demo.jsx
│  │  ├─ index.html
│  │  ├─ Ingredients.js
│  │  ├─ restaurents.js
│  │  └─ topMeels.js
│  ├─ index.css
│  ├─ index.js
│  ├─ logo.svg
│  ├─ reportWebVitals.js
│  ├─ Routers
│  │  ├─ AdminRouters.jsx
│  │  ├─ CustomerRoutes.jsx
│  │  └─ Routers.jsx
│  ├─ setupTests.js
│  ├─ State
│  │  ├─ Admin
│  │  │  ├─ Ingredients
│  │  │  │  ├─ Action.js
│  │  │  │  ├─ ActionType.js
│  │  │  │  └─ Reducer.js
│  │  │  ├─ Order
│  │  │  │  ├─ ActionType.js
│  │  │  │  ├─ restaurants.order.action.js
│  │  │  │  └─ restaurants.order.reducer.js
│  │  │  └─ Restaurants
│  │  │     ├─ ActionType.js
│  │  │     ├─ admin.action.js
│  │  │     └─ Reducer.js
│  │  ├─ Authentication
│  │  │  ├─ Action.js
│  │  │  ├─ ActionType.js
│  │  │  └─ Reducer.js
│  │  ├─ Customers
│  │  │  ├─ Cart
│  │  │  │  ├─ ActionCreators.js
│  │  │  │  ├─ ActionTypes.js
│  │  │  │  ├─ cart.action.js
│  │  │  │  └─ Reducer.js
│  │  │  ├─ Menu
│  │  │  │  ├─ ActionCreators.js
│  │  │  │  ├─ ActionType.js
│  │  │  │  ├─ menu.action.js
│  │  │  │  └─ Reducer.js
│  │  │  ├─ Orders
│  │  │  │  ├─ Action.js
│  │  │  │  ├─ ActionCreators.js
│  │  │  │  ├─ ActionTypes.js
│  │  │  │  └─ order.reducer.js
│  │  │  └─ Restaurant
│  │  │     ├─ ActionCreateros.js
│  │  │     ├─ ActionTypes.js
│  │  │     ├─ Reducer.js
│  │  │     └─ restaurant.action.js
│  │  ├─ Store
│  │  │  └─ store.js
│  │  └─ SuperAdmin
│  │     ├─ superAdmin.action.js
│  │     ├─ superAdmin.actionType.js
│  │     └─ superAdmin.reducer.js
│  ├─ SuperAdmin
│  │  ├─ RestaurantRequest
│  │  │  ├─ RestaurantRequest.jsx
│  │  │  └─ RestaurantRequestTable.jsx
│  │  ├─ Restaurants
│  │  │  ├─ RestaurantTable.jsx
│  │  │  └─ SuperAdminRestaurant.jsx
│  │  ├─ SuperAdmin.jsx
│  │  ├─ SuperAdminCustomerTable
│  │  │  ├─ Customers.jsx
│  │  │  └─ SuperAdminCustomerTable.jsx
│  │  ├─ SuperAdminDashboard
│  │  │  └─ SuperAdminDashboard.jsx
│  │  └─ SuperAdminSideBar.jsx
│  └─ theme
│     └─ DarkTheme.js
└─ tailwind.config.js

```
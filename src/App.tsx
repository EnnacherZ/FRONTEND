import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import { CartProvider } from "./Contexts/cartContext";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { PaymentProvider } from "./Contexts/paymentContext";
import { ProductsContextProvider } from "./Contexts/ProductsContext";
import { LangContextProvider } from "./Contexts/languageContext";
import { ParametersContextProvider } from "./dashboard/Contexts/ParametersContext";
import { AuthProvider } from "./dashboard/Contexts/Authentication";
// import Loading from "./Components/loading";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import Toasti from "./reloader";
// import { useTranslation } from "react-i18next";


// Lazy load des composants
import  HomePage from "./Components/HomePage";
import Shoes from "./Components/Shoes";
import Sandales from "./Components/Sandales";
import TShirts from "./Components/TShirts";
import Cart from "./Components/cart";
import Test from "./Components/test";
import Checkout from "./Components/checkout";
import SuccessTrans from "./Components/successTrans";
import Pants from "./Components/Pants";
import ProductDetails from "./Components/ProductDetails";
import Login from "./dashboard/LogIn";
import DBHome from "./dashboard/pages/home";
import ProductsManager from "./dashboard/pages/ProductsManager";
import ExceptionsPage from "./dashboard/pages/Exceptions";
import AddProductTypeForm from "./reloader";
import Orders from "./dashboard/pages/Orders";
import Settings from "./dashboard/pages/Settings";
import OrderTracker from "./Components/OrderTracker";
import Statistics from "./dashboard/pages/Statistics";
import OrderDetails from "./dashboard/pages/OrderDetails";
import Policies from "./Components/Policies";


// Routes clients
const routes = [
  { path: "/productDetails/:product/:category/:ref/:id", element: <ProductDetails /> },
  { path: "/test", element: <Test /> },
  { path: "/", element: <Navigate to="/Home" /> },
  { path: "/Home", element: <HomePage /> },
  { path: "/Shoes", element: <Shoes /> },
  { path: "/Sandals", element: <Sandales /> },
  { path: "/Shirts", element: <TShirts /> },
  { path: "/Pants", element: <Pants /> },
  { path: "/YourCart", element: <Cart /> },
  { path: "/Checkout", element: <Checkout /> },
  { path: "/Trans", element: <SuccessTrans /> },
  { path: "/testy", element: <AddProductTypeForm /> },
  { path: "/MyOrder/:orderID", element: <OrderTracker /> },
  { path: "/Policies/:option", element: <Policies /> },
  { path: "/Toast", element: <Toasti/>}
];

// Routes admin
const dbRoutes = [
  { path: "/Dashboard", element: <Navigate to="/Dashboard/Home" /> },
  { path: "/Dashboard/Home", element: <DBHome /> },
  { path: "/Dashboard/Login", element: <Login /> },
  { path: "/Dashboard/:productType", element: <ProductsManager /> },
  { path: "/Dashboard/Deficiency", element: <ExceptionsPage /> },
  { path: "/Dashboard/Orders", element: <Orders /> },
  { path: "/Dashboard/Settings", element: <Settings /> },
  { path: "/Dashboard/Statistics", element: <Statistics /> },
  { path: "/Dashboard/OrderDetails/:orderID", element: <OrderDetails /> },
  
];

const isAdminInterface =
  window.location.pathname.startsWith("/Dashboard") ||
  window.location.pathname.startsWith("/dashboard");

const router = isAdminInterface
  ? createBrowserRouter(dbRoutes, { future: { v7_relativeSplatPath: true } })
  : createBrowserRouter(routes, { future: { v7_relativeSplatPath: true } });

const App: React.FC = () => {
  // const {t} = useTranslation();
    return (
    <LangContextProvider>
      <CartProvider>
        <PaymentProvider>
          <ProductsContextProvider>
            <ParametersContextProvider>
              {/* <Suspense fallback={<Loading message={t("loading")}/>}> */}
                <motion.div
    key={window.location.pathname}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
                {isAdminInterface ? (
                  <AuthProvider>
                    <RouterProvider router={router} future={{ v7_startTransition: true }} />
                  </AuthProvider>
                ) : (
                  <RouterProvider router={router} future={{ v7_startTransition: true }} />
                )}
                </motion.div>
                   <ToastContainer />
              {/* </Suspense> */}
            </ParametersContextProvider>
          </ProductsContextProvider>
        </PaymentProvider>
      </CartProvider>
    </LangContextProvider>
  );
};

export default App;

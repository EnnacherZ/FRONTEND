import React, { Suspense, lazy } from "react";
import "./App.css";
import { CartProvider } from "./Contexts/cartContext";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { PaymentProvider } from "./Contexts/paymentContext";
import { ProductsContextProvider } from "./Contexts/ProductsContext";
import { LangContextProvider } from "./Contexts/languageContext";
import { ParametersContextProvider } from "./dashboard/Contexts/ParametersContext";
import { AuthProvider } from "./dashboard/Contexts/Authentication";
import Loading from "./Components/loading";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";


// Lazy load des composants
const HomePage = lazy(() => import("./Components/HomePage"));
const Shoes = lazy(() => import("./Components/Shoes"));
const Sandales = lazy(() => import("./Components/Sandales"));
const TShirts = lazy(() => import("./Components/TShirts"));
const Cart = lazy(() => import("./Components/cart"));
const Test = lazy(() => import("./Components/test"));
const Checkout = lazy(() => import("./Components/checkout"));
const SuccessTrans = lazy(() => import("./Components/successTrans"));
const Pants = lazy(() => import("./Components/Pants"));
const ProductDetails = lazy(() => import("./Components/ProductDetails"));
const Login = lazy(() => import("./dashboard/LogIn"));
const DBHome = lazy(() => import("./dashboard/pages/home"));
const ProductsManager = lazy(() => import("./dashboard/pages/ProductsManager"));
const ExceptionsPage = lazy(() => import("./dashboard/pages/Exceptions"));
const AddProductTypeForm = lazy(() => import("./reloader"));
const Orders = lazy(() => import("./dashboard/pages/Orders"));
const Settings = lazy(() => import("./dashboard/pages/Settings"));
const OrderTracker = lazy(() => import("./Components/OrderTracker"));
const Statistics = lazy(() => import("./dashboard/pages/Statistics"));
const OrderDetails = lazy(() => import("./dashboard/pages/OrderDetails"));
const Policies = lazy(() => import("./Components/Policies"));

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
  const {t} = useTranslation();
    return (
    <LangContextProvider>
      <CartProvider>
        <PaymentProvider>
          <ProductsContextProvider>
            <ParametersContextProvider>
              <Suspense fallback={<Loading message={t("loading")}/>}>
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
              </Suspense>
            </ParametersContextProvider>
          </ProductsContextProvider>
        </PaymentProvider>
      </CartProvider>
    </LangContextProvider>
  );
};

export default App;

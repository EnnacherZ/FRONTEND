import React from "react";
import "./App.css"
import { CartProvider } from "./Contexts/cartContext";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";  // Utiliser RouterProvider et createBrowserRouter
import HomePage from "./Components/HomePage";
import Shoes from "./Components/Shoes";
import Sandales from "./Components/Sandales";
import TShirts from "./Components/TShirts";
import Cart from "./Components/cart";
import Test from "./Components/test";
import { PaymentProvider } from "./Contexts/paymentContext";
import Checkout from "./Components/checkout";
import { ProductsContextProvider } from "./Contexts/ProductsContext";
import { LangContextProvider } from "./Contexts/languageContext";
import SuccessTrans from "./Components/successTrans";
import Pants from "./Components/Pants";
import ProductDetails from "./Components/ProductDetails";
import Login from "./dashboard/LogIn";
import DBHome from "./dashboard/home";
import AddShoes from "./dashboard/pages/AddShoes";

// Définir vos routes
const routes = [
  { path: "/dbHome", element: <DBHome /> },
  { path: "/Login", element: <Login /> },
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
  {path : "/db/:productType", element : <AddShoes/>}
];

// Créer le routeur avec les nouvelles options futures
const router = createBrowserRouter(routes, {
  future: {      // Activer la transition concurrente (React 18+)
    v7_relativeSplatPath: true,      // Activer la gestion des chemins relatifs dans les splats
  },
});

const App: React.FC = () => {
  return (
    <LangContextProvider>
      <CartProvider>
        <PaymentProvider>
          <ProductsContextProvider>
            {/* Utiliser RouterProvider pour appliquer le routeur */}
            <RouterProvider router={router} />
          </ProductsContextProvider>
        </PaymentProvider>
      </CartProvider>
    </LangContextProvider>
  );
}

export default App;

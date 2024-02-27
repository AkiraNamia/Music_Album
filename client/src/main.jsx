import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import UserStore from "./store/UserStore";
import ProductStore from "./store/ProductStore";
import OrderStore from "./store/OrderStore";
import "./css/main.css";
export const Context = createContext(null);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Context.Provider
    value={{
      user: new UserStore(),
      product: new ProductStore(),
      order: new OrderStore(),
    }}
  >
    <App />
  </Context.Provider>
);

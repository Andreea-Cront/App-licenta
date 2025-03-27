// shop-context.jsx
import React, { createContext, useState } from "react";

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (service) => {
    setCartItems((prevCartItems) => [...prevCartItems, service]);
  };

  const removeFromCart = (serviceId) => {
    setCartItems((prevCartItems) => {
      // Filtrăm elementul cu id-ul dat din coșul de cumpărături
      const updatedCartItems = prevCartItems.filter(item => item.id_serviciu !== serviceId);
      return updatedCartItems;
    });
  };
  
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart
    // Alte funcții și valori necesare pentru coș
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

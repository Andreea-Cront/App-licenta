//ProdAuto.jsx
import React, { useContext } from "react";
import { ShopContext } from "./shop-context";
import './ProdAuto.css';

export const ProdAuto = (props) => {
  const { id, productName, price, productImage } = props.data;
  const { addToCart, cartItems } = useContext(ShopContext);

  const cartItemCount = cartItems[id] || 0;

  const handleAddToCart = () => {
    // Check if the item is already in the cart
    if (cartItemCount === 0) {
      addToCart(id); // Add the item to the cart if it's not already there
    }
  };

  return (
    <div className="ProdAuto">
      <img src={productImage} alt=""/>
      <div className="description">
        <p>
          <b>{productName}</b>
        </p>
        <p> {price} lei</p>
      </div>
      <button className="addToCartbtnn" onClick={handleAddToCart}> 
        Add To Cart {cartItemCount > 0 && <> ({cartItemCount})</>}
     </button>
    </div>
  );
};

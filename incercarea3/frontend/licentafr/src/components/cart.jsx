import React, { useContext } from "react";
import { ShopContext } from "./shop-context";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import { CartItem } from "./cart-item";
import Footer from '../footer';
//import DateSelector from './DateSelector';

export const Cart = () => {
  const { cartItems, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((total, service) => {
    const price = parseFloat(service.pret);
    if (!isNaN(price)) {
      return total + price;
    } else {
      return total;
    }
  }, 0);

  const handleRemoveFromCart = (serviceId) => {
    console.log("ID-ul serviciului pe care încerci să-l elimini:", serviceId);
    removeFromCart(serviceId);
  };

  return (
    <div className="cart">
      <br />
      <h1>Coș de cumpărături</h1>
      <br />
      {cartItems.length === 0 ? (
        <p>Nu aveți servicii adăugate în coș.</p>
      ) : (
        <div className="cartCss">
          <div className="cartItems">
            {cartItems.map((service, index) => {
              console.log("Elementul de serviciu:", service);
              return (
                <div key={index}>
                  <h2>{service.nume_serviciu}</h2>
                  <p>- {service.descriere_serviciu}</p>
                  <p>Preț: {service.pret} lei</p>
                  <button
                    className="sterge"
                    onClick={() => handleRemoveFromCart(service.id_serviciu)}
                  >
                    Șterge serviciul
                  </button>
                  <p>Vă rugăm selectați {service.nr_zile_necesare} zile in care doriți să se electueze serviciul.</p>
                 
                  <CartItem key={index} data={service} />
                </div>
              );
            })}
          </div>

          <div className="subtotal">
            <p>Total coș: {totalAmount} lei</p>
            <button
              className="services-button"
              onClick={() => navigate("/services")}
            >
              Continuă cumpărăturile
            </button>
            <button className="checkout" onClick={() => navigate("/checkout")}>
              Checkout
            </button>
            <br />
          </div>
        </div>
      )}
      <br />
      <Footer />
    </div>
  );
};

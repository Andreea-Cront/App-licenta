//CosCumparaturi.js
import React from 'react';

const CosCumparaturi = ({ location }) => {
  const { state } = location;
  const { cart } = state;

  return (
    <div>
      <h1>Produsele din coș</h1>
      <ul>
        {cart.map((product, index) => (
          <li key={index}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CosCumparaturi;

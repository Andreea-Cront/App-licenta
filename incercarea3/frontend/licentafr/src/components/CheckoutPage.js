
//CheckoutPage.js
import React, { useContext } from 'react';
import './checkout.css';
import { ShopContext } from './shop-context';
import { useNavigate } from 'react-router-dom';
import AddressForm from './AddressForm';


function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useContext(ShopContext);
  const totalAmount = cartItems.reduce((total, service) => {
    // Asigură-te că prețul este un număr
    const price = parseFloat(service.pret);

    // Verifică dacă price este un număr valid și adaugă-l la total
    if (!isNaN(price)) {
        return total + price;
    } else {
        // În caz contrar, întoarce totalul neschimbat
        return total;
    }
}, 0);

  const handleGoBack = () => {
    navigate(-1);
  };


  return (
    <div className="ct">
      
      <div className="left-ct">

        <button11 className="go-back-button" onClick={handleGoBack}>
          <div className="arrow-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="arrow-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button11>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <p>
          <div className='scris'>Total:</div> <strong style={{ fontSize: '50px' }}>{totalAmount}</strong> lei
        </p>
        {cartItems.map((service, index) => (
          <div key={index} className="service-summary">
            <div className="service-name">{service.nume_serviciu}</div>
            <div className="service-price"><strong>{service.pret}</strong> lei</div>
          </div>
        ))}
     
      </div>
      <div className="divider"></div> {/* Linia verticală */}
      <div className="right-cT">

      <AddressForm />
      </div>
    </div>
  );
}

export default CheckoutPage;
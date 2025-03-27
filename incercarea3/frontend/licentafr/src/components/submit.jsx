//submit.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './submit.css';
import Footer2 from  '../footer2';

const SubmitPage = () => {
  const location = useLocation();
  const { orderId } = location.state || {};

  return (
    <div className='submitOrder'>
      <br></br>
      <br></br>
      <br></br>
      {orderId ? (
        <div>
          <h1>Multumim pentru comandă!</h1>
          <h2>Comandă plasată cu succes!</h2>
          <p>Numărul comenzii: {orderId}.<br></br> Un email a fost trimis dumneavoastră, cât și furnizorului. Așteptați ca furnizorul să-și dea aprobarea pentru continuarea procesului.</p>
        </div>
      ) : (
        <p>Nu există nicio comandă.</p>
      )}
      <Footer2/>
    </div>
  );
};

export default SubmitPage;

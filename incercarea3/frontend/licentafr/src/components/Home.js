//Home.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import myImagine from './home.png';
import CumFunctioneaza from './cumfunctioneaza';
//import Logout from './Logout';
import Newsletter from './newsletter';
import Footer from '../footer';
import axios from 'axios';

const styles = {
  highlightBox: {
    border: '1px solid black',
    padding: '10px',
    borderRadius: '10px',
    marginTop: '50px',
   
  },
};


function Home() {
  const navigate = useNavigate();
  const [numarCompanii, setNumarCompanii] = useState(0); // Starea pentru numărul de companii
  const [numarServicii, setNumarServicii] = useState(0); // Starea pentru numărul de servicii
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');


  const cumFunctioneazaRef = useRef(null);
  useEffect(() => {
    // Funcția pentru a obține numărul de companii
    const fetchNumarCompanii = async () => {
      try {
        const response = await fetch('http://localhost:8081/numar-companii');

        const data = await response.json();
        setNumarCompanii(data.numarCompanii);
      } catch (error) {
        console.error('Eroare la obținerea numărului de companii:', error);
      }
    };

    // Apelarea funcției de obținere a numărului de companii când componenta se montează
    fetchNumarCompanii();
  }, []);

  useEffect(() => {
   
    const fetchNumarServicii = async () => {
      try {
        const response = await fetch('http://localhost:8081/numar-servicii');

        const data = await response.json();
        setNumarServicii(data.numarServicii);
      } catch (error) {
        console.error('Eroare la obținerea numărului de servicii:', error);
      }
    };

    // Apelarea funcției de obținere a numărului de companii când componenta se montează
    fetchNumarServicii();
  }, []);
  const handleExploreServicesClick = () => {
    navigate('/services');
  };

  const handleExploreSignClick = () => {
    navigate('/Account');
  };

  const CTAButtons = () => (
    <div>
    {isLoggedIn ? (
      userType === 'user' && (
        <button onClick={handleExploreServicesClick} className='cta-buttons'>Explorează Serviciile</button>
      )
    ) : (
      
        <button onClick={handleExploreSignClick} className='cta-buttons'>Înregistrează-te</button>
      
    )}
  </div>
);

  useEffect(() => {
          

      const checkLoggedInStatus = async () => {
        try {
            // Trimite o cerere către server pentru a verifica starea de autentificare a utilizatorului
            const response = await axios.get('http://localhost:8081/check-login-status'); // Endpoint-ul trebuie să fie definit pe server
            setIsLoggedIn(response.data.isLoggedIn);
            setUserType(response.data.userType);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
            setUserType('');
        }
    };
    // După ce componenta a fost montată, verifică dacă utilizatorul este conectat
    checkLoggedInStatus();
  }, []);



  return (
    <div className='HomeContinut'>
      <section className='separator1'>
        <section className='text-container'>
          <div className='stanga'> 
          <div className='numere-container'>
            <div className='numar'>
              <p>{numarCompanii}<br></br> companii</p>
            </div>
            <div className='numar'>
              <p>{numarServicii} <br></br> servicii</p>
            </div>
          </div>
            <p style={styles.highlightBox}>Aplicația noastră oferă cele mai bune servicii utilitare pentru nevoile tale zilnice.</p>
            <CTAButtons />
          </div>
        </section>
        <section className='image-container'>
          <img src={myImagine} alt="imaginea" className='imagineaHome'/>
        </section>
        
      </section>

      <section ref={cumFunctioneazaRef} className='separator2'>
        <div className='separator2-content'>
          <h1 className='cumFunctioneaza'>Cum funcționează?</h1>
          <br></br>
          <br></br>
          <CumFunctioneaza/>
          <br></br>
          <br></br>

        </div>
      </section>
      <section className='separator3'>
    
    
<div>
  <Newsletter/>
</div>

    </section><br></br>
    <Footer />

    </div>
  );
}

export default Home;

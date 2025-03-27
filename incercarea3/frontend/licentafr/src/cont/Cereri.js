import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import './Orders.css';

function Cereri() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8081/ofertePersonalizate');
        console.log('Orders fetched:', response.data);
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
        }
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8081/logout');
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          backgroundImage: 'url("fundal.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <div>
          <br />
          Vă rugăm să vă conectați pentru a vedea comenzile plasate!
        </div>
      </div>
    );
  }

  const spreContulMeu = () => {
    navigate('/ProfilePage');
  };
  const spreComenzileMele = () => {
    navigate('/Orders');
  };
  const spreSetari = () => {
    navigate('/Settings');
  };

  return (
    <div className="page-container">
      <div className="profile-page">
        <br /><br /><br />
        <div className="left-space">
          <button className="sidebar-button" onClick={spreContulMeu}>Contul meu</button>
          <button className="sidebar-button1" onClick={spreComenzileMele}>Comenzile mele</button>
          <button className="sidebar-button1">Cererile mele</button>
          <button className="sidebar-button2" onClick={spreSetari}>
            <SettingsIcon className="logout-icon" /> Setări
          </button>
          <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
              <LogoutIcon className="logout-icon" />
              Logout
            </button>
          </div>
        </div>
        <div className="content">
          <h1>Cererile mele</h1>
          <div className="profile-container">
            {offers.length === 0 ? (
              <p>Nu aveți cereri disponibile.</p>
            ) : (
              <ul>
                {offers.map((offer, index) => (
                  <li key={index}>
                    {console.log('Rendering offer:', offer)}
                    <div>
                      <h3>{offer.detalii}</h3>
                      <p>{offer.tip_serviciu}</p>
                      {offer.tip_serviciu === 'renovari' && (
                        <div>
                          <p>Suprafața: {offer.suprafata}</p>
                          <p>Locația renovării: {offer.locatie_renovare}</p>
                          <p>Include materiale: {offer.include_materiale ? 'Da' : 'Nu'}</p>
                        </div>
                      )}
                      {offer.tip_serviciu === 'instalatii' && (
                        <div>
                          <p>Tipul instalatiei: {offer.tip_instalatii}</p>
                          <p>Include materiale: {offer.include_materiale ? 'Da' : 'Nu'}</p>
                        </div>
                      )}
                      {offer.tip_serviciu === 'auto' && (
                        <div>
                          <p>Tipul auto: {offer.tip_auto}</p>
                          <p>Include materiale: {offer.include_materiale ? 'Da' : 'Nu'}</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cereri;

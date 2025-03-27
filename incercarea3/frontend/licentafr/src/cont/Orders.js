//Orders.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import './Orders.css';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8081/clientOrder');
        console.log('Orders fetched:', response.data); // Log the fetched orders
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error); // Log the error
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
  
  const spreSetari = () => {
    navigate('/Settings');
  };
  const spreCererileMele = () => {
    navigate('/Cereri');
  };
  return (
    <div className="page-container">
      <div className="profile-page">
        <br /><br /><br />
        <div className="left-space">
          <button className="sidebar-button" onClick={spreContulMeu}>Contul meu</button>
          <button className="sidebar-button">Comenzile mele</button>
          <button className="sidebar-button1" onClick={spreCererileMele}>Cererile mele</button>
          
          <button className="sidebar-button2" onClick={spreSetari}><SettingsIcon className="logout-icon" /> Setări</button>

          <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
              <LogoutIcon className="logout-icon" />
              Logout
            </button>
          </div>
        </div>
        <div className="content">
          <h1>Comenzile mele</h1>
          <div className="profile-container">
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <ul>
                <br></br>
                {orders.map(order => (
                  <li key={order.id}>
                    <p><strong>Data comenzii:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                    <p><strong>Serviciu:</strong> {order.nume_serviciu}</p>
                    <p><strong>Companie:</strong> {order.name}</p>
                    <p><strong>Preț:</strong> {order.pret} lei</p>
                    <p>
                      {order.aprobat === 1 && order.refuzat === 0 
                        ? 'Serviciul a fost aprobat de către companie'
                        : order.aprobat === 0 && order.refuzat === 0 
                          ? 'Se așteaptă aprobarea de către companie'
                          : order.aprobat === 0 && order.refuzat === 1 
                            ? 'Comanda a fost refuzată de către companie'
                            : ''}
                    </p>
                    <p> 
                              {order.aprobat === 1 && order.finalizat === 1 
                                ? 'Status: Finalizat' 
                                : order.aprobat === 1 && order.finalizat === 0 
                                  ? 'Status: În curs' 
                                  : ''}
                    </p>
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

export default Orders;

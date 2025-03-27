import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import './companie.css';

const ComenzileMele = () => {
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const navigate = useNavigate();
  const spreConectare = () => {
    navigate('/Login');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8081/orders', { withCredentials: true });
        console.log('Orders fetched:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
        }
      }
    };
    fetchOrders();
  }, []);

  const handleFinalizeClick = (orderId) => {
    console.log("Selected order id for finalization:", orderId);
    setCurrentOrderId(orderId);
    setShowModal(true);
  };

  const handleConfirmFinalize = async () => {
    console.log("Confirm finalization for order id:", currentOrderId);
    try {
      const response = await axios.put(`http://localhost:8081/orders/${currentOrderId}`, {
        finalizat: 1
      }, { withCredentials: true });
      console.log("Service finalized for order id:", currentOrderId, response.data);
      setOrders(orders.map(order => 
        order.id_order === currentOrderId ? { ...order, finalizat: 1 } : order
      ));
      setShowModal(false);
      setCurrentOrderId(null);
    } catch (error) {
      console.error("Error finalizing order:", error.response ? error.response.data : error.message);
    }
  };

  const handleCancelFinalize = () => {
    setShowModal(false);
    setCurrentOrderId(null);
  };

  const handleGoBack = () => {
    navigate(-1);
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
          Vă rugăm să vă conectați pentru a vedea comenzile primite!
          <br></br>
          <button className="spreConectare" onClick={spreConectare}>Conectează-te</button>
        </div>
      </div>
    );
  }

  const spreProfil = () => {
    navigate('/ProfilCompanie');
  };

  const sprePostareServicii = () => {
    navigate('/PostareServicii');
  };

  const spreServiciileMele = () => {
    navigate('/ServiciiCompanie');
  };

  const spreOportunitati = () => {
    navigate('/veziOferte');
  };

  const handleFinalizatMessage = (order) => {
    if (order.finalizat === 1) {
      return <p className="serviciuFinalizat"><DoneAllOutlinedIcon/> Serviciul a fost finalizat</p>;
    } else {
      return (
        <button 
          className="finalizat"
          onClick={() => handleFinalizeClick(order.id_order)}
        >
          Finalizat
        </button>
      );
    }
  };
  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('ro-RO'); // Formatul local românesc
  };
  
  return (
    <div className="page-container">
      <button className="go-back-button" onClick={handleGoBack}>
        <div className="arrow-circle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="arrow-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>
      <div className="profile-page">
        <br /><br /><br />
        <div className="left-space">
          <button className="sidebar-buttonC" onClick={spreOportunitati}> Oportunități</button>
          <button className="sidebar-buttonC"> Comenzile mele</button>
          <button className="sidebar-buttonC" onClick={sprePostareServicii}> Adăugați un serviciu</button>
          <button className="sidebar-buttonC" onClick={spreServiciileMele}> Serviciile mele</button>
          <button className="sidebar-buttonC" onClick={spreProfil}> Profil</button>
        </div>
        <div className="content">
          <h3>Comenzile mele </h3>
          <div className="profile-containerC">
            {orders.length === 0 ? (
              <p>Încă nu aveți nicio comandă plasată.</p>
            ) : (
              <ul>
                <br></br>
                {orders.map(order => (
                  <div key={order.id_order} className="card">
                    <div className="left">
                      <span>{order.nume} {order.prenume}:</span>
                    </div>
                    <div className="right">
                      <span><CalendarMonthOutlinedIcon/>{formatDate(order.created_at)}</span>
                    </div>
                    <div className="details">
                      <p>Număr comandă: {order.id_order}</p>
                      <h6 className="h6"> {order.nume_serviciu}</h6>
                      <br></br>
                      <div className="descriere">
                        <p>{order.descriere_serviciu}</p>
                        <p><strong><AttachMoneyOutlinedIcon/></strong> {order.pret} lei</p>
                        <p><LocalPhoneOutlinedIcon/>{order.phone}</p>
                      </div>
                      {handleFinalizatMessage(order)}
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Ești sigur că serviciul s-a finalizat?</p>
            <button onClick={handleConfirmFinalize}>Da</button>
            <button onClick={handleCancelFinalize}>Nu</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComenzileMele;

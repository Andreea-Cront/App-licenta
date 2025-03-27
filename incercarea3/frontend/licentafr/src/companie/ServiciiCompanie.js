import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './companie.css';

const ServiciiCompanie = () => {
  const [services, setServices] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/serviciiCompanie');
        console.log('Services fetched:', response.data); // Log the fetched services
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error); // Log the error
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
        }
      }
    };
    fetchServices();
  }, []);

  const deleteService = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8081/serviciiCompanie/${id}`);
      console.log('Service delete response:', response.data); // Log the response

      // Actualizează lista de servicii local, eliminând serviciul șters
      setServices(prevServices => prevServices.filter(service => service.id_serviciu !== id));

    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const spreConectare = () => {
    navigate('/Login');
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
          Vă rugăm să vă conectați pentru a vă vedea serviciile adăugate.
          <br></br>
          <button className="spreConectare" onClick={spreConectare}>Conectează-te</button>
        </div>
      </div>
    );
  }

  const spreProfil = () => {
    navigate('/ProfilCompanie');
  };

  const spreOportunitati = () => {
    navigate('/veziOferte');
  };

  const sprePostareServicii = () => {
    navigate('/PostareServicii');
  };

  const spreComenzileMele = () => {
    navigate('/ComenzileMele');
  };

  const handleGoBack = () => {
    navigate(-1);
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
          <button className="sidebar-buttonC" onClick={spreComenzileMele}> Comenzile mele</button>
          <button className="sidebar-buttonC" onClick={sprePostareServicii}> Adăugați un serviciu</button>
          <button className="sidebar-buttonC"> Serviciile mele</button>
          <button className="sidebar-buttonC" onClick={spreProfil}> Profil</button>
        </div>
        <div className="content">
          <h1>Serviciile mele </h1>
          <div className="profile-container">
            {services.length === 0 ? (
              <p>Niciun serviciu găsit.</p>
            ) : (
                <ul>
                  <br></br>
                  {services.map(service => (
                    <div key={service.id_serviciu} className="card">
                      <h1>{service.nume_serviciu}</h1>
                      <h6>{service.descriere_serviciu}</h6>
                      <p><strong>Preț:</strong> {service.pret} lei</p>

                      <button className="delete-button" onClick={() => deleteService(service.id_serviciu)}>Șterge serviciu</button>
                    </div>
                  ))}
                </ul>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiciiCompanie;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './companie.css';

const Oportunitati = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [oferte, setOferte] = useState([]); // Stare pentru a stoca ofertele
  const [ofertaText, setOfertaText] = useState({}); // Stare pentru a stoca textele de ofertă
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8081/oportunitati');
        console.log('Orders fetched:', response.data); // Log the fetched orders
        setOferte(response.data); // Setează ofertele în stare
      } catch (error) {
        console.error("Error fetching orders:", error); // Log the error
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
        }
      }
    };
    fetchOrders();
  }, []);

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
          Vă rugăm să vă conectați pentru a vedea ofertele personalizate ale clienților și pentru a putea face o ofertă!
        </div>
      </div>
    );
  }

  const handleInputChange = (index, value) => {
    setOfertaText({
      ...ofertaText,
      [index]: value
    });
  };

  const handleSendOffer = async (index) => {
    const oferta = oferte[index];
    const text = ofertaText[index];
  
    try {
      await axios.post('http://localhost:8081/trimiteOferta', {
        ofertaId: oferta.id,
        text: text
      });
      alert('Oferta a fost trimisă cu succes!');
      
      // Resetarea input-ului după trimiterea cu succes a ofertei
      setOfertaText({
        ...ofertaText,
        [index]: ''
      });
    } catch (error) {
      alert('A apărut o eroare la trimiterea ofertei.');
    }
  };
  
  

  const spreProfil = () => {
    navigate('/ProfilCompanie');
  };

  const sprePostareServicii = () => {
    navigate('/PostareServicii');
  };

  const spreServiciileMele = () => {
    navigate('/ServiciiCompanie');
  };

  const spreComenzileMele = () => {
    navigate('/ComenzileMele');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <button11 className="go-back-button" onClick={handleGoBack}>
        <div className="arrow-circle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="arrow-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button11>
      <div className="profile-page">
        <br /><br /><br />
        <div className="left-space">
          <button className="sidebar-buttonC"> Oportunități</button>
          <button className="sidebar-buttonC" onClick={spreComenzileMele}> Comenzile mele</button>
          <button className="sidebar-buttonC" onClick={sprePostareServicii}> Adăugați un serviciu</button>
          <button className="sidebar-buttonC" onClick={spreServiciileMele}> Serviciile mele</button>
          <button className="sidebar-buttonC" onClick={spreProfil}> Profil</button>
        </div>
        <div className="content">
          <h1>Oportunități </h1>
          <div className="profile-container">
            {oferte.length > 0 ? (
              <ul>
                {oferte.map((oferta, index) => (
                  <div key={index} className="card">
                    <p>
                      <strong>{oferta.name}</strong> își dorește: {oferta.detalii}
                    </p>

                    {oferta.tip_serviciu === 'renovari' && (
                      <div>
                        <p>Suprafața: {oferta.suprafata}</p>
                        <p>Locația renovării: {oferta.locatie_renovare}</p>
                        <p>Include materiale: {oferta.include_materiale ? 'Da' : 'Nu'}</p>
                        {/* Alte câmpuri relevante pentru renovări */}
                      </div>
                    )}

                    {oferta.tip_serviciu === 'instalatii' && (
                      <div>
                        <p>Tipul instalatiei: {oferta.tip_instalatii}</p>
                        <p>Include materiale: {oferta.include_materiale ? 'Da' : 'Nu'}</p>
                        {/* Alte câmpuri relevante pentru instalatii */}
                      </div>
                    )}

                    {oferta.tip_serviciu === 'auto' && (
                      <div>
                        <p>Tipul auto: {oferta.tip_auto}</p>
                        <p>Include materiale: {oferta.include_materiale ? 'Da' : 'Nu'}</p>
           
                      </div>
                    )}

                    <p>În: {oferta.localitate}, județul: {oferta.judet}</p>
            

                    {/* Input și buton de trimitere */}
                    <input
                      type="text"
                      placeholder="Scrieți oferta dvs."
                      value={ofertaText[index] || ''}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                    <button onClick={() => handleSendOffer(index)}>Trimite oferta</button>
                  </div>
                ))}
              </ul>
            ) : (
              <p>Nu există oferte disponibile.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Oportunitati;

import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './companie.css';
import './calendar.css';

const PostareServicii = ({ onAddService }) => {
  const navigate = useNavigate();
  const [numeServiciu, setNumeServiciu] = useState('');
  const [descriereServiciu, setDescriereServiciu] = useState('');
  const [pret, setPret] = useState('');
  const [nrZile, setNrZile] = useState('');
  const [tipServiciu, setTipServiciu] = useState('auto');
  const [availability, setAvailability] = useState([]);
  const [currentInterval, setCurrentInterval] = useState([null, null]);
  const [minDate] = useState(new Date());

  const handleAddInterval = () => {
    if (currentInterval[0] && currentInterval[1]) {
      setAvailability([...availability, currentInterval]);
      setCurrentInterval([null, null]);
    }
  };

  const handleRemoveInterval = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newService = {
      nume_serviciu: numeServiciu,
      descriere_serviciu: descriereServiciu,
      pret,
      nr_zile: nrZile,
      tip_serviciu: tipServiciu,
      availability
    };
    console.log('New service data:', newService);
    try {
      const response = await axios.post('http://localhost:3000/services', newService, {
        withCredentials: true // Asigură-te că trimiți cookie-urile de sesiune
      });
      if (response.status === 201) {
        if (typeof onAddService === 'function') {
          onAddService(response.data);
        }
        setNumeServiciu('');
        setDescriereServiciu('');
        setPret('');
        setNrZile('');
        setTipServiciu('auto');
        setAvailability([]);
      } else {
        console.error('Invalid response status:', response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const spreProfil = () => {
    navigate('/ProfilCompanie');
  };

  const spreOportunitati = () => {
    navigate('/veziOferte');
  };

  const spreComenzileMele = () => {
    navigate('/ComenzileMele');
  };

  const spreServiciileMele = () => {
    navigate('/ServiciiCompanie');
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
          <button className="sidebar-buttonC"> Adăugați un serviciu</button>
          <button className="sidebar-buttonC" onClick={spreServiciileMele}> Serviciile mele</button>
          <button className="sidebar-buttonC" onClick={spreProfil}> Profil</button>
        </div>
        <div className="contentPostareServicii">
          <h1>Adăugați un serviciu </h1>
          <h8>Puteți să adăugați, să modificați sau să eliminați orice serviciu, asigurând un control complet asupra prezenței dvs. online.</h8>
          <div className='formularPostareServicii'>
            <form onSubmit={handleSubmit}>
              <div className='margineJos'>
                <div className='postareServicii'>
                  <input
                    type="text"
                    value={numeServiciu}
                    onChange={(e) => setNumeServiciu(e.target.value)}
                    placeholder=" Nume Serviciu"
                    required
                  />
                  <textarea
                    value={descriereServiciu}
                    onChange={(e) => setDescriereServiciu(e.target.value)}
                    placeholder="Descriere Serviciu"
                    required
                  ></textarea>
                  <input
                    type="number"
                    value={pret}
                    onChange={(e) => setPret(e.target.value)}
                    placeholder="Preț"
                    required
                  />
                  <input
                    type="number"
                    value={nrZile}
                    onChange={(e) => setNrZile(e.target.value)}
                    placeholder="Număr Zile"
                    required
                  />
                  <select value={tipServiciu} onChange={(e) => setTipServiciu(e.target.value)} required>
                    <option value="" disabled> Alegeți tipul serviciului </option>
                    <option value="auto">Auto</option>
                    <option value="renovari">Renovări</option>
                    <option value="instalatii">Instalații</option>
                  </select>

                  <div className='calendar-section'>
                    <h3>Selectați intervalele de timp disponibile</h3>
                    <DatePicker
                      selectsRange
                      startDate={currentInterval[0]}
                      endDate={currentInterval[1]}
                      onChange={(update) => setCurrentInterval(update)}
                      isClearable={true}
                      withPortal
                      dateFormat="dd/MM/yyyy"
                      minDate={minDate}
                      placeholderText="Selectați intervalul"
                    />
                    <button type="button" onClick={handleAddInterval}>Adaugă interval</button>
                    <ul>
                      {availability.map((interval, index) => (
                        <li key={index}>
                          {interval[0] ? interval[0].toLocaleDateString('ro-RO') : ''} - {interval[1] ? interval[1].toLocaleDateString('ro-RO') : ''}
                          <button type="button" onClick={() => handleRemoveInterval(index)}>Șterge</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button className="submitul">Adaugă serviciul</button>
                <br />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostareServicii;

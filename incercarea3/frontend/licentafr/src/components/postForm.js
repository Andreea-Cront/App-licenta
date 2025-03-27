import React, { useState } from 'react';
import axios from 'axios';
import './postForm.css';
const ServiceForm = ({ onAddService }) => {
  const [numeServiciu, setNumeServiciu] = useState('');
  const [descriereServiciu, setDescriereServiciu] = useState('');
  const [pret, setPret] = useState('');
  const [nrZile, setNrZile] = useState('');
  const [tipServiciu, setTipServiciu] = useState('auto');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newService = { nume_serviciu: numeServiciu, descriere_serviciu: descriereServiciu, pret, nr_zile: nrZile, tip_serviciu: tipServiciu };
    try {
      const response = await axios.post('http://localhost:3000/services', newService);
      onAddService(response.data);
      setNumeServiciu('');
      setDescriereServiciu('');
      setPret('');
      setNrZile('');
      setTipServiciu('auto');
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  return (
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
        <option value="auto">Auto</option>
        <option value="renovari">Renovări</option>
        <option value="instalatii">Instalații</option>
      </select>
      </div>
      <button className="submitul">Adaugă serviciul</button>
      <br></br>
      </div>
    </form>
  );
};

export default ServiceForm;

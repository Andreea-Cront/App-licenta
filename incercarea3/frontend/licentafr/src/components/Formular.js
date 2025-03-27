// Formular.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Formular.css';

const Formular = ({ toggleForm }) => {
    const [formData, setFormData] = useState({ name: '', descriere: '', email: '', phone: '', adresa: '', CUI: '', password: '', inmatriculare: '', tip_serviciu: ''  });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(formData);
            const response = await axios.post('http://localhost:8081/register-company', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 201) {
                throw new Error('A apărut o eroare la trimiterea datelor');
            }

            console.log(response.data);

            setFormData({ name: '', descriere: '', email: '', phone: '', adresa: '', CUI: '', password: '', inmatriculare: '' , tip_serviciu: '' });
            toggleForm(); // Close the form after submission

        } catch (error) {
            setErrorMessage(error.response ? error.response.data.message : error.message);
            console.error('Eroare:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                toggleForm();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [toggleForm]);

    return (
        <div className="form-popup">
            <button className="close-button" onClick={toggleForm}>X</button>
            
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Denumire" required />
                <input type="text" name="descriere" value={formData.descriere} onChange={handleChange} placeholder="Descrierea Firmei" required />
                <input type="text" name="adresa" value={formData.adresa} onChange={handleChange} placeholder="Adresă" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" required />
                <input type="text" name="CUI" value={formData.CUI} onChange={handleChange} placeholder="CUI" required />
                <input type="text" name="inmatriculare" value={formData.inmatriculare} onChange={handleChange} placeholder="NR. de înmatriculare în registrul comerțului" required />
                <select className="form-select" name="tip_serviciu" value={formData.tip_serviciu} onChange={handleChange} required>
                    <option value="">Alege categoria de servicii:</option>
                    <option value="auto">Auto</option>
                    <option value="renovari">Renovări</option>
                    <option value="instalatii">Instalații</option>
                </select>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Parola" required />
                <button type="submit">Trimite</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Formular;

 
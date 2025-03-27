import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Contact.css';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

const Contact = () => {
  const initialFormData = {
    name: '',
    email: '',
    mesaj: '',
    rating: 0,
  };
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();
  const location = useLocation();

  // Extrage serviceId din query string la încărcarea paginii
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.get('serviceId');
    // Poți folosi serviceIdParam în altă logică pe care o ai în componentă, de exemplu într-un efect de fetch al datelor
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, mesaj, rating } = formData;
      const searchParams = new URLSearchParams(location.search);
      const serviceId = searchParams.get('serviceId');
      
      // Configurarea cererii Axios cu credențiale și datele necesare
      await axios.post('/review-companie', { name, email, mesaj, rating, serviceId }, { withCredentials: true });
      
      console.log('Review submitted:', formData);
      setFormData(initialFormData);
      navigate('/'); // Redirecționează utilizatorul către pagina principală după trimiterea recenziei
    } catch (error) {
      console.error('Error submitting review:', error);
      // Afișează un mesaj de eroare în interfața utilizatorului
      alert('Eroare la trimiterea recenziei. Te rugăm să încerci din nou mai târziu.');
    }
  };
  
  

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="contact-form-container">
      <button className="go-back-button" onClick={handleGoBack}>
        <div className="arrow-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="arrow-icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>
      <div className="contact-form-content">
        <h2 className="CULOARE">Lasă o recenzie despre serviciul primit!</h2>
        <br />
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group rating-container">
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nume și prenume"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              type="text"
              id="mesaj"
              name="mesaj"
              placeholder="Mesajul tău"
              value={formData.mesaj}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          <button type="submit">Trimite</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

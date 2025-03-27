//paginaServiciiCompanie.js
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Footer2 from '../footer2';
// const fetchApprovedServices = async () => {
//   try {
//     const response = await axios.post('http://localhost:3000/aprobate');
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching approved services:', error);
//     return [];
//   }
// };

const ServiceList = ({ services, connectedCompany }) => {
  //const [approvedServices, setApprovedServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const getServices = async () => {
     // const services = await fetchApprovedServices();
     // setApprovedServices(services);
    };

    getServices();
  }, []);


  // Filtrare servicii pentru compania conectată
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8081/review-companie');
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const showReviewsPopup = async (serviceId) => {
    try {
      const response = await axios.get(`http://localhost:8081/review-companie?serviceId=${serviceId}`);
      const serviceReviews = response.data;
      if (serviceReviews.length > 0) {
        setSelectedReviews(serviceReviews);
        setIsPopupVisible(true);
      } else {
        alert("Nu sunt încă recenzii publicate pentru acest serviciu.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("A apărut o eroare la preluarea recenziilor.");
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  
   // Funcție pentru calculul rating-ului mediu
   const calculateAverageRating = (serviceId) => {
    // Verificăm dacă reviews există și sunt încărcate
    if (!reviews || reviews.length === 0) {
      return 0; // Sau altă valoare implicită, în caz că reviews nu sunt încărcate
    }
  
    // Filtrăm recenziile pentru serviciul cu serviceId specificat
    const reviewsForService = reviews.filter(review => review.id_servicii === serviceId);
  
    // Verificăm dacă avem recenzii pentru acest serviciu
    if (reviewsForService.length === 0) {
      return 0; // Sau altă valoare implicită, dacă nu există recenzii pentru acest serviciu
    }
  
    // Calculăm media rating-urilor
    const totalRating = reviewsForService.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviewsForService.length;
  
    return averageRating.toFixed(1); // Rotunjim media rating-urilor la o zecimală
  };

  // Funcție pentru calculul numărului de stele evidențiate în funcție de rating-ul mediu
  const calculateHighlightedStars = (serviceId) => {
    const reviewsForService = reviews.filter(review => review.id_servicii === serviceId);
    if (reviewsForService.length === 0) {
      return 0; // sau altă valoare implicită
    }
    const totalRating = reviewsForService.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviewsForService.length;
    // Calculăm numărul de stele evidențiate în funcție de media rating-urilor
    return Math.round(averageRating); // Rotunjim media rating-urilor la cel mai apropiat număr întreg
  };

  return (
    <div>
      
      <h2>Serviciile mele</h2>
      <br />
      <div className='auto-container'>
        {services.map((service, index) => (
          <div className='services' key={index}>
            <h1>{service.name}</h1>
            <h1>{service.adresa}</h1>
            <h2>{service.nume_serviciu}</h2>
            <p>{service.descriere_serviciu}</p>
            <p className='auto-servi'>Serviciul durează {service.nr_zile_necesare} zile</p>
            <p className='auto-servi'>Pret: {service.pret} lei</p>
            <div className='rating-container'>
              <div className='rating-stars'>
                {[...Array(5)].map((star, i) => (
                  <span key={i} className={`star ${i < calculateHighlightedStars(service.id_serviciu) ? 'filled-star' : ''}`}>★</span>
                ))}
              </div>
              <div className='average-rating'>
                Rating mediu: {calculateAverageRating(service.id_serviciu)}
              </div>
            </div>
            <br />
            <button onClick={() => showReviewsPopup(service.id_serviciu)} className='butonrecenzii'>Vizualizează recenzii</button>
          </div>
        ))}
      </div>
      {isPopupVisible && (
        <div className='popup'>
          <div className='popup-content'>
            <div className='TitluRecenzii'>
            <h2>Recenzii:</h2>
            </div>
            <button className='close-buttonA' onClick={closePopup}>Close</button>
            {selectedReviews.map((review, index) => (
              <div key={index} className='review'>
                 <div className='recenzii'> <h3>{review.name}:</h3>        </div>
                <p>{review.mesaj}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer2/>
    </div>
  );
};

export default ServiceList;

//instalatii.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from './shop-context';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import './auto.css';
import Footer from '../footer';

const Instalatii = () => {
  const [instalatiiServices, setInstalatiiServices] = useState([]);
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const fetchInstalatiiServices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/instalatii-services');
        setInstalatiiServices(response.data);
      } catch (error) {
        console.error('Error fetching auto services:', error);
      }
    };

    fetchInstalatiiServices();
  }, []);

  const handleAddToCart = (service) => {
    const {id_serviciu, nume_serviciu, descriere_serviciu, pret, nr_zile_necesare } = service;
        // Verificăm dacă serviciul există deja în coș
    const serviceExists = cartItems.some(item => item.nume_serviciu === nume_serviciu);
  
    if (!serviceExists) {
      // Dacă serviciul nu există în coș, îl adăugăm
      addToCart({id_serviciu, nume_serviciu, descriere_serviciu, pret, nr_zile_necesare});
    }
  };
  
    const totalItemsInCart=cartItems.length;

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
  
       // Funcție pentru calculul rating-ului mediu și returnarea numărului de stele evidențiate
    const calculateHighlightedStars = (serviceId) => {
      const reviewsForService = reviews.filter(review => review.id_serviciu === serviceId);
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
      <h1 className='titlul'>Servicii Instalații</h1>
      <div className='cart-icon-container' onClick={() => navigate('/cart')}>
        <ShoppingCartIcon />
        {totalItemsInCart > 0 && (
          <span className='cart-counter'>{totalItemsInCart}</span>
        )}
      </div>
      <div className='auto-container'>
        <br></br>
        {instalatiiServices.map((service, index) => (
          <div className='auto-service' key={index}>
            <h1>{service.name}</h1>
            <p>{service.adresa}</p>
            <h2>{service.nume_serviciu}</h2>
            <p>{service.descriere_serviciu}</p>
            <p className='auto-servi'>Serviciul durează {service.nr_zile_necesare} zile</p>
            <p className='auto-servi'>Pret: {service.pret} lei</p>
            <div className='rating-stars'>
            {[...Array(5)].map((star, i) => (
                <span key={i} className={`star ${i < calculateHighlightedStars(service.id_serviciu) ? 'filled-star' : ''}`}>★</span>
              ))}
            </div>
            <br></br>
            <button onClick={() => showReviewsPopup(service.id_serviciu)} className='butonrecenzii'>Vizualizează recenzii</button>
            <button onClick={() => handleAddToCart(service)}>Adaugă în coș  <AddShoppingCartIcon/></button>
          </div>
        ))}
      </div>
      {isPopupVisible && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>Recenzii</h2>
            <button className='close-buttonA' onClick={closePopup}>Close</button>
            {selectedReviews.map((contact, index) => (
              <div key={index} className='review'>
                <h3>{contact.name}:</h3>
                <p>{contact.mesaj}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Instalatii;


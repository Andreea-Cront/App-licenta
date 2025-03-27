import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from './shop-context';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import './auto.css';
import Footer from '../footer';

const Auto = () => {
  const [autoServices, setAutoServices] = useState([]);
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Fetch auto services from API
  useEffect(() => {
    const fetchAutoServices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/auto-services');
        setAutoServices(response.data);
      } catch (error) {
        console.error('Error fetching auto services:', error);
      }
    };

    fetchAutoServices();
  }, []);

  // Add service to cart
  const handleAddToCart = (service) => {
    const { id_serviciu, nume_serviciu, descriere_serviciu, pret, nr_zile_necesare } = service;
    const serviceExists = cartItems.some(item => item.nume_serviciu === nume_serviciu);

    if (!serviceExists) {
      addToCart({ id_serviciu, nume_serviciu, descriere_serviciu, pret, nr_zile_necesare });
    }
  };

  // Calculate total items in cart
  const totalItemsInCart = cartItems.length;

  // Fetch reviews from API
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

  // Retrieve authentication token from local storage
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  // Show reviews popup for a specific service
  const showReviewsPopup = async (serviceId) => {
    try {
      const token = getToken();
      console.log(`Fetching reviews for serviceId: ${serviceId}`);
      const response = await axios.get(`http://localhost:8081/review-companie?serviceId=${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const serviceReviews = response.data;
      console.log('Fetched reviews:', serviceReviews);
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

  // Close reviews popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  // Calculate average rating for a service
  const calculateAverageRating = (serviceId) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }

    const reviewsForService = reviews.filter(review => review.id_servicii === serviceId);

    if (reviewsForService.length === 0) {
      return 0;
    }

    const totalRating = reviewsForService.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviewsForService.length;

    return averageRating.toFixed(1);
  };

  // Calculate highlighted stars based on average rating
  const calculateHighlightedStars = (serviceId) => {
    switch (serviceId) {
      case 1:
        return 4;
      case 2:
        return 4.5;
      case 5:
        return 5;
      default:
        const reviewsForService = reviews.filter(review => review.id_servicii === serviceId);
        if (reviewsForService.length === 0) {
          return 0;
        }
        const totalRating = reviewsForService.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviewsForService.length;
        // Rotunjim la cel mai apropiat 0.5
        return Math.round(averageRating * 2) / 2;
    }
  };
  
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;
  const hasHalfStar = decimalPart >= 0.5 && decimalPart < 1;

  return (
    <div className='rating-stars'>
      {[...Array(5)].map((star, i) => (
        <span key={i} className={`star ${i < fullStars ? 'filled-star' : ''} ${i === fullStars && hasHalfStar ? 'half-filled-star' : ''}`}>★</span>
      ))}
    </div>
  );
};

  
  

  return (
    <div>
      <h1 className='titlul'>Servicii Auto</h1>
      <div className='cart-icon-container' onClick={() => navigate('/cart')}>
        <ShoppingCartIcon />
        {totalItemsInCart > 0 && (
          <span className='cart-counter'>{totalItemsInCart}</span>
        )}
      </div>
      <div className='auto-container'>
        {autoServices.map((service, index) => (
          <div className='auto-service' key={index}>
            <h1>{service.name}</h1>
            <p>{service.adresa}</p>
            <h2>{service.nume_serviciu}</h2>
            <p>{service.descriere_serviciu}</p>
            <p className='auto-servi'>Serviciul durează {service.nr_zile_necesare} zile</p>
            <p className='auto-servi'>Pret: {service.pret} lei</p>
            <div className='rating-container'>
              <div className='rating-stars'>
                {[...Array(5)].map((star, i) => (
                  <span key={i} className={`star ${i < calculateHighlightedStars(service.id_serviciu) ? 'filled-star' : ''}`}>★</span>
                ))}
                  <div className='average-rating'>
                 {service.id_serviciu === 1 ? '4.0' : service.id_serviciu === 2 ? '4.5' : service.id_serviciu === 17 ? '5.0' : calculateAverageRating(service.id_serviciu)}
              </div>
              </div>
            
            </div>
            <br />
            <button onClick={() => showReviewsPopup(service.id_serviciu)} className='butonrecenzii'>Vizualizează recenzii</button>
            <button onClick={() => handleAddToCart(service)} className='butonrecenzii'>Adaugă în coș  <AddShoppingCartIcon /></button>
          </div>
        ))}
      </div>
      {isPopupVisible && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>Recenzii</h2>
            <button className='close-buttonA' onClick={closePopup}>Close</button>
            {selectedReviews.map((review, index) => (
              <div key={index} className='review'>
                <div className='review-header'>
                  <h3>{review.name}</h3>
                  <div>{renderStars(review.rating)}</div>
                </div>
                <p>{review.mesaj}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Auto;

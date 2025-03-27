//Title.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Title.css';
import myLogo from './poza.png';

function Title() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/');
  };

  return (
    <div className="container1">
      <img src={myLogo} alt="My Logo" onClick={handleNavigation} className="clickable" />
      <div className="Title clickable" onClick={handleNavigation} style={{ color: '#ee8331' }}>
        ServiDeal
      </div>
    </div>
  );
}

export default Title;

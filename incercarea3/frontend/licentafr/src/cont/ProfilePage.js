//ProfilePage.js
import React, { useState, useRef } from 'react';
import {useNavigate } from 'react-router-dom';
import defaultAvatar from './defaultAvatar.jpg'; 
import './MyAccountPage.css';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

import axios from 'axios';


function ProfilePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    dateOfBirth: '',
    phoneNumber: '',
  });

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "dataNastere") {
      // Format the date to "yyyy-mm-dd"
      const formattedDate = new Date(value).toISOString().split('T')[0];
      setFormData({
        ...formData,
        [name]: formattedDate,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/update-profile', formData);
      console.log("Profile update response:", response.data);
      // You can add logic here to handle successful update if needed
    } catch (error) {
      console.error("Profile update error:", error);
      // Handle error cases
    }
  };
  
  const handleLogout =async () => {
    try {
      const response = await axios.post('http://localhost:8081/logout');

      console.log("Response:", response);
      if (response.data.message.includes("success")) {
        console.log("Logout successful!");
        navigate('/');

      } else {
        console.error("Logout failed:", response.data.message);
      }
      
    } catch (error) {
      console.error("Logout error:", error);
    }
  
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const spreCererileMele = () => {
    navigate('/Cereri');
  };
  const spreComenzileMele = () => {
    navigate('/Orders');
  };
  const spreSetari = () => {
    navigate('/Settings');
  };

  return (
    <div className="page-container1">
      
      <div className="profile-page1">
      <br></br>
      <br></br>
      <br></br>

        <div className="left-space1">
          <button className="sidebar-button1">Contul meu</button>
          <button className="sidebar-button1" onClick={spreComenzileMele}>Comenzile mele</button>
          <button className="sidebar-button1" onClick={spreCererileMele}>Cererile mele</button>
          
          <button className="sidebar-button2" onClick={spreSetari}><SettingsIcon className="logout-icon" /> Setări</button>
      
          <div className="logout-container1">
            <button className="logout-button1" onClick={handleLogout}>
              <LogoutIcon className="logout-icon1" />
              Logout
            </button>
          </div>
        </div>
        <div className="content1">
          <h1>Contul meu</h1>
          <div className="profile-container1">
            <div className="profile-picture1">
              <div className="avatar-container1" onClick={handleAvatarClick}>
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Profile preview"
                    className="avatar1"
                  />
                ) : (
                  <img src={defaultAvatar} alt="Default avatar" className="avatar" />
                )}
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
            <br />
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="adresa">Adresă: </label>
                <input
                  type="text"
                  name="adresa"
                  id="adresa"
                  value={formData.adresa}
                  onChange={handleInputChange}
                  required
                  style={{ width: '250px' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="oras">Oraș:  </label>
                <input
                  type="text"
                  name="oras"
                  id="oras"
                  value={formData.oras}
                  onChange={handleInputChange}
                  required
                  style={{ width: '150px' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dataNastere">Zi de naștere:</label>
                <input
                  type="date"
                  name="dataNastere"
                  id="dataNastere"
                  value={formData.dataNastere}
                  onChange={handleInputChange}
                  required
                  style={{ width: '150px' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Număr de telefon:</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  required
                  style={{ width: '150px' }}
                />
              </div>
              <button type="submit" onClick={handleSubmit}>Salvează modificările</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

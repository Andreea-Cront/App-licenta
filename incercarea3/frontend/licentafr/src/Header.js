

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Title from './Title';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ConfirmationDialog from './components/ConfirmationDialog';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');

  useEffect(() => {
    // După ce componenta a fost montată, verifică dacă utilizatorul este conectat
    checkLoggedInStatus();
    fetchNotifications();
  }, []);

  const checkLoggedInStatus = async () => {
    try {
      // Trimite o cerere către server pentru a verifica starea de autentificare a utilizatorului
      const response = await axios.get('http://localhost:8081/check-login-status');
      setIsLoggedIn(response.data.isLoggedIn);
      setUserType(response.data.userType);

    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Trimite o cerere către server pentru a obține notificările
      const response = await axios.get('http://localhost:8081/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    setConfirmationOpen(true);
  };

  const handleConfirmLogout = async () => {
    console.log("Confirming logout...");
    try {
      const response = await axios.post('http://localhost:8081/logout');
      console.log("Response:", response);
      if (response.data.message.includes("success")) {
        console.log("Logout successful!");
        setIsLoggedIn(false);
        navigate('/');
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
    setConfirmationOpen(false);
  };

  const handleProfileClick = () => {
    if (userType === 'user') {
      navigate('/ProfilePage');
    } else if (userType === 'company') {
      navigate('/ProfilCompanie');
    }
    handleClose();
  };
  
  const handleCancelLogout = () => {
    setConfirmationOpen(false);
  };

  return (
    <div className='fundalHeader'>
      <header className="header">
        <div className="left-section">
          <Title />
        </div>
        <div className="navigation">
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  <Button
                    id="notification-button"
                    aria-controls={notificationAnchorEl ? 'notification-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={notificationAnchorEl ? 'true' : undefined}
                    onClick={handleNotificationClick}
                    sx={{
                      minWidth: 'auto',
                      padding: '0px',
                    }}
                  >
                    <NotificationsIcon sx={{ color: 'black' }} />
                  </Button>
                  <Menu
                    id="notification-menu"
                    anchorEl={notificationAnchorEl}
                    open={Boolean(notificationAnchorEl)}
                    onClose={handleNotificationClose}
                  >
                    {notifications.length === 0 ? (
                      <MenuItem>Bine ați venit în aplicație!</MenuItem>
                    ) : (
                      notifications.map((notification, index) => (
                        <MenuItem key={index}>{notification}</MenuItem>
                      ))
                    )}
                  </Menu>
                </li>
                {userType === 'user' && (
                  <li>
                    <Link to="/services" className="button">Servicii</Link>
                    
                  </li>
                )}
                {userType === 'company' && (
                  <>
                    <li>
                      <Link to="/manage-services" className="button">Postează un Serviciu</Link>
                    </li>
                    <li>
                      <Link to="/veziOferte" className="button">Vezi Oferte Personalizate</Link>
                    </li>
                  </>
                )}
                <li>
                  <div>
                    <Button
                      id="basic-button"
                      aria-controls={anchorEl ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={anchorEl ? 'true' : undefined}
                      onClick={handleClick}
                      sx={{
                        backgroundColor: '#f9b17a',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '5px 9px',
                        '&:hover': {
                          backgroundColor: 'white',
                          color: '#f9b17a',
                          borderRadius: '10px',
                          padding: '5px 9px',
                        },
                      }}
                    >
                      <AccountBoxIcon />
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="button">Conectare</Link>
              </li>
            )}
          </ul>
        </div>
        <ConfirmationDialog
          open={confirmationOpen}
          onClose={handleCancelLogout}
          onConfirm={handleConfirmLogout}
        />
      </header>
    </div>
  );
};

export default Header;
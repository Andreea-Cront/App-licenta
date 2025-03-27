
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderS.css';
import Title from './Title';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ConfirmationDialog from './components/ConfirmationDialog';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function HeaderS() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
    navigate('/ProfilePage');
    handleClose();
  };

  const handleCancelLogout = () => {
    setConfirmationOpen(false);
  };
  
  useEffect(() => {
    // După ce componenta a fost montată, verifică dacă utilizatorul este conectat
    checkLoggedInStatus();
  }, []);

  const checkLoggedInStatus = async () => {
    try {
      // Trimite o cerere către server pentru a verifica starea de autentificare a utilizatorului
      const response = await axios.get('http://localhost:8081/check-login-status');
      setIsLoggedIn(response.data.isLoggedIn);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  return (
    <header className="header">
      <div className="left-section">
        <Title />
      </div>

      <div className="navigation">
        <NotificationsIcon />
        <ul>
          <li>
            <Link to="/services" className="button">Servicii</Link>
          </li>
          
          {!isLoggedIn && 
            <li>
              <Link to="/login" className="button">Conectare</Link>
            </li>
          }   
          {isLoggedIn && 
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
                      padding: '5px 9px'
                    },
                  }}
                >
                  <AccountBoxIcon/>
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  MenuListProps={{
                  }}
                >
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            </li>
          }
        </ul>
      </div>
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}

export default HeaderS;

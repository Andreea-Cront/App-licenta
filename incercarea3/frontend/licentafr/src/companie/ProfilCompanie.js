//import { de } from "date-fns/locale";
import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './companie.css';

import LogoutIcon from '@mui/icons-material/Logout';


const ProfilCompanie=()=> {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
   const [resetSuccess, setResetSuccess] = useState(false);
    
   const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Parolele nu se potrivesc!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/resetPassword', {
        newPassword
      });
      console.log('Password reset response:', response.data);
      setResetSuccess(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert("A apărut o eroare la resetarea parolei.");
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8081/logout');
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

    const spreOportunitati = () => {
      navigate('/veziOferte');
    };
    const sprePostareServicii = () => {
      navigate('/PostareServicii');
    };
    const spreServiciileMele = () => {
      navigate('/ServiciiCompanie');
    };
    const spreComenzileMele = () => {
      navigate('/ComenzileMele');
    };
    
  const handleGoBack = () => {
    navigate(-1);
  };

    return (
      <div className="page-container">
          <button11 className="go-back-button" onClick={handleGoBack}>
          <div className="arrow-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="arrow-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button11>
       
        <div className="profile-page">
          <br /><br /><br />
          <div className="left-space">
              <button className="sidebar-buttonC" onClick={spreOportunitati}> Oportunități</button>
              <button className="sidebar-buttonC" onClick={spreComenzileMele}> Comenzile mele</button>
              <button className="sidebar-buttonC" onClick={sprePostareServicii}> Adăugați un serviciu</button>
              <button className="sidebar-buttonC" onClick={spreServiciileMele}> Serviciile mele</button>
              <button className="sidebar-buttonC"> Profil</button> 
          </div>
          
          <div className="content">
            <h2>Profilul meu</h2>
            <br></br>
            {resetSuccess ? (
              <p>Parola a fost resetată cu succes!</p>
            ) : (
              <form onSubmit={handlePasswordReset}>
                <div className='newPassword'>
                  <label htmlFor="newPassword">Noua parolă: </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className='confirmPassword'>
                  <label htmlFor="confirmPassword">Confirmare parolă: </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Resetare Parolă</button>
              </form>
            )}
            <button className="logout-buttonCompanie" onClick={handleLogout}>
              <LogoutIcon className="logout-icon" />
              Logout
            </button>
          </div>
        </div>
  
      </div>
    );
  }
  
  export default ProfilCompanie;
  
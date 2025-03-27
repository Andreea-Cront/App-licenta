// Settings.js
import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import './Settings.css';



function Settings() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
 // const [isLoggedIn, setIsLoggedIn] = useState(true);




  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8081/logout');
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const spreContulMeu = () => {
    navigate('/ProfilePage');
  };
  const spreComenzileMele = () => {
    navigate('/Orders');
  };
  const spreCererileMele = () => {
    navigate('/Cereri');
  };
 
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
  

  return (
    <div className="page-containerp">
      <div className="profile-pagep">
        <br /><br /><br />
        <div className="left-space">
          <button className="sidebar-button" onClick={spreContulMeu}>Contul meu</button>
          <button className="sidebar-button1" onClick={spreComenzileMele}>Comenzile mele</button>
          <button className="sidebar-button1" onClick={spreCererileMele}>Cererile mele</button>
          
          <button className="sidebar-button2" >
          <SettingsIcon className="logout-icon" /> Setări
          </button>
          <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
              <LogoutIcon className="logout-icon" />
              Logout
            </button>
          </div>
        </div>
        <div className="content">
        <br></br>
        <h2>Resetare parolă</h2>
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
                <br></br>
                <button type="submit">Resetare Parolă</button>
              </form>
            )}
        </div>
      </div>
    </div>
  );

};

export default Settings;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResetPassword.css';

function ResetPassword() {
  const { token } = useParams(); // Capturăm token-ul din URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificăm dacă există token în URL
    if (!token) {
      navigate('/reset-password'); // Redirectăm către pagina principală sau altă pagină de eroare
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/reset-password', { token, newPassword });
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };



  return (
    <div className="d-flex vh-100 justify-content-center align-items-center reset-password-container">
      <div className="background-animation"></div>
     
      <div className="p-3 rounded bg-white form-container">
        <h2>Resetare parolă</h2>
   
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="newPassword"><strong>Introduceți noua parolă:</strong></label>
            <input
              type="password"
              placeholder="Enter New Password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control rounded-2"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword"><strong>Confirmați parola:</strong></label>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control rounded-2"
            />
          </div>
          {error && <span className="text-danger error-message">{error}</span>}
          {message && <span className="text-success success-message">{message}</span>}
          <button type="submit" className="btn w-100 reset-password-button">Actualizați parola</button>
    
          <div className="back-to-login">
            <p>V-ați amintit parola? <Link to="/login" className="fw-semibold">Log in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
    
        try {
          const response = await axios.post('http://localhost:8081/forgot-password', { email });
          setMessage(response.data.message);
        } catch (error) {
          if (error.response) {
            setError(error.response.data.message);
          } else {
            setError('An unexpected error occurred');
          }
        }
      };

    const handleGoBack = () => {
        navigate(-1); 
    };

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center forgot-password-container">
            <div className="background-animation"></div>
            <button className="go-back-button" onClick={handleGoBack}>
                <div className="arrow-circle">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="arrow-icon"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </div>
            </button>
            <div className="p-3 rounded bg-white form-container">
                <h2>Parolă uitată</h2>
                <br></br>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Adresa de e-mail: </strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control rounded-2"
                        />
                    </div>
                    {error && <span className="text-danger error-message">{error}</span>}
                    {message && <span className="text-success success-message">{message}</span>}
                    <button type="submit" className="btn w-100 forgot-password-button">Trimite link-ul de resetare parolă</button>
                    <br />
                    <br />
                    <div className="back-to-login">
                        <p>V-ați amintit parola? <Link to="/login" className="fw-semibold">Log in</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default ForgotPassword;

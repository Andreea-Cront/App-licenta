//Signup.js
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import HandshakeIcon from '@mui/icons-material/Handshake';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signupvalidation from "./SignupValidation";
import './Signup.css';

function Signup() {
const [values, setValues] = useState({
name: '',
email: '',
password: ''
});

const navigate = useNavigate();
const [errors, setErrors]= useState({});

const handleInput = (event) => {
    setValues(prev => ({...prev, [event.target.name]: event.target.value}));
};

const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Signupvalidation(values));
    
    if (errors.name === "" && errors.email === "" && errors.password === "") {
        axios.post('http://localhost:8081/signup', values)
        .then(res => {
            navigate('/login');
        })
        .catch(err => console.error(err)); 
    }        
};
const handleGoBack = () => {
    navigate(-1);
  };
return (
    <div className="d-flex justify-content-center align-items-center vh-100 signup-container">
        <button11 className="go-back-button" onClick={handleGoBack}>
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
  </button11 >
        <div className="p-3 rounded bg-white form-container">
            <h2>Sign-Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name"><strong>Nume</strong></label>
                    <div className="password-container"></div>
                    <input
                        type="text"
                        placeholder="Enter name"
                        name="name"  
                        className="form-control rounded-2"
                        onChange={handleInput}
                    />
                </div>

                     {errors.name && <span className="text-danger error-message">{errors.name}</span>}
                <div className="mb-3">
                    <label htmlFor="email"style={{ width: 'auto' }}><strong>Email</strong></label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        className="form-control rounded-2"
                        onChange={handleInput}
                    />
                     {errors.email && <span className="text-danger error-message">{errors.email}</span>}
                    
                </div>
                <div className="mb-3">
                    <label htmlFor="password" style={{ width: 'auto' }}><strong>Parolă</strong></label>
                    <div className="password-container">                   
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="password" 
                        className="form-control rounded-2"
                        onChange={handleInput}
                    />
                     {errors.password && <span className="text-danger error-message">{errors.password}</span>}
                    </div>
                </div>
                <button type="submit" className="btn w-100 signup-button">Înregistrare</button>
                <p><HandshakeIcon/> Apăsând pe înregistrare sunteți de acord cu termenii și condițiile paginii.</p>
                <Link to='/login' className="btn btn-default border w-100 create-account-link">
                    Ai deja cont? Conectează-te!
                </Link>
            </form>
        </div>
    </div>
);
}

export default Signup;
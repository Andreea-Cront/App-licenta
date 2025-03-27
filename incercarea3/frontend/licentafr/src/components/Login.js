import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!values.email) {
            newErrors.email = 'Email is required';
        }
        if (!values.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/login', { email: values.email, password: values.password });
            console.log('Login successful:', response.data);
            navigate('/');
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setServerError(error.response.data.message);
            } else {
                console.error('Error message:', error.message);
                setServerError('An unexpected error occurred');
            }
        }
    };

    const handleGoBack = () => {
        navigate(-1); 
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center login-container">
            <div className="background-animation"></div>
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
            </button11>
            <div className="p-3 rounded bg-white form-container">
                <h2>Log-in</h2>
                <br></br>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Adresa de email: </strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            value={values.email}
                            onChange={handleInput}
                            className="form-control rounded-2"
                        />
                        {errors.email && <span className="text-danger error-message">{errors.email}</span>}  
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Parolă:</strong></label>
                        <div className="password-container">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Enter Password"
                                name="password"
                                value={values.password}
                                onChange={handleInput}
                                className={`form-control rounded-2 ${passwordVisible ? "password-visible" : ""}`}
                            />
                            <span className="password-toggle" onClick={togglePasswordVisibility}>
                                {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </span>
                        </div>
                        {errors.password && <span className="text-danger error-message">{errors.password}</span>}
                    </div>
                    {serverError && <span className="text-danger error-message">{serverError}</span>}
                    <button type="submit" className="btn w-100 login-button">Intră în cont</button>
                    <br />
                    <br />
                    <div className="nuaicont">
                        <p>Nu ai cont? <Link to="/Account" className="fw-semibold">  Înregistrează-te</Link>  </p>
                        <p>Ai uitat parola? <Link to="/ForgotPassword" className="fw-semibold">Resetează parola</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

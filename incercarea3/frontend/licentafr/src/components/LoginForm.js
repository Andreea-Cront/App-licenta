import React from 'react';
import { Link } from 'react-router-dom';

function LoginForm({ values, handleInput, handleSubmit, errors }) {
    return (
        <div className="p-3 rounded bg-white form-container">
            <h2>Log-in</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        onChange={handleInput}
                        className="form-control rounded-2"
                    />
                    {errors.email && <span className="text-danger error-message">{errors.email}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name='password'
                        onChange={handleInput}
                        className="form-control rounded-2"
                    />
                    {errors.password && <span className="text-danger error-message">{errors.password}</span>}
                </div>
                <button type="submit" className="btn w-100 login-button">Log in</button>
                <p>You are agree to our terms and policies</p>
                <Link to="/signup" className="btn btn-default border w-100 create-account-link">Create Account</Link>
            </form>
        </div>
    );
}

export default LoginForm;

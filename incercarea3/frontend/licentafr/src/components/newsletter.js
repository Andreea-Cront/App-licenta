import React, { useState } from 'react';
import axios from 'axios';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:3000/subscribe', { email })
      .then(response => {
        setMessage('Mulțumim că te-ai abonat la newsletter!');
        setEmail('');
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          setMessage('Emailul este deja abonat.');
        } else {
          setMessage('A apărut o eroare. Te rugăm să încerci din nou.');
        }
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Abonează-te la newsletter</h2>
      <h3 style={{ fontSize: "15px" }}>Pentru a fi la curent cu toate noutățile.</h3>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Introdu adresa de email"
          value={email}
          onChange={handleChange}
          required
          style={{ width: '80%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Subscribe
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Newsletter;

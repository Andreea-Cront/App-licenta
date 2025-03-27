
//AddressForm.jsx
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from './shop-context';
import './AddressForm.css';

const AddressForm = () => {
  const navigate = useNavigate();
  const { cartItems } = useContext(ShopContext);
  const counties = ["Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"];
  const [formData, setFormData] = useState({
    nume: '',
    prenume: '',
    phone: '',
    email: '',
    adresa: '',
    oras: '',
    judet: '',
    zip: ''
  });
  //const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const orderData = {
        ...formData,
        id_servicii: cartItems.map(service => service.id_serviciu).join(','),
        tip_serviciu: cartItems.map(service => service.tip_serviciu).join(','),
      };
      

      const response = await axios.post('http://localhost:8081/orders', orderData);

      if (response.status === 200) {
        const id_order = response.data.id_order;
        console.log('Form submitted successfully. Order ID:', id_order);
        setFormData({
          nume: '',
          prenume: '',
          phone: '',
          email: '',
          adresa: '',
          oras: '',
          judet: '',
          zip: ''
        });
        navigate('/submit', { state: { orderId: id_order } });
      } else {
        setError('Failed to submit order. Please try again');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit order. Please try again');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="adresa">
      <form onSubmit={handleSubmit}>
        <div className="form-group1">
          <label htmlFor="nume">Nume: </label>
          <input className='casetaInput'
            type="text"
            id="nume"
            name="nume"
            value={formData.nume}
            onChange={handleChange}
            placeholder="  Popescu"
            required
          />
          <label htmlFor="prenume">Prenume: </label>
          <input className='casetaInput'
            type="text"
            id="prenume"
            name="prenume"
            value={formData.prenume}
            onChange={handleChange}
            placeholder="  Ion"
            required
          />
        </div>
        <div className="form-group1">
          <label htmlFor="phone">Număr de telefon: </label>
          <input className='casetaInput'
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="  07********"
            required
          />
          <label htmlFor="email">Email: </label>
          <input className='emmail'
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group1">
          <label htmlFor="adresa">Adresă: </label>
          <input className='casetaInput'
            type="text"
            id="adresa"
            name="adresa"
            value={formData.adresa}
            onChange={handleChange}
            placeholder="  Adresa, bloc, apartament"
            required
          />
        </div>
        <div className="form-group1">
          <label htmlFor="oras">Oraș: </label>
          <input className='casetaInput'
            type="text"
            id="oras"
            name="oras"
            value={formData.oras}
            onChange={handleChange}
            placeholder="  Iași"
            required
          />
        </div>
        <div className="form-group1">
          <label htmlFor="judet">Județ: </label>
          <select className='judet'
            id="judet"
            name="judet"
            placeholder="  Selectează un județ"
            value={formData.judet}
            onChange={handleChange}
            required
          >
            <option value=" "className='culoa' >  Selectează un județ:</option>
            {counties.map((county, index) => (
              <option key={index} value={county}>{county} </option>
            ))}
          </select>
        </div>
        <div className="form-group1">
          <label htmlFor="zip">Cod Poștal:</label>
          <input className='casetaInput'
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="  123456"
            required
          />
        </div>
        <br></br>
        <button className="submittt">Trimitere comandă</button>
      </form>

      {/* Afisarea erorii */}
      {error && (
        <div>
          <p>Eroare: {error}</p>
        </div>
      )}
    </div>
  );
};

export default AddressForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateRangeIcon from '@mui/icons-material/DateRange';
import "./cart-item.css";

export const CartItem = (props) => {
  const { serviceId } = props.data;
  const [startDate, setStartDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    if (serviceId) {
      fetchAvailability(serviceId);
    }
  }, [serviceId]);

  const fetchAvailability = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/services/${id}/availability`);
      setAvailability(response.data.availability); // presupunând că response.data.availability este un array de obiecte { startDate, endDate }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setConfirmed(false);
  };

  const confirmDates = () => {
    console.log("Selected Date:", startDate);
    setShowDatePicker(false);
    setConfirmed(true);
  };

  const filterDate = (date) => {
    const today = new Date();
    const endOfNextWeek = new Date();
    endOfNextWeek.setDate(today.getDate() + (7 - today.getDay()) + 7);

    return date >= today && date <= endOfNextWeek;
  };

  return (
    <div className="cartItem">
      <div className="description">
        <div className="dateSelection">
          <button onClick={() => setShowDatePicker(!showDatePicker)}>
            <DateRangeIcon />
            {showDatePicker ? " Ascunde Calendarul" : " Selectează Data"}
          </button>
          {showDatePicker && (
            <div className="datePickerContainer">
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                minDate={new Date()}
                inline
                filterDate={filterDate}
              />
              <button onClick={confirmDates}>Confirmă Data</button>
              <button onClick={() => setShowDatePicker(false)}>Închide</button>
            </div>
          )}
          {confirmed && startDate && (
            <p>
              Ai ales data de {startDate.toLocaleDateString()}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

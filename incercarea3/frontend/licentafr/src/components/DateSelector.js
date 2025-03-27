// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const DateSelector = ({ serviceId, onDatesSelected }) => {
//   const [availability, setAvailability] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);

//   useEffect(() => {
//     const fetchAvailability = async () => {
//       try {
//         const response = await fetch(`/availability/${serviceId}`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Fetched availability data:', data);
//         const availableDates = data.map(entry => {
//           const startDate = parseDate(entry.start_date);
//           return startDate; 
//         });
//         setAvailability(availableDates);
//       } catch (error) {
//         console.error('Error fetching availability:', error);
//         setError('Could not load availability data.');
//       }
//     };

//     fetchAvailability();
//   }, [serviceId]);

//   const parseDate = (dateString) => {
//     const [year, month, day] = dateString.split('/').map(Number);
//     return new Date(year, month - 1, day);
//   };

//   const isDateSelectable = date => {
//     return availability.some(availDate =>
//       isSameDay(availDate, date)
//     );
//   };

//   const isSameDay = (date1, date2) => {
//     return (
//       date1.getDate() === date2.getDate() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getFullYear() === date2.getFullYear()
//     );
//   };

//   const handleDateChange = date => {
//     setSelectedDate(date);
//     onDatesSelected(date);
//   };

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <DatePicker
//       selected={selectedDate}
//       onChange={handleDateChange}
//       inline
//       filterDate={isDateSelectable}
//       highlightDates={availability.map(date => new Date(date))}
//     />
//   );
// };

// export default DateSelector;
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateSelector = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates] = useState([
    new Date('2024-06-27'),
    new Date('2024-06-28'),
    new Date('2024-06-29'),
    new Date('2024-08-01'),
    new Date('2024-08-02'),
    new Date('2024-08-03'),
    new Date('2024-08-04'),
    new Date('2024-08-05'),
    new Date('2024-08-06'),
    new Date('2024-08-07'),
    new Date('2024-08-08')
  ]);

  const isDateSelectable = date => {
    // Verificăm dacă data este în intervalul permis
    return availableDates.some(availDate => isSameDay(availDate, date));
  };

  const isSameDay = (date1, date2) => {
    // Funcție pentru a verifica dacă două date sunt în aceeași zi
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    // Aici poți adăuga orice logică suplimentară pentru gestionarea selecției datei
    console.log('Selected date:', date);
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      inline
      filterDate={isDateSelectable}
    />
  );
};

export default DateSelector;

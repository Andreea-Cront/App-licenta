//NotificationComponent.js
import React, { useEffect, useState } from 'react';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000'); // Adjust the URL if needed

    socket.onmessage = (event) => {
      const message = event.data;
      setNotifications(prevNotifications => [...prevNotifications, message]);
      alert(message); // Handle the notification as needed
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;

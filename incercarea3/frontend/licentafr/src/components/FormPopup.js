// FormPopup.js
import React, { useEffect } from 'react';
import Oferta from  "./oferta";
const FormPopup = ({ isOpen, toggleForm, handleSubmit }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                toggleForm();
            }
        };

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [toggleForm]);

    return (
        <div className={`form-popup ${isOpen ? 'open' : ''}`}>
            <div className="popup-content">
                <button className="close-button" onClick={toggleForm}>X</button>
                <Oferta handleSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default FormPopup;

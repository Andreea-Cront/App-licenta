//ApproveService.js
import React, { useState, useEffect } from 'react';
import './ApproveService.css';

function ApproveService() {
  const [isChecked, setIsChecked] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [rejectionStatus, setRejectionStatus] = useState('');

  const styles = {
    highlightBox: {
      border: '1px solid black',
      borderRadius: '10px',
      marginTop: '30px',
      backgroundColor: 'transparent',
      width: '300px',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: '17px',
      justifyContent:'space-between',
    },
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id_order = urlParams.get('id_order');
    const id_service = urlParams.get('id_service');
    const token = urlParams.get('token');

    
    console.log(`Fetching data with id_order=${id_order}, id_service=${id_service}, token=${token}`);

    fetch(`http://localhost:3000/approve-service?id_order=${id_order}&id_service=${id_service}&token=${token}`)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched from server:', data);
        if (data.success) {
          setOrderData(data);
        } else {
          setApprovalStatus('failed');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setApprovalStatus('failed');
      });
  }, []);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    setIsRejected(false); // Deselect rejection checkbox when approval checkbox is checked
  };
  const handleRejectionCheckboxChange = (event) => {
    setIsRejected(event.target.checked);
    setIsChecked(false); // Deselect approval checkbox when rejection checkbox is checked
  };

  const handleRejection = async () => {
    if (!isRejected) {
      alert('Trebuie să confirmați că doriți să respingeți această acțiune.');
      return;
    }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id_order = urlParams.get('id_order');
    const id_service = urlParams.get('id_service');
    const token = urlParams.get('token');

    const response = await fetch(`http://localhost:3000/reject-service?id_order=${id_order}&id_service=${id_service}&token=${token}&confirmation=true`);
    const data = await response.json();

    if (data.success) {
      setRejectionStatus('rejected');
    } else {
      setRejectionStatus('failed');
    }
  } catch (error) {
    setRejectionStatus('failed');
  }
};


  const handleApproval = () => {
    if (!isChecked) {
      alert('Trebuie să confirmați acțiunea');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id_order = urlParams.get('id_order');
    const id_service = urlParams.get('id_service');
    const token = urlParams.get('token');

    fetch(`http://localhost:3000/approve-service?id_order=${id_order}&id_service=${id_service}&token=${token}&confirmation=true`)
      .then(response => response.json())
      .then(data => {
        setApprovalStatus(data.success ? 'approved' : 'failed');
      })
      .catch(error => {
        console.error('Error:', error);
        setApprovalStatus('failed');
      });
  };

  const handleShowClientDetails = () => {
    setShowClientDetails(!showClientDetails);
  };

  const handleShowServiceDetails = () => {
    setShowServiceDetails(!showServiceDetails);
  };

  const renderClientDetails = () => {
    if (!orderData) return null;

    const { order } = orderData;
    if (order && (order.tip_serviciu === 'renovari' || order.tip_serviciu === 'instalatii')) {
      return (
        <div>
          <h2>Detalii client:</h2>
          <p><strong>Nume:</strong> {order.nume}</p>
          <p><strong>Prenume:</strong> {order.prenume}</p>
          <p><strong>Telefon:</strong> {order.phone}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Adresă:</strong> {order.adresa}</p>
          <p><strong>Oras:</strong> {order.oras}</p>
          <p><strong>Judet:</strong> {order.judet}</p>
          <p><strong>Cod Poștal:</strong> {order.zip}</p>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Detalii client:</h2>
          <p><strong>Nume:</strong> {order.nume}</p>
          <p><strong>Prenume:</strong> {order.prenume}</p>
          <p><strong>Telefon:</strong> {order.phone}</p>
          <p><strong>Email:</strong> {order.email}</p>
        </div>
      );
    }
  };
  const renderServiceDetails = () => {
    if (!orderData) return null;

    const { services } = orderData;

    return services.map((service, index) => (
      <div key={index}>
        <h3>Detalii serviciu {index + 1}:</h3>
        <p><strong>Nume serviciu:</strong> {service.nume_serviciu}</p>
        <p><strong>Descriere serviciu:</strong> {service.descriere_serviciu}</p>
        <p><strong>Preț:</strong> {service.pret} lei</p>
        <p><strong>Tip Serviciu:</strong> {service.tip_serviciu}</p>
      </div>
    ));
  };

  return (
    <div className='aprobare'>
      <br />
      {orderData && (
        <h1>Aprobare serviciu pentru: {orderData.order.email}</h1>
      )}
      {orderData ? (
        <div>
          <button className='butonAfisareDetalii' onClick={handleShowClientDetails}>
            {showClientDetails ? 'Ascunde Detalii Client' : 'Afișează Detalii Client'}
          </button>
          {showClientDetails && renderClientDetails()}
          <button className='butonAfisareDetalii' onClick={handleShowServiceDetails}>
            {showServiceDetails ? 'Ascunde Detalii Serviciu' : 'Afișează Detalii Serviciu'}
          </button>
          {showServiceDetails && renderServiceDetails()}
        </div>
      ) : (
        <p>Încărcare detalii comandă...</p>
      )}
      <br />
      <br />
      <p style={styles.highlightBox}>
        <input
          className='aprobareServiciu'
          type="checkbox"
          id="confirmationCheckbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="confirmationCheckbox">
          Confirm că doresc să aprob această acțiune
        </label>
        <br />
        <button className='butonAprobare' onClick={handleApproval}>
          Aprobă Serviciu
        </button>
        {approvalStatus === 'approved' && <p>Serviciul a fost aprobat cu succes!</p>}
        {approvalStatus === 'failed' && <p>A apărut o eroare la aprobarea serviciului.</p>}
      </p>
      <p style={styles.highlightBox}>
        <input
          className='respingereServiciu'
          type="checkbox"
          id="rejectionCheckbox"
          checked={isRejected}
          onChange={handleRejectionCheckboxChange}
        />
        <label htmlFor="rejectionCheckbox">
          Confirm că doresc să resping această acțiune
        </label>
        <br />
        <button className='butonRespingere' onClick={handleRejection}>
          Respinge Serviciu
        </button>
        {rejectionStatus === 'rejected' && <p>Serviciul a fost respins cu succes!</p>}
        {rejectionStatus === 'failed' && <p>A apărut o eroare la respingerea serviciului.</p>}
      </p>
    </div>
  );
}  

export default ApproveService;

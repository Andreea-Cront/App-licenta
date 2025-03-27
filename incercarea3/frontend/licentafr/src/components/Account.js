//Account.js
import React, { useState } from 'react';
import './Account.css';
import { Link } from 'react-router-dom';
import Formular from './Formular'; 

function Account() {
    const [showForm, setShowForm] = useState(false); 

    const toggleForm = () => {
        setShowForm(!showForm);  
    };

    return (
<div className='account'>
    <br></br>
        <section >
    <br></br>
    <br></br>

            <div className="con mb-5">
                <div className="text-center mb-5 pt-3">
                    <h3 className="inregistrare">Înregistrează un cont nou</h3>
                    <p className=" fs-18">Alege tipul de cont potrivit pentru tine</p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-5 mb-3">
                        <div className="card card-style-1 bb-0 h-100">
                            <div className="card-body pb-1">
                                <span className="h3 d-block fw-bold mb-2">Client</span>
                                <div className="mb-4 text-muted2">
                                    Dacă ești în căutarea unui serviciu utilitar, alege acest tip de cont.
                                </div>
                                <span className="text-muted d-block mb-2 fw-bold">Beneficiezi de</span>
                                <div className="list-green-check">
                                    <ul className="list-green-check mb-3">
                                        <li><span className="check">&#10004;</span> Acces la o gamă largă de servicii;</li>
                                        <li><span className="check">&#10004;</span> Transparența prețurilor;</li>
                                        <li><span className="check">&#10004;</span> Recenzii și evaluări de la alți clienți;</li>
                                        <li><span className="check">&#10004;</span> Posibilitatea de a crea o cerere personalizată;</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-footer border-top-0 bg-transparent">
                                <div className="d-grid">
                                    <Link to='/signup' className="buttonp">Mă înregistrez</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 mb-3">
                        <div className="card card-style-1 bb-1 h-100">
                            <div className="card-body pb-1">
                                <span className="h3 d-block fw-bold mb-2">Furnizor</span>
                                <div className="mb-4 text-muted2">
                                    Dacă ești în căutare de clienți, alege acest tip de cont.
                                </div>
                                <span className="text-muted d-block mb-2 fw-bold">Beneficiezi de</span>
                                <div className="list-green-check">
                                    <ul className="list-green-check mb-3">
                                        <li><span className="check">&#10004;</span> Creșterea vizibilității și a recunoașterii brandului;</li>
                                        <li><span className="check">&#10004;</span> Feedback constructiv și îmbunătățirea serviciilor;</li>
                                        <li><span className="check">&#10004;</span> Acces la resurse și suport tehnic;</li>

                                    </ul>
                                </div>
                            </div>
                            <div className="card-footer border-top-0 bg-transparent">
                                <div className="d-grid">
                                    <button00 className="buttonspreformular" onClick={toggleForm}>Mă înregistrez</button00>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formular pop-up */}
            {showForm && <Formular toggleForm={toggleForm} />}
        </section>
        </div>
    );
}

export default Account;

import React, { useState } from 'react';
import './oferta.css';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';


const Oferta = () => {
    const [formData, setFormData] = useState({ name: '', detalii: '', email: '', phone: '', suprafata: '', tip_serviciu: '', locatie_renovare: '', include_materiale: '', tip_renovare: [], tip_auto: [], tip_instalatii: [],judet:'',localitate:'' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showLocatieRenovare, setShowLocatieRenovare] = useState(false);
    const [showIncludeMateriale, setShowIncludeMateriale] = useState(false);
    const [showDetalii, setShowDetalii] = useState(false);
    const [showSuprafata, setShowSuprafata] = useState(false);
    const [showTipRenovare, setShowTipRenovare] = useState(false);
    const [showAutoOptions, setShowAutoOptions] = useState(false);
    const [showInstalatiiOptions, setShowInstalatiiOptions] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if ((name === 'tip_renovare' || name === 'tip_auto' || name === 'tip_instalatii') && type === 'checkbox') {
            const targetArray = name === 'tip_renovare' ? 'tip_renovare' : (name === 'tip_auto' ? 'tip_auto' : 'tip_instalatii');
            if (checked) {
                setFormData(prevData => ({
                    ...prevData,
                    [targetArray]: [...prevData[targetArray], value]
                }));
            } else {
                setFormData(prevData => ({
                    ...prevData,
                    [targetArray]: prevData[targetArray].filter(item => item !== value)
                }));
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });

            if (name === 'tip_serviciu') {
                if (value === 'renovari') {
                    setShowLocatieRenovare(true);
                    setShowIncludeMateriale(true);
                    setShowInstalatiiOptions(false);
                    setShowAutoOptions(false);
                    setShowDetalii(false);
                    setShowSuprafata(false);
                    setShowTipRenovare(false);
                } else if (value === 'auto') {
                    setShowLocatieRenovare(false);
                    setShowIncludeMateriale(false);
                    setShowInstalatiiOptions(false);
                    setShowAutoOptions(true);
                    setShowDetalii(true);
                    setShowSuprafata(false);
                    setShowTipRenovare(false);
                } else if (value === 'instalatii') {
                    setShowLocatieRenovare(false);
                    setShowIncludeMateriale(false);
                    setShowInstalatiiOptions(true);
                    setShowAutoOptions(false);
                    setShowDetalii(true);
                    setShowSuprafata(false);
                    setShowTipRenovare(false);
                }
            }

            if (name === 'locatie_renovare') {
                if (value === 'curte') {
                    setShowDetalii(true);
                    setShowSuprafata(true);
                    setShowTipRenovare(false);
                } else if (value === 'locuinta') {
                    setShowDetalii(true);
                    setShowSuprafata(false);
                    setShowTipRenovare(true);
                }
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Trimite date:', formData);

            const response = await axios.post('http://localhost:8081/inregistrare-oferta', formData);

            console.log('Răspuns server:', response);

            if (response.status === 200) {
                setSuccessMessage('Oferta a fost trimisă cu succes');
                setFormData({ name: '', detalii: '', email: '', phone: '', suprafata: '', tip_serviciu: '', locatie_renovare: '', include_materiale: '', tip_renovare: [], tip_auto: [], tip_instalatii: [] ,judet:'',localitate:''});
                setErrorMessage('');
            } else {
                setErrorMessage('Eroare la trimiterea ofertei');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Eroare la trimiterea ofertei');
            setSuccessMessage('');
            console.error('Eroare:', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1); 
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
            <br />
            <br />
            <form className="oferta-form" onSubmit={handleFormSubmit}>
                <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder=" Nume Prenume" required />
                <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input className="form-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder=" Telefon" required />
                <input className="form-inputjl" type="text" name="judet" value={formData.judet} onChange={handleChange} placeholder=" Județ" required />
                <input className="form-inputjl" type="text" name="localitate" value={formData.localitate} onChange={handleChange} placeholder=" Localitate" required />
                <select className="form-select" name="tip_serviciu" value={formData.tip_serviciu} onChange={handleChange} required>
                    <option value="">Alege tipul serviciului dorit:</option>
                    <option value="auto">Auto</option>
                    <option value="renovari">Renovari</option>
                    <option value="instalatii">Instalatii</option>
                </select>

                {showLocatieRenovare && (
                    <div>
                        <label>Alege unde să se desfășoare renovarea:</label>
                        <select className="form-select" name="locatie_renovare" value={formData.locatie_renovare} onChange={handleChange} required>
                            <option value="">Selectează locația:</option>
                            <option value="curte">Curte/Grădină</option>
                            <option value="locuinta">Locuință</option>
                        </select>
                    </div>
                )}

                {showIncludeMateriale && (
                    <div>
                        <label>Doriți să se includă materialele în preț?</label>
                        <select className="form-select" name="include_materiale" value={formData.include_materiale} onChange={handleChange} required>
                            <option value="">Selectează:</option>
                            <option value="da">Da</option>
                            <option value="nu">Nu</option>
                        </select>
                    </div>
                )}

                {showAutoOptions && (
                    <div>
                        <label>Opțiuni pentru serviciul auto:</label>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_auto"
                                    value="platforma"
                                    checked={formData.tip_auto.includes('platforma')}
                                    onChange={handleChange}
                                />
                                Platformă
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_auto"
                                    value="curatare_tapiterie"
                                    checked={formData.tip_auto.includes('curatare_tapiterie')}
                                    onChange={handleChange}
                                />
                                Curățare Tapițerie
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_auto"
                                    value="electrician"
                                    checked={formData.tip_auto.includes('electrician')}
                                    onChange={handleChange}
                                />
                                Electrician
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_auto"
                                    value="vopsitorie"
                                    checked={formData.tip_auto.includes('vopsitorie')}
                                    onChange={handleChange}
                                />
                                Vopsitorie
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_auto"
                                    value="reparatii_tapiserie"
                                    checked={formData.tip_auto.includes('reparatii_tapiserie')}
                                    onChange={handleChange}
                                />
                                Reparații Tapițerie
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_auto"
                                    value="altele"
                                    checked={formData.tip_auto.includes('altele')}
                                    onChange={handleChange}
                                />
                                Altele
                            </label>
                        </div>
                    </div>
                )}

                {showInstalatiiOptions && (
                    <div>
                        <label>Ce fel de instalații aveți nevoie:</label>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_instalatii"
                                    value="electrice"
                                    checked={formData.tip_instalatii.includes('electrice')}
                                    onChange={handleChange}
                                />
                                Electrice
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_instalatii"
                                    value="sanitare"
                                    checked={formData.tip_instalatii.includes('sanitare')}
                                    onChange={handleChange}
                                />
                                Sanitare
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_instalatii"
                                    value="apa"
                                    checked={formData.tip_instalatii.includes('apa')}
                                    onChange={handleChange}
                                />
                                Apă
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_instalatii"
                                    value="gaze"
                                    checked={formData.tip_instalatii.includes('gaze')}
                                    onChange={handleChange}
                                />
                                Gaze
                            </label>
                        </div>
                    </div>
                )}

                {showSuprafata && (
                    <div>
                        <input className="form-input" type="text" name="suprafata" value={formData.suprafata} onChange={handleChange} placeholder="Suprafața curții" required />
                    </div>
                )}

                {showTipRenovare && (
                    <div>
                        <label>De ce tip de renovare ai nevoie?</label>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tip_renovare"
                                    value="completa"
                                    checked={formData.tip_renovare.includes('completa')}
                                    onChange={handleChange}
                                    disabled={formData.tip_renovare.length > 0 && !formData.tip_renovare.includes('completa')}
                                />
                                Completă
                            </label>
                        </div>
                        {!formData.tip_renovare.includes('completa') && (
                            <div className="checkbox-options">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="tip_renovare"
                                        value="baie"
                                        checked={formData.tip_renovare.includes('baie')}
                                        onChange={handleChange}
                                    />
                                    Baie
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="tip_renovare"
                                        value="bucatarie"
                                        checked={formData.tip_renovare.includes('bucatarie')}
                                        onChange={handleChange}
                                    />
                                    Bucătărie
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="tip_renovare"
                                        value="hol"
                                        checked={formData.tip_renovare.includes('hol')}
                                        onChange={handleChange}
                                    />
                                    Hol
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="tip_renovare"
                                        value="montaj_parchet"
                                        checked={formData.tip_renovare.includes('montaj_parchet')}
                                        onChange={handleChange}
                                    />
                                    Montaj Parchet
                                </label>
                            </div>
                        )}
                    </div>
                )}

                {showDetalii && (
                    <div>
                        <br />
                        <input className="form-input" type="text" name="detalii" value={formData.detalii} onChange={handleChange} placeholder="Detalii serviciu (tip montaj, preferințe etc.)" required />
                    </div>
                )}

                <br />
                <button className="form-button" type="submit">Trimite</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};

export default Oferta;

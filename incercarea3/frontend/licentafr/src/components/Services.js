import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import auto from './auto.png';
import renovare from './renovare.png';
import instalatii from './instalatii.png';
import services from './OIG12.jpg';
import Ceas from './ceas.png';
import review from './review.png';
import Imagine from './img.png';
import cautare from './cautare.png';
const Services = () => {
    const images = [auto, renovare, instalatii];
    const buttonLabels = ['Auto', 'Renovări', 'Instalații'];
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        backgroundColor: 'transparent' // Ensure the background is transparent
    };

    const colStyle = {
        height: '100%',
        backgroundColor: 'transparent' // Ensure the column background is transparent
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const handleButtonClick = (index) => {
        const routes = ['/auto', '/renovari', '/instalatii'];
        navigate(routes[index]);
    };

    const toggleForm = () => {
        navigate('/oferta');
    };

    const scrollToCarousel = () => {
        document.getElementById('carousel-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    const getVisibleImages = () => {
        const previousIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        const nextIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        return [images[previousIndex], images[currentIndex], images[nextIndex]];
    };

    const getVisibleLabels = () => {
        const previousIndex = (currentIndex === 0) ? buttonLabels.length - 1 : currentIndex - 1;
        const nextIndex = (currentIndex === buttonLabels.length - 1) ? 0 : currentIndex + 1;
        return [buttonLabels[previousIndex], buttonLabels[currentIndex], buttonLabels[nextIndex]];
    };

    const visibleImages = getVisibleImages();
    const visibleLabels = getVisibleLabels();


    return (
        <section className='section11'>
            <section className='section'>
                <div className='containerel'>
                    <div>
                        <div>
                            <h1 className='ha1'>Selectează categoria de servicii<br></br> care vă interesează!</h1>
                            <button onClick={scrollToCarousel} className='descopera'>
                                Descoperă
                            </button>
                        </div>
                        <div className='position:relative lg:w-1/2 overflow-hidden'>
                            <img src={services} alt='services' className='imagineService' />
                        </div>
                    </div>
                </div>
            </section>

            <section className="text-center"> 
                <br></br>
                <br></br>
                <div id="carousel-container" className="carousel-container">
                    <button onClick={handlePrevious} className="arrow left-arrow">&lt;</button>
                    <div className="imagine-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {visibleImages.map((image, index) => (
                            <div key={index} className="carousel-image-container" style={{ position: 'relative', display: 'inline-block', margin: '0 10px' }}>
                                <img
                                    src={image}
                                    alt={`carousel-${index}`}
                                    className={`carousel-image ${index === 1 ? 'highlighted' : 'blurred'}`}
                                    style={{ width: `${index === 1 ? '320px' : '310px'}` }}
                                />
                                <button 
                                    onClick={() => handleButtonClick((currentIndex + index - 1 + images.length) % images.length)} 
                                    className="image-button"
                                >
                                    {visibleLabels[index]}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleNext} className="arrow right-arrow">&gt;</button>
                </div>
                <br></br>
                <br></br> 
                <br></br>
                <br></br> 
                <br></br>
                <br></br> 
                <br></br>
                <br></br>
            </section>
        

            <section className='OfertaPersonalizata bg-red'>
            <div className="container d-none d-md-block">
                <div className="card">
                    <div className="row d-flex align-items-center">
                        <div className="col-9 order-md-1 desktop-banner-app">
                            <br></br>
                            <br></br>
                            <h3 className='ha3'>Nu ai găsit serviciul potrivit pentru tine?</h3>
                            <p className='pOferta'>Completând formularul de mai jos poți cere o ofertă personalizată</p>
                            <button onClick={toggleForm} className='butonOferta'>Deschide formularul</button>
                        </div>
                        <div className="col-3 offset-2 offset-md-0 order-1 order-md-90" style={colStyle}>
                            <div className="text-center">
                                <img src={Imagine} alt="Imagine" style={imgStyle} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
        </section>

            <section className="beneficii-wrap p-2">
                <div className="containerBeneficii">
                    <br></br>
                    <br></br>
                        <h3 className='titluBeneficii'>Beneficii</h3>
                    <br></br>
                    <br></br>
                    <div className="row beneficii-row justify-content-center">
                        <div className="beneficii-col">
                            <div className="beneficii-content">
                                <div className="beneficii-img">
                                    <img src={cautare} alt="cautare" className='cautare' />
                                </div>
                                <br></br>
                                <h5>Descoperă oferta potrivită pentru tine</h5>
                                <p>Inspiră-te din numeroasele servicii și alege ceva pe gustul tău</p>
                            </div>
                            <br></br>
                        </div>
                        <div className="col-md-6 col-lg-4 beneficii-col">
                            <div className="beneficii-content">
                                <div className="beneficii-img">
                                    <img src={Ceas} alt="Ceas" className='ceas' />
                                </div>
                                <br></br>
                                <h5>Economisește timp</h5>
                                <p>Prin ideea unui magazin online, reducem complexitatea și timpul necesar pentru încheiarea unei afaceri</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 beneficii-col">
                            <div className="beneficii-content">
                                <div className="beneficii-img">
                                    <img src={review} alt='' className='review'/>
                                </div>
                                <br></br>
                                <h5>Citește părerile clienților</h5>
                                <p>Alege dintre furnizorii recomandați de persoanele mulțumite de serviciile primite</p>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
            </section>
        </section>
    );
};

export default Services;

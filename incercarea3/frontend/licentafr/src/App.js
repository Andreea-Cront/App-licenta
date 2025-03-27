
// App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderS from './HeaderS';
import Header2 from './HeaderProfil';
import Header from './Header';
import Footer from './footer';
import Contact from './components/Contact'; 
import Account from './components/Account';
import Services from './components/Services';
import Home from './components/Home';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Formular from './components/Formular';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


import Signup from './components/Signup';
import Auto from './components/auto';
import Renovari from './components/renovari';
import Instalatii from './components/instalatii';
import ApproveService from './components/ApproveService';
import Oferta from './components/oferta';
import Calendar from './components/Calendar';
import CosCumparaturi from './components/CosCumparaturi';
import {Cart} from './components/cart';
import { ShopContextProvider } from "./components/shop-context";
import CheckoutPage from './components/CheckoutPage';
import { useEffect, useState } from 'react';
import Submit from './components/submit';
import axios from 'axios';
import ServiceForm from './components/postForm';
import ServiceList from './components/paginaServiciiCompanie';
//import NotificationComponent from './components/NotificationComponent';
import TermsAndConditions from './components/TermsAndConditions';
import ProfilePage from './cont/ProfilePage';
import Orders from './cont/Orders';
import Cereri from './cont/Cereri';

import Settings from './cont/Settings';
import Profile from './components/Profile';
import Oportunitati from './companie/veziOferte';
import PostareServicii from './companie/PostareServicii';
import ServiciiCompanie from './companie/ServiciiCompanie';
import ProfilCompanie from './companie/ProfilCompanie';
import ComenzileMele from './companie/ComenzileMele';


//import { UserContext } from './components/UserContext';



function App() {
  const [services, setServices] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Doresc să adaug un serviciu');
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async (service) => {
    try {
      const response = await axios.post('http://localhost:3000/services', service);
      setServices([...services, response.data]);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible); // Inversează starea de vizibilitate a formularului
    setButtonText(isFormVisible ? 'Deschide formularul' : 'Închide formularul');
  };
  return (
    
    <ShopContextProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Common layout for other routes */}
          <Route element={<CommonLayout />}>
            <Route path="services" element={<Services />} />
            </Route>
            <Route element={<CommonLayout1 />}>
            <Route path="Account" element={<Account />} />
          </Route>
          <Route element={<CommonLayout2 />}>
            <Route path="Auto" element={<auto />} />
          </Route>
          <Route element={<CommonLayout3 />}>
            <Route path="Cart" element={<cart />} />
          </Route>
          <Route element={<CommonLayout4 />}>
            <Route path="Renovari" element={<renovari />} />
          </Route>
          <Route element={<CommonLayout5 />}>
            <Route path="Instalatii" element={<instalatii />} />
          </Route>
          <Route element={<CommonLayout6 />}>
            <Route path="Submit" element={<submit />} />
          </Route>
          <Route element={<CommonLayoutProfilePage />}>
            <Route path="ProfilePage" element={<ProfilePage />} />
          </Route>
          <Route element={<CommonLayoutOrdersPage />}>
            <Route path="Orders" element={<Orders />} />
          </Route>
          <Route element={<CommonLayoutSettingsPage />}>
            <Route path="Settings" element={<Settings />} />
          </Route>
          <Route element={<CommonLayoutCereriPage />}>
            <Route path="Cereri" element={<Cereri />} />
          </Route>
  <Route path='/login' element={<Login />}></Route> 
  <Route path='/ForgotPassword' element={<ForgotPassword />}></Route> 
  <Route path='/reset-password' element={<ResetPassword />}></Route> 
  
  <Route path='/Signup' element={<Signup />}></Route>
  <Route path='/formular' element={<Formular/>}></Route>
  <Route path='/oferta' element={<Oferta/>}></Route>
  <Route path='/calendar' element={<Calendar/>}></Route>
  <Route path='/CosCumparaturi' element={<CosCumparaturi/>}></Route>
  <Route path='/cart' element={<Cart/>}/>
  <Route path='/auto' element={<Auto/>}></Route>
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path='/renovari' element={<Renovari/>}></Route>
  <Route path='/instalatii' element={<Instalatii/>}></Route>
  <Route path='/submit' element={<Submit />} ></Route>
  <Route path="/approve-service" element={<ApproveService />} ></Route>
  <Route path="/profile" element={<Profile />} />
  <Route path="/veziOferte" element={<Oportunitati />} />
  <Route path="/ServiciiCompanie" element={<ServiciiCompanie />} />
  <Route path="/PostareServicii" element={<PostareServicii />} />
  <Route path="/ProfilCompanie" element={<ProfilCompanie />} />
  <Route path="/ComenzileMele" element={<ComenzileMele />} />

  <Route path="/TermsAndConditions" element={
                <>
                  <Header2 />
                  <TermsAndConditions />
                  
                </>
              } ></Route>
  <Route path="/ProfilePage" element={<ProfilePage/>}> </Route>
  <Route path="/Orders" element={<Orders/>}> </Route>

  <Route
              path="manage-services"
              element={
                <>
                  <HeaderS />
                  <br></br>
                  <button onClick={toggleFormVisibility}>{buttonText}</button>
                  {isFormVisible && <ServiceForm onAddService={handleAddService} />}
                  <ServiceList services={services} />
                </>
              }
            />
          <Route path="contact" element={<Contact />} />
        </Routes>
  </div>
    </Router>
    </ShopContextProvider>
  );
}
function HomeLayout({ children }) {
  return (
    <>
      <Header />
     <Home />
    </>
  );
}

function CommonLayout({ children }) {
  return (
    <>
       <HeaderS /> 
            <Services />
      <Footer />
    </>
  );
}

function CommonLayout1({ children }) {
  return (
    <>
      <Header2 />
      <Account/>
    </>
  );
}


function CommonLayout2({ children }) {
  return (
    <>
      <HeaderS />
      <br></br>
      <Auto/>
    </>
  );
}

function CommonLayout4({ children }) {
  return (
    <>
      <Header />
      <br></br>
      <Renovari/>
      
    </>
  );
}
function CommonLayout5({ children }) {
  return (
    <>
      <Header />
      <br></br>
      <Instalatii/>
      
    </>
  );
}
function CommonLayout3({ children }) {
  return (
    <>
      <HeaderS />
      <br></br>
      <Cart/>
    </>
  );
}
function CommonLayout6({ children }) {
  return (
    <>
      <Header2 />
      <Submit/>
    </>
  );
}
function CommonLayoutProfilePage({ children }) {
  return (
    <>
      <Header2 />
      <ProfilePage/>
    </>
  );
}
function CommonLayoutOrdersPage({ children }) {
  return (
    <>
      <Header2 />
      <Orders/>
    </>
  );
}
function CommonLayoutSettingsPage({ children }) {
  return (
    <>
      <Header2 />
      <Settings/>
    </>
  );
}
function CommonLayoutCereriPage({ children }) {
  return (
    <>
      <Header2 />
      <Cereri/>
    </>
  );
}
export default App;



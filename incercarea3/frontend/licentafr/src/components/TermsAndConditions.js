//TermsAndConditions.js
import React from 'react';
import './TermsAndConditions.css'; // Asigură-te că ai un fișier CSS pentru stilizare
import Footer from '../footer';

const TermsAndConditions = () => {
  return (
    <div className='paginaTermeni'>
      <br></br>
      <br></br>
      <br></br>

    <div className="terms-container">
      <h1 id="termeni">Termeni și Condiții</h1>
      
      <div className="toc">
        <h2>Cuprins</h2>
        <ul>
          <li><a href="#definitii"> Definiții</a></li>
          <li><a href="#inregistrarea-si-conturi"> Înregistrarea și Conturi</a></li>
          <li><a href="#utilizarea-aplicatiei"> Utilizarea Aplicației</a></li>
          <li><a href="#politica-de-confidentialitate"> Politica de Confidențialitate</a></li>
          <li><a href="#raspunderea"> Răspunderea</a></li>
          <li><a href="#rezilierea"> Rezilierea</a></li>
          <li><a href="#modificari-ale-termenilor-si-conditiilor"> Modificări ale Termenilor și Condițiilor</a></li>
          <li><a href="#contact"> Contact</a></li>
        </ul>
      </div>
      
      <h2 id="definitii">1. Definiții</h2>
      <ul>
        <li><strong>Client</strong>: Persoana fizică sau juridică care achiziționează servicii de pe site.</li>
        <li><strong>Companie</strong>: Entitatea care postează oferte de servicii pe site.</li>
        <li><strong>Servicii</strong>: Toate serviciile utilitare oferite prin intermediul aplicației noastre.</li>
      </ul>
      
      <h2 id="inregistrarea-si-conturi">2. Înregistrarea și Conturi</h2>
      <ul>
        <li><strong>Înregistrarea</strong>: Pentru a utiliza aplicația, clienții și companiile trebuie să își creeze un cont furnizând informații corecte și complete.</li>
        <li><strong>Confidențialitatea Contului</strong>: Sunteți responsabil pentru menținerea confidențialității datelor de autentificare și pentru toate activitățile care au loc în contul dumneavoastră.</li>
      </ul>
      
      <h2 id="utilizarea-aplicatiei">3. Utilizarea Aplicației</h2>
      <ul>
        <li><strong>Postarea de Servicii</strong>: Companiile pot posta oferte de servicii, respectând cerințele și normele impuse de aplicație.</li>
        <li><strong>Achiziționarea de Servicii</strong>: Clienții pot achiziționa servicii postate de companii, prin intermediul funcționalităților aplicației.</li>
        <li><strong>Plata Ramburs</strong>: Plata pentru serviciile achiziționate se va face ramburs, la momentul livrării sau finalizării serviciului.</li>
      </ul>
      
      <h2 id="politica-de-confidentialitate">4. Politica de Confidențialitate</h2>
      <ul>
        <li><strong>Colectarea Datelor</strong>: Colectăm și utilizăm informațiile dumneavoastră personale în conformitate cu politica noastră de confidențialitate.</li>
        <li><strong>Protecția Datelor</strong>: Ne angajăm să protejăm informațiile personale ale utilizatorilor noștri și să le utilizăm numai în scopurile pentru care au fost colectate.</li>
      </ul>
      
      <h2 id="raspunderea">5. Răspunderea</h2>
      <ul>
        <li><strong>Limitarea Răspunderii</strong>: Aplicația nu este responsabilă pentru calitatea serviciilor furnizate de companii. Orice dispută între client și companie trebuie rezolvată între părțile implicate.</li>
        <li><strong>Declinarea Responsabilității</strong>: Aplicația nu garantează că serviciile oferite vor satisface toate cerințele și așteptările utilizatorilor.</li>
      </ul>
      
      <h2 id="rezilierea">6. Rezilierea</h2>
      <ul>
        <li><strong>Rezilierea de Către Utilizator</strong>: Utilizatorii pot închide contul lor în orice moment, prin intermediul setărilor contului.</li>
        <li><strong>Rezilierea de Către Aplicație</strong>: Ne rezervăm dreptul de a închide conturi sau de a restricționa accesul la aplicație în caz de încălcare a acestor termeni și condiții.</li>
      </ul>
      
      <h2 id="modificari-ale-termenilor-si-conditiilor">7. Modificări ale Termenilor și Condițiilor</h2>
      <p>
        Ne rezervăm dreptul de a modifica acești termeni și condiții în orice moment. Orice modificări vor fi postate pe această pagină și vor intra în vigoare imediat după postare. 
        Este responsabilitatea utilizatorilor să verifice periodic această pagină pentru a fi la curent cu orice modificări.
      </p>
      
      <h2 id="contact">8. Contact</h2>
      <p>
        Pentru orice întrebări sau nelămuriri legate de acești termeni și condiții, vă rugăm să ne contactați la "crontgiorgiana@gmail.com".
      </p>
      
      <p>
        Prin utilizarea aplicației ServiDeal, confirmați că ați citit, înțeles și acceptat acești termeni și condiții.
      </p>
    </div>
    <br></br>
    <Footer/>
        </div>
  );
};

export default TermsAndConditions;

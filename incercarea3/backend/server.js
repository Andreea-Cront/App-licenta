//server.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import mysql from 'mysql2';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import util from 'util';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import { randomBytes } from 'crypto';

console.log('Server script started');

const app = express();
app.use(cookieParser());


// Încărcăm variabilele din fișierul .env (email și parola email-ului)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });


// Configurare sesiuni
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // false pentru că folosesc http
      maxAge: 1000 * 60 * 60 * 24, // 24 ore
    },
  })
);


// Middleware pentru parsarea datelor de tip JSON
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET','PUT','DELETE'],
    credentials: true,
  })
);


if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error(
    'Vaiabilele EMAIL_USER or EMAIL_PASS nu sunt definite.'
  );
} else {
  console.log('Email user:', process.env.EMAIL_USER);
}


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'app_licenta',
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});
const dbPromise = db.promise();
// Promisify the db.query method
const query = util.promisify(db.query).bind(db);


const sendEmail = async (recipientEmail, subject, text) => {
  console.log('Preparing to send email to:', recipientEmail);
  console.log('Email subject:', subject);
  console.log('Email content:', text);
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Funcție pentru trimiterea emailurilor
const sendApprovalEmails = () => {

const sql = `SELECT id_companie, email FROM companies WHERE aprobat = 1 AND notified = 0`;
  db.query(sql, (err, results) => {
    if (err) throw err;

    results.forEach((user) => {
      const mailOptions = {
        from: 'crontgiorgiana@gmail.com',
        to: user.email,
        subject: 'Aprobarea contului',
        text: 'Contul dumneavoastră a fost aprobat! De acum vă puteți conecta și folosi aplicația ServiDeal!',
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log(`Email trimis la: ${user.email}`);

        const updateSql = `UPDATE companies SET notified = 1 WHERE id_companie = ? AND aprobat=1`;
        db.query(updateSql, [user.id_companie], (err, result) => {
          if (err) throw err;
          console.log(`Utilizatorul cu id-ul ${user.id_companie} a fost notificat.` );
        });
      });
    });
  });
};
const sendReviewEmails = () => {
    // Selectează utilizatorii aprobați în ultimele 5 minute
    const sql = `SELECT id_companie, email FROM companies WHERE aprobat = 1 AND notified = 0`;
    
      db.query(sql, (err, results) => {
        if (err) throw err;
    
        results.forEach((user) => {
          const mailOptions = {
            from: 'crontgiorgiana@gmail.com',
            to: user.email,
            subject: 'Aprobarea contului',
            text: 'Contul tau a fost aprobat!',
          };
    
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log(`Email trimis la: ${user.email}`);
    
    
            // Actualizează coloana `notified` pentru a evita retrimiterea emailului
            const updateSql = `UPDATE companies SET notified = 1 WHERE id_companie = ? AND aprobat=1`;
            db.query(updateSql, [user.id_companie], (err, result) => {
              if (err) throw err;
              console.log(
                `Utilizatorul cu id-ul ${user.id_companie} a fost notificat.`
              );
            });
          });
        });
      });
    };

// Verifică utilizatorii aprobați la fiecare minut
setInterval(sendApprovalEmails, 60000);

const secretKey = process.env.SESSION_SECRET; 

// Function to generate a secure token for approval links
const generateApprovalToken = (id_order, id_service) => {
    const payload = {
      id_order,
      id_service,
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1440m' }); // Tokenul expiră în 24 de ore
  };

const getOrderDetails = async (serviceIds) => {
  try {
    const sql = `SELECT * FROM services WHERE id_serviciu IN (?)`;
    const results = await query(sql, [serviceIds]);
    return results;
  } catch (error) {
    console.error('Error retrieving service details:', error);
    throw error;
  }
};


const getCompanyEmail = async (id_companie) => {
  try {
    const sql = `SELECT email FROM companies WHERE id_companie = ?`;
    const results = await query(sql, [id_companie]);
    return results[0].email;
  } catch (error) {
    console.error('Error retrieving company email:', error);
    throw error;
  }
};


function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

// Middleware pentru autentificare
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      return next();
    }
    res.status(401).send('Not authenticated');
  };
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Toate câmpurile trebuie completate!' });
    }

    try {
        // verifica daca email exista deja
        const checkEmailSql = 'SELECT email FROM users WHERE email = ?';
        const [checkEmailResult] = await dbPromise.query(checkEmailSql, [email]);
        if (checkEmailResult.length > 0) {
            return res.status(409).json({ message: 'Email-ul există deja' });
        }

        // parola este hash-uita
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insereaza noul utilizator in baza de date
        const insertUserSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await dbPromise.query(insertUserSql, [name, email, hashedPassword]);

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
    }
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: 'Toate câmpurile trebuie completate!' });
  }

  // Query pentru a căuta în ambele tabele, respectând numele coloanelor diferite
  const sql = `
      SELECT 'user' as userType, id, email, password FROM users WHERE email = ?
      UNION
      SELECT 'company' as userType, id_companie as id, email, password FROM companies WHERE email = ? AND aprobat=1
  `;
  
  db.query(sql, [email, email], async (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: "Email-ul sau parola nu se potrivesc" });
      }

      // Verificăm fiecare rezultat pentru a găsi o potrivire a parolei
      let matchFound = false;
      for (let i = 0; i < results.length; i++) {
          const user = results[i];
          const passwordMatch = await bcrypt.compare(password, user.password);
          
          if (passwordMatch) {
              // Salvăm informațiile utilizatorului sau companiei în funcție de tipul de utilizator
              req.session.userId = user.id;
              req.session.email = user.email;
              req.session.userType = user.userType; // Salvez tipul de utilizator
              console.log(`Utilizator conectat: Email - ${user.email}, ID - ${user.id}, Utilizatorul este - ${user.userType}`);
              res.cookie('session-id', req.session.id, {
                maxAge: 1000 * 60 * 60 * 24, // Durata de viață a cookie-ului, similar cu configurația de sesiune
                httpOnly: true, 
                secure: false, 
                sameSite: 'none' // Setează la 'none' dacă trebuie să fie accesibil de pe alte domenii
              });
              matchFound = true;
              break;
          }
      }

      if (matchFound) {
          return res.status(200).json({ message: "Login successful", isLoggedIn: true });
      } else {
          return res.status(401).json({ message: "Email-ul sau parola nu se potrivesc" });
      }
  });
});


app.get('/profile', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ message: "Bine ai venit, ", user: { id: req.session.userId, email: req.session.email } });
});


// Verificare stare de conectare
app.get('/check-login-status', (req, res) => {
    try {
        if (req.session.userId && req.session.userType) {
            res.status(200).json({ isLoggedIn: true, userType: req.session.userType  });
        } else {
            res.status(200).json({ isLoggedIn: false });
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Logout
app.post('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//modificare date utilizator făcute de pe pagina ProfilePage
app.post('/update-profile', (req, res) => {
    const { adresa, oras, dataNastere, phone } = req.body;

    // verificare daca campurile sunt completare
    if (!adresa || !oras || !dataNastere || !phone) {
        return res.status(400).json({ message: "Toate câmpurile trebuie completate!" });
    }

    const userId = req.session.userId;

    //verificam daca utilizatorul exista si este conectat
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Modificare utilizator in baza de date
    const sql = "UPDATE users SET adresa = ?, oras = ?, dataNastere = ?, phone = ? WHERE id = ?";
    db.query(sql, [adresa, oras, dataNastere, phone, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 1) {
            return res.status(200).json({ message: "Profile updated successfully" });
        } else {
            return res.status(500).json({ message: "Failed to update profile" });
        }
    });
});


app.post('/resetPassword', isAuthenticated, (req, res) => {
    const { newPassword } = req.body;
    const userId = req.session.userId;
 
    // Verificare validitatea datelor de intrare
    if (!newPassword) {
      return res.status(400).json({ message: "Parola nouă este necesară!" });
    }
 
    // Generare hash pentru noua parolă
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: "Eroare la resetarea parolei." });
      }
 
      // Actualizare în baza de date
      const sql = 'UPDATE users SET password = ? WHERE id = ? UNION UPDATE companies SET password = ? WHERE id = ?';
      db.query(sql, [hashedPassword, userId], (error, results) => {
        if (error) {
          console.error('Error updating password in database:', error);
          return res.status(500).json({ message: "Eroare la resetarea parolei." });
        }

        console.log('Password reset successful for user:', userId);
        res.status(200).json({ message: "Parola a fost resetată cu succes!" });
      });
    });
  });
  
  const generateResetToken = () => {
    return new Promise((resolve, reject) => {
      randomBytes(32, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const token = buffer.toString('hex');
          resolve(token);
        }
      });
    });
  };
  
  
  app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      // Verificăm dacă utilizatorul există în baza de date
      const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      if (user.length === 0) {
        return res.status(404).json({ message: 'No user found with that email' });
      }
  
      // Generăm un token de resetare a parolei și stabilim expirarea token-ului
      const resetToken = await generateResetToken(); 
      const tokenExpiration = new Date(Date.now() + 3600000); 
  
      const updateQuery = 'UPDATE users SET reset_token = ?, token_expiration = ? WHERE email = ?';
      await db.promise().query(updateQuery, [resetToken, tokenExpiration, email]);
  
      // Construim link-ul de resetare a parolei care va fi trimis prin email
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      const message = `Ai cerut resetarea parolei uitate. Folosește link-ul următor: ${resetLink}`;
      await sendEmail(email, 'Password Reset Request', message);
  
      res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
      console.error('Error processing password reset:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // Verificăm token-ul în baza de date pentru a găsi utilizatorul și data de expirare a token-ului
      const result = await query('SELECT id, token_expiration FROM users WHERE reset_token = ?', [token]);
  
      if (result.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      const user = result[0];
      if (Date.now() > user.token_expiration) {
        return res.status(400).json({ message: 'Token has expired' });
      }
  
      // Hash-uim parola nouă
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Actualizăm parola utilizatorului și eliminăm token-ul de resetare din baza de date
      await query('UPDATE users SET password = ?, reset_token = NULL, token_expiration = NULL WHERE id = ?', [hashedPassword, user.id]);
  
      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
  });
  
  
//Înregistrare Companie
app.post('/register-company',async (req, res) => {
  const { name,descriere, email, phone, adresa, CUI, password, inmatriculare, tip_serviciu} = req.body;


  if ( !name || !descriere || !email ||!phone ||!adresa ||!CUI || !password ||!inmatriculare || !tip_serviciu) {
    return res.status(400).json({ message: 'Toate câmpurile trebuie completate!' });
  }
  try {
    // verifica daca email exista deja
    const checkEmailSql = 'SELECT email FROM companies WHERE email = ?';
    const [checkEmailResult] = await dbPromise.query(checkEmailSql, [email]);
    if (checkEmailResult.length > 0) {
        return res.status(409).json({ message: 'Email-ul există deja' });
    }

    // parola este hash-uita
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insereaza noul utilizator in baza de date
    const sql ='INSERT INTO companies (`name`, `descriere`, `email`, `phone`, `adresa`, `CUI`, `password`,`inmatriculare`,`tip_serviciu`) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)';
   
    await dbPromise.query(sql, [name,
        descriere,
        email,
        phone,
        adresa,
        CUI,
        hashedPassword,
        inmatriculare,
        tip_serviciu,
        false,
        false]);


    return res.status(201).json({ message: 'User registered successfully' });
} catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Database error' });
} 
});


// Endpoint pentru a obține numărul de companii
app.get('/numar-companii', (req, res) => {
  const sql = 'SELECT COUNT(*) AS numar_companii FROM companies';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Eroare la interogarea bazei de date:', err);
      return res
        .status(500)
        .json({ error: 'Eroare la interogarea bazei de date' });
    }

    const numarCompanii = result[0].numar_companii;
    res.json({ numarCompanii });
  });
});


app.get('/numar-servicii', (req, res) => {
  const sql = 'SELECT COUNT(*) AS numar_servicii FROM services';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Eroare la interogarea bazei de date:', err);
      return res
        .status(500)
        .json({ error: 'Eroare la interogarea bazei de date' });
    }

    const numarServicii = result[0].numar_servicii;
    res.json({ numarServicii });
  });
});
// app.put('/approve-company/:id', async (req, res) => { //continuarea e in docs


//   // Send email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//       res.status(500).json({ error: "Error sending email" });
//     } else {
//       console.log("Email sent:", info.response);
//       res.status(200).json({ message: "Email sent successfully" });
//     }
//   });
// });
app.post('/inregistrare-oferta', (req, res) => {
  const { name, detalii, email, phone, suprafata, tip_serviciu, locatie_renovare, include_materiale, tip_renovare, tip_auto, tip_instalatii, judet, localitate } = req.body;

  const sql = 'INSERT INTO oferte (name, detalii, email, phone, suprafata, tip_serviciu, locatie_renovare, include_materiale, tip_renovare, tip_auto, tip_instalatii, judet, localitate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  const values = [
      name, 
      detalii, 
      email, 
      phone, 
      suprafata, 
      tip_serviciu, 
      locatie_renovare, 
      include_materiale, 
      JSON.stringify(tip_renovare), 
      JSON.stringify(tip_auto), 
      JSON.stringify(tip_instalatii),
      judet,
      localitate
  ];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Eroare la inserarea datelor:', err);
          return res.status(500).send('Eroare la inserarea datelor');
      }
      res.status(200).send('Oferta a fost trimisă cu succes');
  });
});


app.post('/contact', (req, res) => {
    const sql = 'INSERT INTO recenzii (name, email, mesaj, rating) VALUES (?)';
    const values = [req.body.name, req.body.email, req.body.mesaj, req.body.rating]; // Include rating-ul în valori
    db.query(sql, [values], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
//media stelelor 
app.get('/average-rating', (req, res) => {
    const sql = 'SELECT AVG(rating) AS averageRating FROM recenzii';
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data[0]);
    });
});
  

// GET route pentru a obține companiile și serviciile asociate lor
app.get('/companies', (req, res) => {
  const sql = "SELECT * FROM companies WHERE tip_serviciu='auto'";
  db.query(sql, (err, companies) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching companies' });
    }
    res.json(companies);
  });
});

app.get('/auto-services', (req, res) => {
  const sql = `
        SELECT c.*, s.*
        FROM companies c
        JOIN services s ON c.id_companie = s.id_companie
        WHERE c.tip_serviciu = 'auto';
    `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching auto services' });
    }
    res.json(results);
  });
});
app.get('/renovari-services', (req, res) => {
  const sql = `
        SELECT c.*, s.*
        FROM companies c
        JOIN services s ON c.id_companie = s.id_companie
        WHERE c.tip_serviciu = 'renovari';
    `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching auto services' });
    }
    res.json(results);
  });
});

app.get('/instalatii-services', (req, res) => {
  const sql = `
        SELECT c.*, s.*
        FROM companies c
        JOIN services s ON c.id_companie = s.id_companie
        WHERE c.tip_serviciu = 'instalatii';
    `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching auto services' });
    }
    res.json(results);
  });
});


app.post('/orders', async (req, res) => {
  // Extrage datele din corpul cererii
    const { nume, prenume, phone, email, adresa, oras, judet, zip, id_servicii } = req.body;
  
    const serviceIds = Array.isArray(id_servicii) ? id_servicii : [id_servicii];
   
    // Verifică dacă există servicii în comandă
    if (serviceIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Nu sunt servicii în coș' });
    }
  
    try {
      const sqlSelectServiceTypes = `SELECT id_serviciu, tip_serviciu FROM services WHERE id_serviciu IN (?)`;
      const serviceTypesResult = await query(sqlSelectServiceTypes, [serviceIds]);
  
      // Crează un map pentru tipurile de servicii
      const serviceTypesMap = serviceTypesResult.reduce((acc, service) => {
        acc[service.id_serviciu] = service.tip_serviciu;
        return acc;
      }, {});
  
      // Mapază id-urile serviciilor la tipurile lor
      const serviceTypes = serviceIds.map((id) => serviceTypesMap[id]);
  
      // Inserează comanda în baza de date
      const sqlInsertOrder = `INSERT INTO orders (nume, prenume, phone, email, adresa, oras, judet, zip, id_servicii, tip_serviciu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(
        sqlInsertOrder,
        [
          nume,
          prenume,
          phone,
          email,
          adresa,
          oras,
          judet,
          zip,
          serviceIds.join(','),
          serviceTypes.join(','),
        ],
        async (error, results) => {
          if (error) {
            console.error('Error inserting data into database:', error);
            return res.status(500).json({ success: false, message: 'Failed to submit order' });
          }
  
          const id_order = results.insertId;
          console.log('Order submitted successfully with ID:', id_order);
  
          try {
            // Selectează detaliile serviciilor pentru e-mailuri
            const sqlSelectServices = `SELECT s.*, c.email AS company_email
                                       FROM services s
                                       JOIN companies c ON s.id_companie = c.id_companie
                                       WHERE s.id_serviciu IN (?)`;
            const services = await query(sqlSelectServices, [serviceIds]);
  
            // Conținutul e-mailului pentru client
            let emailContent = `Detalii comandă (ID: ${id_order}):\n\n`;
            services.forEach((service, index) => {
              emailContent += `Serviciu ${index + 1}:\n`;
              emailContent += `Nume: ${service.nume_serviciu}\n`;
              emailContent += `Descriere: ${service.descriere_serviciu}\n`;
              emailContent += `Preț: ${service.pret} lei\n`;
              emailContent += `Tip Serviciu: ${service.tip_serviciu}\n\n`;
            });
  
            console.log('Email Content:', emailContent); 
  
            await sendEmail(email, 'Confirmare comandă', emailContent);
  
             // Trimitere e-mailuri către companii
            for (const service of services) {
              const approvalToken = generateApprovalToken(id_order, service.id_serviciu);
              const approvalLink = `http://localhost:3000/approve-service?token=${approvalToken}`;
              const companyEmailContent = `S-a înregistrat o nouă comandă. Numărul comenzii: ${id_order}.
                                          \nDetalii comandă:
                                          \nServiciu: ${service.nume_serviciu}\n
                                          Descriere: ${service.descriere_serviciu}\n
                                          Preț: ${service.pret} lei.\n
                                          Tip Serviciu: ${service.tip_serviciu}.
                                          \nVă rugăm analizați cererea clientului și aprobați realizarea serviciului accesând următorul link: ${approvalLink}`;
              await sendEmail(
                service.company_email,
                'Ați primit o nouă comandă',
                companyEmailContent
              );
            }
  
            // Setați un timeout de 24 ore pentru a verifica dacă comanda a fost aprobată
            setTimeout(async () => {
              const sqlCheckApproval = `SELECT aprobat FROM orders WHERE id_order = ?`;
              db.query(sqlCheckApproval, [id_order], async (error, results) => {
                if (error) {
                  console.error('Error checking order approval status:', error);
                  return;
                }
  
                if (results.length > 0 && !results[0].aprobat) {
                  const emailContent = `Comanda dumneavoastră (ID: ${id_order}) nu a primit un răspuns din partea companiei în termen de 24 de ore. Vă rugăm să contactați compania pentru mai multe detalii sau vă invităm să plasați o altă comandă pe platforma noastră.`;
                  try {
                    await sendEmail(email, 'Lipsă răspuns comandă', emailContent);
                  } catch (error) {
                    console.error('Error sending no response email:', error);
                  }
                }
              });
            }, 1440 * 60 * 1000); // 24 ore în milisecunde
  
            res.status(200).json({ success: true, id_order: id_order, message: 'Order submitted successfully and emails sent' });
          } catch (error) {
            console.error('Error sending email(s):', error);
            res.status(500).json({ success: false, message: 'Order submitted but failed to send some emails' });
          }
        }
      );
    } catch (error) {
      console.error('Error fetching service types:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch service types' });
    }
  });

// Endpoint pentru a obține comenzile utilizatorului conectat
app.get('/clientOrder', isAuthenticated, (req, res) => {
    const userEmail = req.session.email; // Email-ul utilizatorului autentificat din sesiune
    const sql = `
      SELECT o.id_servicii, o.tip_serviciu, o.created_at, o.aprobat, o.finalizat,o.refuzat,
             s.nume_serviciu, s.pret,
             c.name
      FROM orders o
      JOIN services s ON FIND_IN_SET(s.id_serviciu, o.id_servicii)
      JOIN companies c ON FIND_IN_SET(c.id_companie, s.id_companie)
      WHERE o.email = ?;
    `;
 
    db.query(sql, [userEmail], (err, results) => {
      if (err) {
        console.error('Database error:', err); // Log the error
        return res.status(500).json({ message: 'Database error' });
      }
      console.log('Query results:', results); // Log the query results
      res.json(results);
    });
  });

  app.get('/serviciiCompanie', isAuthenticated, (req, res) => {
    const userEmail = req.session.email; // Email-ul utilizatorului autentificat din sesiune
  
    // Log the user email to ensure it's set correctly
    console.log('User email:', userEmail);
  
    // Ensure userEmail is defined before querying the database
    if (!userEmail) {
      return res.status(400).json({ message: 'User email not found in session' });
    }
  
    const sql = `
      SELECT s.id_serviciu, s.nume_serviciu, s.descriere_serviciu, s.pret
      FROM services s
      JOIN companies c ON c.id_companie = s.id_companie
      WHERE c.email = ?;
    `;
  
    db.query(sql, [userEmail], (err, results) => {
      if (err) {
        console.error('Database error:', err); // Log the error
        return res.status(500).json({ message: 'Database error' });
      }
  
      console.log('Query results:', results); // Log the query results
      res.json(results);
    });
  });

  // app.delete('/serviciiCompanie/:id', isAuthenticated, (req, res) => {
  //   const deleteId = req.params.id; // Extract the ID from the URL parameters
  //   console.log('Service ID to delete:', deleteId); // Log the service ID to delete
  
  //   if (!deleteId) {
  //     return res.status(400).json({ message: 'Service ID is required' });
  //   }
  
  //   const sql = 'DELETE FROM services WHERE id_serviciu = ?';
  
  //   db.query(sql, [deleteId], (err, result) => {
  //     if (err) {
  //       console.error('Database error:', err);
  //       return res.status(500).json({ message: 'Database error' });
  //     }
  //     console.log('Delete result:', result); // Log the result of the query
  //     res.status(200).json({ message: 'Service deleted successfully' });
  //   });
  // });
  app.delete('/serviciiCompanie/:id', isAuthenticated, (req, res) => {
    const deleteId = req.params.id;
    console.log('Service ID to delete:', deleteId); 
  
    if (!deleteId) {
      return res.status(400).json({ message: 'Service ID is required' });
    }
    const sql = 'DELETE FROM services WHERE id_serviciu = ?';
    db.query(sql, [deleteId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      console.log('Delete result:', result); // Log the result of the query
      res.status(200).json({ message: 'Service deleted successfully' });
    });
  });
  
  app.get('/orders', isAuthenticated, (req, res) => {
    const userEmail = req.session.email;
  
    console.log('User email:', userEmail);
  
    if (!userEmail) {
      return res.status(400).json({ message: 'User email not found in session' });
    }
  
    const sql = `
      SELECT o.id_order, o.nume, o.prenume, o.email, s.pret, o.phone, o.created_at, s.nume_serviciu, s.descriere_serviciu, o.finalizat
      FROM orders o
      JOIN services s ON s.id_serviciu = o.id_servicii
      JOIN companies c ON c.id_companie = s.id_companie
      WHERE c.email = ? AND o.aprobat = 1;
    `;
  
    db.query(sql, [userEmail], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      console.log('Query results:', results);
      res.json(results);
    });
  });
  // app.put('/orders/:id', isAuthenticated, (req, res) => {
  //   const orderId = req.params.id;
  //   const { finalizat } = req.body;
  
  //   if (typeof finalizat === 'undefined') {
  //     return res.status(400).json({ message: 'Missing finalizat field' });
  //   }
  
  //   const sqlUpdate = `UPDATE orders SET finalizat = ? WHERE id_order = ?`;
  //   const sqlSelect = `
  //     SELECT o.email, o.id_servicii, s.nume_serviciu
  //     FROM orders o
  //     JOIN services s ON o.id_servicii = s.id_serviciu
  //     WHERE o.id_order = ?
  //   `;
  
  //   db.query(sqlUpdate, [finalizat, orderId], (err, result) => {
  //     if (err) {
  //       console.error('Database error:', err);
  //       return res.status(500).json({ message: 'Database error' });
  //     }
  
  //     if (result.affectedRows === 0) {
  //       return res.status(404).json({ message: 'Order not found' });
  //     }
  
  //     // Retrieve the email and service information associated with the order
  //     db.query(sqlSelect, [orderId], (err, results) => {
  //       if (err) {
  //         console.error('Database error:', err);
  //         return res.status(500).json({ message: 'Database error' });
  //       }
  
  //       if (results.length === 0) {
  //         return res.status(404).json({ message: 'Order email or service not found' });
  //       }
  
  //       const { email, id_servicii, nume_serviciu } = results[0];
  //       const emailSubject = 'Order Finalized';
  //       const reviewFormUrl = `http://localhost:3000/review-companie?serviceId=${id_servicii}`;
  //       const emailText = `Comanda ta cu numărul: ${orderId} pentru serviciul ${nume_serviciu} a fost marcată drept finalizată de către companie. Vă rugăm să vă lăsați părerea cu privire la serviciul primit la următorul link: <a href="${reviewFormUrl}">aici</a>.`;
  
  //       // Send the email
  //       sendEmail(email, emailSubject, emailText);
  
  //       res.json({ message: 'Order status updated and email sent successfully' });
  //     });
  //   });
  // });
  
  app.put('/orders/:id', isAuthenticated, (req, res) => {
    const orderId = req.params.id;
    const { finalizat } = req.body;
  
    if (typeof finalizat === 'undefined') {
      return res.status(400).json({ message: 'Missing finalizat field' });
    }
  
    const sqlUpdate = `UPDATE orders SET finalizat = ? WHERE id_order = ?`;
    const sqlSelect = `
      SELECT o.email, o.id_servicii, s.nume_serviciu
      FROM orders o
      JOIN services s ON o.id_servicii = s.id_serviciu
      WHERE o.id_order = ?
    `;
  
    db.query(sqlUpdate, [finalizat, orderId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Retrieve the email and service information associated with the order
      db.query(sqlSelect, [orderId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'Order email or service not found' });
        }
  
        const { email, id_servicii, nume_serviciu } = results[0];
        const emailSubject = 'Order Finalized';
        const contactPageUrl = `http://localhost:3000/contact?serviceId=${id_servicii}`; 
        const emailText = `Comanda ta cu numărul: ${orderId} pentru serviciul ${nume_serviciu} a fost marcată drept finalizată de către companie.  Vă rugăm să vă lăsați părerea cu privire la serviciul primit la următorul link: "${contactPageUrl}">.`;
        sendEmail(email, emailSubject, emailText);
  
        res.json({ message: 'Order status updated and email sent successfully' });
      });
    });
  });
  
//Aprobare serviciu de către companie
app.get('/approve-service', (req, res) => {
    const { token, confirmation } = req.query;
  
    try {
      const decoded = jwt.verify(token, secretKey);
      const { id_order, id_service } = decoded;
  
      const sqlGetOrder = `SELECT * FROM orders WHERE id_order = ?`;
      db.query(sqlGetOrder, [id_order], (error, results) => {
        if (error) {
          console.error('Error fetching order from database:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch order from database',
          });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ success: false, message: 'Order not found' });
        }
  
        const order = results[0];
        const serviceIds = order.id_servicii;
  
        const sqlGetServices = `SELECT * FROM services WHERE id_serviciu IN (?)`;
        db.query(sqlGetServices, [serviceIds], (error, services) => {
          if (error) {
            console.error('Error fetching services from database:', error);
            return res.status(500).json({
              success: false,
              message: 'Failed to fetch services from database',
            });
          }
  
          if (confirmation === 'true') {
            const sqlUpdateService = `UPDATE orders SET aprobat = true WHERE id_order = ?`;
            db.query(sqlUpdateService, [id_order], async (error) => {
              if (error) {
                console.error('Error updating service status in database:', error);
                return res.status(500).json({
                  success: false,
                  message: 'Failed to update service status in database',
                });
              }
  
              const emailContent = `Serviciul dumneavoastră a fost aprobat. Urmează să fiți contactat de companie.`;
              try {
                await sendEmail(order.email, 'Serviciu aprobat', emailContent);
              } catch (error) {
                console.error('Error sending approval email:', error);
              }
  
              return res.status(200).json({
                success: true,
                message: 'Serviciul a fost aprobat cu succes',
                order,
                services,
              });
            });
          } else {
            res.status(200).json({ success: true, order, services });
          }
        });
      });
    } catch (error) {
      console.error('Invalid or expired token:', error);
      return res.status(400).json({ success: false, message: 'Token invalid sau expirat' });
    }
  });
  app.get('/reject-service', (req, res) => {
    const { token, confirmation } = req.query;
  
    try {
      const decoded = jwt.verify(token, secretKey);
      const { id_order, id_service } = decoded;
  
      const sqlGetOrder = `SELECT * FROM orders WHERE id_order = ?`;
      db.query(sqlGetOrder, [id_order], (error, results) => {
        if (error) {
          console.error('Error fetching order from database:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch order from database',
          });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ success: false, message: 'Order not found' });
        }
  
        const order = results[0];
        const serviceIds = order.id_servicii.split(',');
  
        const sqlGetServices = `SELECT * FROM services WHERE id_serviciu IN (?)`;
        db.query(sqlGetServices, [serviceIds], (error, services) => {
          if (error) {
            console.error('Error fetching services from database:', error);
            return res.status(500).json({
              success: false,
              message: 'Failed to fetch services from database',
            });
          }
  
          if (confirmation === 'true') {
            const sqlUpdateService = `UPDATE orders SET refuzat = true WHERE id_order = ?`;
            db.query(sqlUpdateService, [id_order], async (error) => {
              if (error) {
                console.error('Error updating service status in database:', error);
                return res.status(500).json({
                  success: false,
                  message: 'Failed to update service status in database',
                });
              }
  
              const emailContent = `Serviciul dumneavoastră a fost refuzat de căter companie din diverse motive. Vă invităm să alegeți un alt serviciu de pe platformă.`;
              try {
                await sendEmail(order.email, 'Serviciu refuzat :(', emailContent);
              } catch (error) {
                console.error('Error sending approval email:', error);
              }
  
              return res.status(200).json({
                success: true,
                message: 'Serviciul a fost refuzat',
                order,
                services,
              });
            });
          } else {
            res.status(200).json({ success: true, order, services });
          }
        });
      });
    } catch (error) {
      console.error('Invalid or expired token:', error);
      return res.status(400).json({ success: false, message: 'Token invalid sau expirat' });
    }
  });


// Route to add a new service
// app.post('/services', (req, res) => {
//     const { nume_serviciu, descriere_serviciu, pret, nr_zile_necesare, tip_serviciu } = req.body;
//     const id_companie = req.user.id; // Presupunând că obții ID-ul companiei conectate din obiectul req.user


//     const query = 'INSERT INTO services (nume_serviciu, descriere_serviciu, pret, nr_zile_necesare, tip_serviciu, id_companie) VALUES (?, ?, ?, ?, ?, ?)';
//     db.query(query, [nume_serviciu, descriere_serviciu, pret, nr_zile_necesare, tip_serviciu, id_companie], (err, result) => {
//         if (err) {
//             console.error('Error inserting service:', err);
//             res.status(500).json({ error: 'Database error' });
//             return;
//         }
//         res.status(201).json({ id: result.insertId, nume_serviciu, descriere_serviciu, pret, nr_zile_necesare, tip_serviciu, id_companie });
//     });
// });

// app.post('/services', (req, res) => {
//   const { nume_serviciu, descriere_serviciu, pret, nr_zile, tip_serviciu } = req.body;
//   const id_companie = req.session.userId;

//   if (!id_companie) {
//     return res.status(401).json({ error: 'ID-ul companiei nu este disponibil.' });
//   }
// console.log('aici:',id_companie);
//   const query = 'INSERT INTO services (nume_serviciu, descriere_serviciu, pret, nr_zile_necesare, tip_serviciu, id_companie) VALUES (?, ?, ?, ?, ?, ?)';
//   db.query(
//     query,
//     [nume_serviciu, descriere_serviciu, pret, nr_zile, tip_serviciu, id_companie],
//     (err, result) => {
//       if (err) {
//         console.error('Eroare la inserarea serviciului:', err);
//         return res.status(500).json({ error: 'Eroare la inserarea serviciului în baza de date.' });
//       }
      
//       const serviceId = result.insertId;

//       // Salvează disponibilitatea în baza de date

//       // db.query(availabilityQuery, [availabilityValues], (err, availabilityResult) => {
//       //   if (err) {
//       //     console.error('Eroare la inserarea disponibilității:', err);
//       //     return res.status(500).json({ error: 'Eroare la inserarea disponibilității în baza de date.' });
//       //   }

//       //   res.status(201).json({
//       //     id: serviceId,
//       //     nume_serviciu,
//       //     descriere_serviciu,
//       //     pret,
//       //     nr_zile,
//       //     tip_serviciu,
//       //     id_companie,
     
//       //   });
//       // });
//     }
//   );
// });
app.post('/services', (req, res) => {
  const { nume_serviciu, descriere_serviciu, pret, nr_zile, tip_serviciu, availability } = req.body;
  const id_companie = req.session.userId;

  if (!id_companie) {
    return res.status(401).json({ error: 'ID-ul companiei nu este disponibil.' });
  }

  const queryService = 'INSERT INTO services (nume_serviciu, descriere_serviciu, pret, nr_zile_necesare, tip_serviciu, id_companie) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(
    queryService,
    [nume_serviciu, descriere_serviciu, pret, nr_zile, tip_serviciu, id_companie],
    (err, result) => {
      if (err) {
        console.error('Eroare la inserarea serviciului:', err);
        return res.status(500).json({ error: 'Eroare la inserarea serviciului în baza de date.' });
      }

      const serviceId = result.insertId;
      if (availability && availability.length > 0) {
        const queryAvailability = 'INSERT INTO availability (id_serviciu, start_date, end_date) VALUES ?';
        const availabilityValues = availability.map(interval => {
          return [serviceId, new Date(interval[0]), new Date(interval[1])];
        });

        db.query(
          queryAvailability,
          [availabilityValues],
          (errAvailability, resultAvailability) => {
            if (errAvailability) {
              console.error('Eroare la inserarea disponibilității:', errAvailability);
              return res.status(500).json({ error: 'Eroare la inserarea disponibilității în baza de date.' });
            }

            return res.status(201).json({ message: 'Serviciul și disponibilitățile au fost adăugate cu succes în baza de date.' });
          }
        );
      } else {
        return res.status(201).json({ message: 'Serviciul a fost adăugat cu succes în baza de date.' });
      }
    }
  );
});
app.get('/availability/:serviceId', (req, res) => {
  const serviceId = req.params.serviceId;
  const query = 'SELECT start_date, end_date FROM availability WHERE id_serviciu = ?';

  console.log('Received request for serviceId:', serviceId);

  db.query(query, [serviceId], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Query results:', results);

    if (results.length === 0) {
      console.log('No availability found for serviceId:', serviceId);
      return res.status(404).json({ error: 'No availability found' });
    }

    res.json(results);
  });
});




// Route to get all services
// app.get('/services', (req, res) => {
//   const query = 'SELECT * FROM services';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching services:', err);
//       res.status(500).json({ error: 'Database error' });
//       return;
//     }
//     res.status(200).json(results);
//   });
// });


// Abonare la newsletter
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
      // Check if the email is already subscribed
      const existingEmail = await query('SELECT email FROM subscribers WHERE email = ?', [email]);
      if (existingEmail.length > 0) {
          return res.status(400).send('Email already subscribed');
      }


      // Insert the new email into the database
      await query('INSERT INTO subscribers (email) VALUES (?)', [email]);


   

      // Send confirmation email
      await sendEmail(email, 'Subscription Confirmation');


      res.status(200).send('Subscription successful!');
  } catch (error) {
      console.error('Error handling subscription:', error);
      res.status(500).send('Internal Server Error');
  }
});


// app.get('/review-companie', isAuthenticated, (req, res) => {
//     const userEmail = req.session.email; // Email-ul utilizatorului autentificat din sesiune
//     const sql = `
//       SELECT c.id_review, c.mesaj, c.name,c.id_servicii,
//              s.id_serviciu,
//       FROM recenzii c
//       JOIN services s ON FIND_IN_SET(s.id_serviciu co.id_servicii)
//       WHERE s.id_serviciu = ?;
//     `;
 
//     db.query(sql, [userEmail], (err, results) => {
//       if (err) {
//         console.error('Database error:', err); // Log the error
//         return res.status(500).json({ message: 'Database error' });
//       }
     
//     console.log('Query results:', results); // Log the query results
//     res.json(results);
//     });
// });
app.post('/review-companie', isAuthenticated, (req, res) => {
  const { name, email, mesaj, rating } = req.body;

  // Verificăm dacă datele necesare sunt primite corect
  if (!name || !email || !mesaj || !rating) {
    return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii pentru a trimite recenzia.' });
  }

  // Exemplu de inserare a recenziei în baza de date
  const sql = `INSERT INTO recenzii (name, email, mesaj, rating) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, mesaj, rating], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Eroare la trimiterea recenziei.' });
    }

    res.json({ message: 'Recenzia a fost trimisă cu succes!' });
  });
});


app.get('/review-companie', isAuthenticated, (req, res) => {
  const userEmail = req.session.email; // Email-ul utilizatorului autentificat din sesiune (dacă este necesar)
  const serviceId = req.query.serviceId; // Obținem ID-ul serviciului din query string

  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' });
  }

  // Query pentru a selecta recenziile pentru un anumit serviciu
  const sql = `
    SELECT c.id_review, c.mesaj, c.name, c.rating, c.id_serviciu,
           s.id_serviciu
    FROM recenzii c
    JOIN services s ON s.id_serviciu = c.id_serviciu
    WHERE s.id_serviciu = ?;
  `;

  db.query(sql, [serviceId], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Loghează eroarea de bază de date
      return res.status(500).json({ message: 'Database error' });
    }
    
    console.log('Query results:', results); // Loghează rezultatele interogării
    res.json(results); // Returnează rezultatele sub formă de JSON către client
  });
});

// app.get('/review-companie', isAuthenticated, (req, res) => {
//   const userEmail = req.session.email;
//   const serviceId = req.query.serviceId;

//   if (!serviceId) {
//     return res.status(400).json({ message: 'Service ID is required' });
//   }

//   console.log(`Fetching reviews for service ID: ${serviceId}`); // Log the service ID

//   // Query to select reviews and calculate average rating for a specific service
//   const sql = `
//     SELECT c.id_review, c.mesaj, c.name, c.rating, c.id_serviciu,
//            (SELECT AVG(rating) FROM recenzii WHERE id_serviciu = ?) AS averageRating
//     FROM recenzii c
//     WHERE c.id_serviciu = ?;
//   `;

//   db.query(sql, [serviceId, serviceId], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     console.log('Query results:', results); // Log the query results

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'No reviews found for this service' });
//     }

//     const reviews = results.map(review => ({
//       id_review: review.id_review,
//       mesaj: review.mesaj,
//       name: review.name,
//       rating: review.rating,
//       id_serviciu: review.id_serviciu
//     }));

//     const averageRating = results[0].averageRating;

//     res.json({ reviews, averageRating: averageRating.toFixed(1) });
//   });
// });

app.get('/notifications', (req, res) => {
  // Exemplu de răspuns cu notificări
  const notifications = [
    'Notificare 1',
    'Notificare 2',
    'Notificare 3'
  ];
  res.json({ notifications });
});
// app.get('/ofertePersonalizate', (req, res) => {
//   const sql = `SELECT * FROM oferte`;

//   db.query(sql, (err, results, fields) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     // Filtrarea rezultatelor pentru a ascunde coloanele cu valori goale
//     const rezultateFiltrate = results.map(row => {
//       const filteredRow = {};
//       fields.forEach((field) => {
//         if (row[field.name] !== null) {
//           filteredRow[field.name] = row[field.name];
//         }
//       });
//       return filteredRow;
//     });

//     console.log('Query results:', rezultateFiltrate);
//     res.json(rezultateFiltrate);
//   });
// });
app.get('/ofertePersonalizate', (req, res) => {
  // Presupunând că email-ul utilizatorului este stocat în sesiune
  const userEmail = req.session.email;

  if (!userEmail) {
    console.error('User email not found in session');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  console.log('User email from session:', userEmail);

  const sql = `SELECT * FROM oferte WHERE email = ?`;

  db.query(sql, [userEmail], (err, results, fields) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log('Raw query results:', results);

    // Filtrarea rezultatelor pentru a ascunde coloanele cu valori goale
    const rezultateFiltrate = results.map(row => {
      const filteredRow = {};
      fields.forEach((field) => {
        if (row[field.name] !== null) {
          filteredRow[field.name] = row[field.name];
        }
      });
      return filteredRow;
    });

    console.log('Filtered query results:', rezultateFiltrate);
    res.json(rezultateFiltrate);
  });
});



app.get('/cereriPersonalizate', isAuthenticated, (req, res) => {
  const userEmail = req.session.email;
  const userType = req.session.userType;

  let sql;
  let params = [];

  if (userType === 'company') {
    sql = 'SELECT * FROM oferte';
  } else if (userType === 'user') {
    sql = 'SELECT * FROM oferte WHERE email = ?';
    params = [userEmail];
  } else {
    return res.status(403).json({ message: 'Access forbidden' });
  }

  db.query(sql, params, (err, results, fields) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const rezultateFiltrate = results.map(row => {
      const filteredRow = {};
      fields.forEach((field) => {
        if (row[field.name] !== null) {
          filteredRow[field.name] = row[field.name];
        }
      });
      return filteredRow;
    });

    console.log('Query results:', rezultateFiltrate);
    res.json(rezultateFiltrate);
  });
});

// app.post('/trimiteOferta', (req, res) => {
//   const { ofertaId, text } = req.body;

//   // Salvează oferta trimisă
//   const ofertaTrimisa = {
//     ofertaId,
//     text,
//     dataTrimiterii: new Date(),
//   };


//   // Răspuns succes
//   res.status(201).json({ message: 'Oferta a fost trimisă cu succes!' });

//   // Aici poți adăuga logica pentru a notifica clientul, de exemplu, trimiterea unui email
// });

// app.post('/trimiteOferta', (req, res) => {
//   const { ofertaId, text } = req.body;

//   if (!req.session.email) {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }

//   const sql = `INSERT INTO oferte_trimise (id_oferta, text_oferta, email) VALUES (?, ?, ?)`;
//   db.query(sql, [ofertaId, text, req.session.email], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.json({ message: 'Oferta a fost trimisă cu succes!' });
//   });
// });

app.post('/trimiteOferta', async (req, res) => {
  const { ofertaId, text } = req.body;

  if (!ofertaId || !text) {
    return res.status(400).json({ message: 'ofertaId și text sunt necesare' });
  }

  const emailClientQuery = `SELECT email FROM oferte WHERE id = ?`;
  db.query(emailClientQuery, [ofertaId], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Oferta nu a fost găsită' });
    }

    const clientEmail = results[0].email;

    // Trimite email către client folosind funcția sendEmail
    try {
      await sendEmail(clientEmail, 'Ofertă nouă', `Ați primit o nouă ofertă de la comapania RIVIAN S.R.L., vă rugăm contactați compania pentru finalizarea comenzii la numărul: 0742766200\nOferta făcută: ${text}`);
      console.log('Email sent to client:', clientEmail);

      // Inserează oferta în tabelul oferte_trimise
      const insertOfferQuery = `INSERT INTO oferte_trimise (id_oferta, text_oferta, email) VALUES (?, ?, ?)`;
      db.query(insertOfferQuery, [ofertaId, text, clientEmail], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        
        res.json({ message: 'Oferta a fost trimisă cu succes!' });
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email' });
    }
  });
});
app.get('/oportunitati', (req, res) => {
  const sql = `SELECT * FROM oferte`;

  db.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Filtrarea rezultatelor pentru a ascunde coloanele cu valori goale
    const rezultateFiltrate = results.map(row => {
      const filteredRow = {};
      fields.forEach((field) => {
        if (row[field.name] !== null) {
          filteredRow[field.name] = row[field.name];
        }
      });
      return filteredRow;
    });

    console.log('Query results22:', rezultateFiltrate);
    res.json(rezultateFiltrate);
  });
});
const getAverageRating = (req, res) => {
  const { serviceId } = req.params;

  const query = `
    SELECT AVG(rating) as averageRating
    FROM reviews
    WHERE id_servicii = ?
  `;

  db.query(query, [serviceId], (error, results) => {
    if (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ message: 'Error fetching reviews' });
    }

    if (results.length === 0 || results[0].averageRating === null) {
      return res.status(404).json({ message: 'No reviews found for this service' });
    }

    const averageRating = results[0].averageRating.toFixed(1);
    return res.json({ averageRating });
  });
};


//DACA MODIFI ASTA, MODIFICA PORTUL SI IN Header.js
app.listen(8081, () => {
   
    console.log(`Server is running on port 8081`);
});

// import express from 'express';
// import mysql from 'mysql'
// import cors from 'cors'




// const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: '',
//     database: "signup"
// });

// app.post('/signup', (req, res) => {
//     const sql = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
//     const values = [
//         req.body.username,
//         req.body.email,
//         req.body.password
//     ];
//     db.query(sql, [values], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ Message: "Error in Node" });
//         }
//         return res.json(result);
//     });
// });

// app.post('/login', (req, res) => {
//     const sql = "SELECT * FROM users WHERE email=? AND password=?";
//     db.query(sql, [req.body.email, req.body.password], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ message: "Error inside server" });
//         }
//         if (result.length > 0) {
//             return res.json({ Login: true });
//         } else {
//             return res.json({ Login: false });
//         }
//     });
// });

// app.listen(8081, () => {
//     console.log("Connected to the server");
// });

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

// Configuración necesaria para que React y Node se hablen
app.use(cors());
app.use(express.json());

// Conexión a tu base de datos fintech_db
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fintech_db"
});

db.connect(err => {
    if (err) {
        console.error('❌ Error de conexión:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

// Debe ser POST
app.post('/registro', (req, res) => { /* Lógica de inserción aquí */ });
  const { nombres, apellidos, correo, password } = req.body;
  const query = 'INSERT INTO usuarios (nombres, apellidos, correo, password, rol) VALUES (?, ?, ?, ?, "user")';
  db.query(query, [nombres, apellidos, correo, password], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send("Usuario registrado");
  });

// ACTIVAR EL PUERTO 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});
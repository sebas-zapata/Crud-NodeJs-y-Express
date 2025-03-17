require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Importar la conexión a la BD

const app = express();
app.use(express.json()); // Permitir JSON en las solicitudes
app.use(cors()); // Habilitar CORS
app.use(express.static('public')); // Servir archivos estáticos desde /public
const PORT = process.env.PORT || 3000;

// **1. Obtener todos los usuarios**
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// **2. Obtener un usuario por ID**
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(results[0]);
    });
});

// **3. Crear un nuevo usuario**
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    db.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, name, email, age });
    });
});

// **4. Actualizar un usuario**
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario actualizado correctamente' });
    });
});

// **5. Eliminar un usuario**
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario eliminado correctamente' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

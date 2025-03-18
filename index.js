require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('./config/db'); // Asegurar conexión a la BD

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Usar rutas separadas
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

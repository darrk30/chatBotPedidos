const express = require('express');
const { startWhatsApp } = require('./lib/whatsapp');
const app = express();

const puerto = 3800;

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use('/api', require('./routes/links'));

// Inicializar WhatsApp
startWhatsApp();

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});

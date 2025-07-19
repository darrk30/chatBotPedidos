const express = require("express");
const { loadBotsFromDisk } = require("./core/botManager");
const app = express();
const puerto = 3800;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use('/api', require('./routes/bots'));

// 🧠 Recargar bots guardados
loadBotsFromDisk();

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});

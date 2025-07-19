const express = require("express");
const { createBot, getBot } = require("../core/botManager");

const router = express.Router();

// Crear un nuevo cliente
router.post("/clientes", (req, res) => {
  const { codigo, nombre } = req.body;

  if (!codigo || !nombre) {
    return res.status(400).json({ error: "Falta código o nombre" });
  }

  const bot = createBot({ codigo });

  return res.json({ mensaje: `Bot para ${nombre} creado con éxito.` });
});

// Obtener el QR de un cliente
router.get("/qr/:codigo", (req, res) => {
  const { codigo } = req.params;

  const bot = getBot(codigo);

  if (!bot) {
    return res
      .status(404)
      .send("<h2>❌ Cliente no encontrado.</h2>");
  }

  const qr = bot.getQR();

  if (!qr) {
    return res
      .status(202)
      .send("<h2>⏳ Bot ya autenticado o QR aún no generado.</h2>");
  }

  // HTML que incrusta el QR como imagen
  const html = `
    <html>
      <head>
        <title>QR para ${codigo}</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; }
          img { width: 300px; height: 300px; }
        </style>
      </head>
      <body>
        <h2>Escanea este QR para ${codigo}</h2>
        <img src="${qr}" alt="QR para ${codigo}" />
      </body>
    </html>
  `;

  return res.send(html);
});


module.exports = router;

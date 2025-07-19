const { Router } = require('express');
const { whatsapp } = require('../lib/whatsapp');
const { getQR } = require('../lib/whatsapp');
const router = Router();

router.post('/enviarMensaje', async (req, res) => {
  try {
    const {
      numero,
      restaurante,
      mozo,
      plato,
      mesa,
      motivo
    } = req.body;

    if (!numero || !restaurante || !mozo || !plato || !mesa || !motivo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const chatId = numero.replace('+', '') + '@c.us';
    const numberDetails = await whatsapp.getNumberId(chatId);

    if (!numberDetails) {
      return res.status(404).json({ success: false, message: 'Número no válido o no está en WhatsApp' });
    }

    // Formatear fecha y hora actual
    const now = new Date();
    const fechaHora = now.toLocaleString('es-PE', {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: false,
    });

    // Construcción del mensaje
    const mensaje = `📌 *En el restaurante ${restaurante}*,\n` +
                    `El mozo *${mozo}* ha eliminado el plato *${plato}* de la mesa *${mesa}*\n` +
                    `🕓 ${fechaHora}\n` +
                    `📝 Motivo: *${motivo}*`;

    await whatsapp.sendMessage(chatId, mensaje);
    return res.json({ success: true, message: 'Mensaje enviado correctamente' });

  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    res.status(500).json({ success: false, error: 'Error interno al enviar mensaje' });
  }
});


router.get('/qr', (req, res) => {
  const qr = getQR();

  if (!qr) {
    return res.send(`
      <html>
        <head>
          <title>QR no disponible</title>
        </head>
        <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h2>⚠️ QR no disponible</h2>
          <p>Ya ha sido escaneado o aún no está generado.</p>
        </body>
      </html>
    `);
  }

  res.send(`
    <html>
      <head>
        <title>Escanea el QR</title>
      </head>
      <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
        <h2>Escanea este QR con WhatsApp</h2>
        <img src="${qr}" alt="Código QR" style="margin-top: 20px; width: 300px; height: 300px;" />
        <p style="margin-top: 10px; color: #666;">Actualiza si el QR cambia o expira.</p>
      </body>
    </html>
  `);
});
module.exports = router;

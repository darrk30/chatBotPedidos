const qrcode = require("qrcode");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");
const path = require("path");
const { getAddressFromCoordinates } = require("./geolocation");

// 🧾 Menú con precios
const menu = {
  "arroz con pollo": 12,
  ceviche: 18,
  "lomo saltado": 15,
  ensalada: 10,
  jugo: 5,
};

// 🧠 Estado temporal por usuario
const usuarios = {};
let qrBase64 = null;

const whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

function startWhatsApp() {
  whatsapp.on("qr", async (qr) => {
    console.log("🔐 Nuevo código QR generado");
    try {
      qrBase64 = await qrcode.toDataURL(qr);
    } catch (error) {
      console.error("❌ Error al generar QR:", error);
    }
  });

  whatsapp.on("ready", () => {
    console.log("✅ Cliente de WhatsApp listo");
    qrBase64 = null;
  });

  whatsapp.on("auth_failure", () => {
    console.error("❌ Fallo de autenticación");
  });

  whatsapp.on("disconnected", (reason) => {
    console.log("⚠️ Cliente desconectado:", reason);
  });

  whatsapp.on("message", async (msg) => {
    const texto = msg.body.toLowerCase();
    const numero = msg.from;

    // 🗺️ Paso especial: Recibir ubicación
    if (msg.type === "location") {
      const { latitude, longitude } = msg.location;
      const link = `https://www.google.com/maps?q=${latitude},${longitude}&z=18`;

      let direccion = await getAddressFromCoordinates(latitude, longitude);

      const pedido = usuarios[numero];
      if (pedido) {
        console.log("📦 Pedido finalizado:");
        console.log(`📱 Cliente: ${numero}`);
        console.log("🍽️ Platos:");
        pedido.platos.forEach((plato) => {
          console.log(`   - ${plato}: S/. ${menu[plato]}`);
        });
        console.log(`💵 Total: S/. ${pedido.total}`);
        console.log("📍 Dirección:", direccion);
        console.log("🌍 Link:", link);
        console.log("🕒 Fecha:", new Date().toLocaleString());
      }

      await whatsapp.sendMessage(
        numero,
        `✅ Pedido confirmado.\n\n🚴 El delivery llegará en 5 minutos a esta ubicación:\n📍 *Dirección:* ${direccion}\n🌍 Ver en el mapa: ${link}`
      );

      delete usuarios[numero];
      return;
    }

    // 👋 Paso 1: Enviar carta si dice "hola"
    if (texto.includes("hola")) {
      const media = MessageMedia.fromFilePath(
        path.join(__dirname, "../img/carta.png")
      );
      await whatsapp.sendMessage(numero, media, {
        caption:
          "🍽️ Hola, esta es nuestra carta del día.\n\nEscribe los platos separados por coma para hacer tu pedido.\nEjemplo:\n*arroz con pollo, jugo*",
      });
      return;
    }

    // ✅ Paso 2: Confirmación del pedido
    if (["confirmar_si", "sí", "si"].includes(texto)) {
      const pedido = usuarios[numero];
      if (pedido) {
        console.log("📦 Nuevo pedido confirmado:");
        console.log(`📱 Cliente: ${numero}`);
        console.log("🍽️ Platos:");
        pedido.platos.forEach((plato) => {
          console.log(`   - ${plato}: S/. ${menu[plato]}`);
        });
        console.log(`💵 Total: S/. ${pedido.total}`);
        console.log("🕒 Fecha:", new Date().toLocaleString());

        await whatsapp.sendMessage(
          numero,
          `✅ ¡Pedido confirmado!\n\nTu total es: *S/. ${pedido.total}*.\nAhora por favor envíame tu ubicación 📍`
        );
      } else {
        await whatsapp.sendMessage(
          numero,
          "❌ No tengo ningún pedido registrado. Escribe *hola* para ver la carta."
        );
      }
      return;
    }

    // ❌ Paso 3: Cancelación del pedido
    if (["confirmar_no", "no"].includes(texto)) {
      delete usuarios[numero];
      await whatsapp.sendMessage(
        numero,
        "👍 Ok, pedido cancelado. Si deseas cambiarlo, escribe nuevamente los platos."
      );
      return;
    }

    // 🍽️ Paso 4: Interpretar platos si no está confirmado
    const platosSeleccionados = texto.split(",").map((p) => p.trim());
    const platosValidos = platosSeleccionados.filter((p) => menu[p]);

    if (platosValidos.length > 0) {
      const total = platosValidos.reduce((sum, p) => sum + menu[p], 0);
      usuarios[numero] = { platos: platosValidos, total };

      const resumen = platosValidos
        .map((p) => `• ${p} - S/. ${menu[p]}`)
        .join("\n");

      await whatsapp.sendMessage(
        numero,
        `🧾 Tu pedido es:\n${resumen}\n\n¿Confirmas tu pedido?\n\nResponde con *sí* ✅  o *no* ❌`
      );
      return;
    }

    // 🧠 Paso final: Mensaje no reconocido
    await whatsapp.sendMessage(
      numero,
      "❗ No entendí tu mensaje. Escribe los platos separados por coma (ejemplo: *lomo saltado, jugo*), o escribe *hola* para ver la carta."
    );
  });

  whatsapp.initialize();
}

function getQR() {
  return qrBase64;
}

module.exports = { whatsapp, startWhatsApp, getQR };

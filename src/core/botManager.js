const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");

const bots = {}; // Map: código → { client, getQR }
const clientesPath = path.join(__dirname, "../data/clientes.json"); // archivo de respaldo

// 🧠 Cargar clientes desde archivo al iniciar
function loadBotsFromDisk() {
  if (!fs.existsSync(clientesPath)) return;

  const data = JSON.parse(fs.readFileSync(clientesPath, "utf-8"));

  data.forEach(({ codigo }) => {
    createBot({ codigo });
  });

  console.log("✅ Bots cargados desde disco:", Object.keys(bots));
}

// 💾 Guardar cliente en archivo JSON
function saveClient(codigo) {
  let clientes = [];
  if (fs.existsSync(clientesPath)) {
    clientes = JSON.parse(fs.readFileSync(clientesPath, "utf-8"));
  }

  if (!clientes.some((c) => c.codigo === codigo)) {
    clientes.push({ codigo });
    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));
  }
}

// 🛠 Crear un nuevo bot
function createBot({ codigo }) {
  if (bots[codigo]) return bots[codigo]; // ya existe

  const sessionDir = path.join(__dirname, `../sessions/${codigo}`);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  let qrBase64 = null;

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: sessionDir, // cada cliente con su propia sesión
    }),
  });

  client.on("qr", async (qr) => {
    try {
      qrBase64 = await qrcode.toDataURL(qr);
      console.log(`🟢 [${codigo}] QR generado`);
    } catch (err) {
      console.error(`❌ [${codigo}] Error generando QR:`, err);
    }
  });

  client.on("ready", () => {
    console.log(`✅ [${codigo}] Bot conectado`);
    qrBase64 = null;
  });

  client.on("auth_failure", () => {
    console.error(`❌ [${codigo}] Fallo de autenticación`);
  });

  client.on("disconnected", (reason) => {
    console.warn(`⚠️ [${codigo}] Bot desconectado: ${reason}`);
  });

  client.initialize();

  bots[codigo] = {
    client,
    getQR: () => qrBase64,
  };

  // guardar cliente en disco
  saveClient(codigo);

  return bots[codigo];
}

// 🔎 Obtener bot por código
function getBot(codigo) {
  return bots[codigo] || null;
}

module.exports = { createBot, getBot, loadBotsFromDisk };

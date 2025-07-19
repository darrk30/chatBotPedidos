
# 🤖 Bot de WhatsApp con Express y Electron

Este proyecto permite enviar mensajes automatizados por WhatsApp con un servidor Express que maneja la conexión con WhatsApp Web usando `whatsapp-web.js`.

---

## 📦 Requisitos Previos

Asegúrate de tener instalado lo siguiente:

- Node.js (versión LTS recomendada)

## 🚀 Pasos para ejecutar el bot

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/tu-usuario/PRUEBA-BOT-GRAFICO.git
cd PRUEBA-BOT-GRAFICO
```

O simplemente descarga el ZIP y extrae el contenido.

---

### 2. Instalar dependencias necesarias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm init -y
npm i express
npm i whatsapp-web.js 
npm i axios
npm i qrcode
npm i path
```

---

### 3. Ejecutar el bot

```bash
npm run dev
```

Esto abrirá una ventana de escritorio con una interfaz para configurar el número y puerto, y también iniciará el servidor Express.

---

### 4. Uso del bot

- mediante postman ejecuta http://localhost:3800/api/qr metodo GET
- Escanea el código QR con WhatsApp en tu teléfono.
- En la interfaz del bot:
  - Escribe el número de teléfono al que enviar mensajes.
  - Haz clic en **Iniciar**.
  - envia mensajes por http://localhost:3800/api/enviarMensaje metodo POST
  - Luego escribe el mensaje y presiona **Enviar**.
  - {numero: '51XXXXXXXXX', mensaje: "hola"}

---

### 5. API HTTP (opcional)

Puedes enviar mensajes desde otro sistema con una petición POST a:

---

## 🧠 Posibles mejoras

- Integración con inteligencia artificial para respuestas automáticas.
- Agregar almacenamiento de historial con SQLite o MongoDB.
- Crear un panel administrativo web para control de envíos.

---

## 📝 Autor

Kevin Rivera — Uso libre para proyectos educativos o personales.

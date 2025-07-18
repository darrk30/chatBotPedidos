
# 🤖 Bot de WhatsApp con Express y Electron

Este proyecto permite enviar mensajes automatizados por WhatsApp mediante una interfaz de escritorio construida con Electron y un servidor Express que maneja la conexión con WhatsApp Web usando `whatsapp-web.js`.

---

## 📦 Requisitos Previos

Asegúrate de tener instalado lo siguiente:

- Node.js (versión LTS recomendada)
- Google Chrome (usado por Puppeteer)
- Git (opcional, para clonar el proyecto)

---

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
npm install
```

---

### 3. Dependencias utilizadas

Estas dependencias se instalan automáticamente al hacer `npm install`, pero puedes instalarlas manualmente si deseas:

```bash
npm install express
npm install whatsapp-web.js
npm install qrcode-terminal
npm install axios
npm install cors
npm install nodemon --save-dev
npm install electron --save-dev
```

---

### 4. Ejecutar el bot

```bash
npm start
```

Esto abrirá una ventana de escritorio con una interfaz para configurar el número y puerto, y también iniciará el servidor Express.

---

### 5. Uso del bot

- Escanea el código QR con WhatsApp en tu teléfono.
- En la interfaz del bot:
  - Escribe el número de teléfono al que enviar mensajes.
  - Haz clic en **Iniciar**.
  - Luego escribe el mensaje y presiona **Enviar**.

---

### 6. API HTTP (opcional)

Puedes enviar mensajes desde otro sistema con una petición POST a:

```
http://localhost:3000/send
```

#### Ejemplo usando `curl`:

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number": "51987654321", "message": "Hola desde API"}'
```

---

## 🧠 Posibles mejoras

- Integración con inteligencia artificial para respuestas automáticas.
- Agregar almacenamiento de historial con SQLite o MongoDB.
- Crear un panel administrativo web para control de envíos.

---

## 📝 Autor

Kevin Rivera — Uso libre para proyectos educativos o personales.

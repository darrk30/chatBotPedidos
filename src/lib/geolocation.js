const axios = require("axios");

async function getAddressFromCoordinates(lat, lon) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    return response.data.display_name || "Dirección no disponible";
  } catch (error) {
    console.error("Error obteniendo dirección:", error.message);
    return "Dirección no disponible";
  }
}

module.exports = { getAddressFromCoordinates };

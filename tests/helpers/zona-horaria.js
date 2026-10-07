// Todas las pruebas se ejecutan con la zona horaria de la empresa (Guatemala, UTC-6),
// sin importar la configuración de la computadora o del servidor de integración continua.
module.exports = async () => { process.env.TZ = 'America/Guatemala'; };

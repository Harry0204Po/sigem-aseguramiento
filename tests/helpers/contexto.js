/**
 * Utilidades compartidas por las pruebas unitarias y de integración.
 * Cada prueba trabaja sobre una base de datos nueva para que los casos
 * sean independientes entre sí (no comparten estado).
 */
const L = require('../../src/js/logica.js');
const D = require('../../src/js/datos-demo.js');

/** Fecha fija de las pruebas: coincide con la fecha de referencia de los datos demo (sin desplazamiento). */
const HOY = D.FECHA_REFERENCIA; // '2026-09-19'

function nuevaDB() { return D.crearDatosDemo(HOY); }
function usuario(db, email) { return db.usuarios.find(u => u.email === email); }
function admin(db) { return usuario(db, 'admin@sigem.com'); }
function tecnicoUsr(db) { return usuario(db, 'tecnico@sigem.com'); }

/** Datos válidos de ejemplo, reutilizados en varias pruebas. */
const clienteValido = () => ({ nombre: 'Hotel Pacífico, S.A.', empresa: 'Hotel Pacífico', nit: '1234567-8', telefono: '2345-6789', correo: 'mantenimiento@hotelpacifico.gt', direccion: 'Zona 10, Guatemala', estado: 'Activo' });
const equipoValido = (clienteId) => ({ clienteId, tipo: 'Bomba centrífuga', marca: 'Grundfos', modelo: 'CR10', potenciaHP: 10, voltaje: '220V', serie: 'GF-TEST-001', ubicacion: 'Cuarto de bombas', estado: 'Activo', ultMant: HOY });
const cotizacionValida = (clienteId, equipoId) => ({
  clienteId, equipoId, tipoServicio: 'Mantenimiento correctivo', tecnicoId: 'TEC-04', fecha: HOY, vigenciaDias: 15, descuentoPct: 0, impuestoPct: 12,
  items: [
    { desc: 'Mano de obra técnica', tipo: 'Mano de obra', cant: 1, pu: 1000 },
    { desc: 'Rodamiento 6205-2RS', tipo: 'Repuestos', cant: 1, pu: 1500 },
    { desc: 'Transporte a sitio', tipo: 'Transporte', cant: 1, pu: 300 },
  ],
});

module.exports = { L, D, HOY, nuevaDB, usuario, admin, tecnicoUsr, clienteValido, equipoValido, cotizacionValida };

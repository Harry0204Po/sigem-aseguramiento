/**
 * Pruebas unitarias — Seguridad (ISO/IEC 25010: confidencialidad, autenticidad, integridad, responsabilidad)
 */
const { L, nuevaDB, admin } = require('../helpers/contexto');

describe('Autenticación', () => {
  test.each([
    ['admin@sigem.com', 'Administrador'],
    ['administrativo@sigem.com', 'Administrativo'],
    ['tecnico@sigem.com', 'Técnico'],
  ])('CP-SEG-01 Inicia sesión con credenciales válidas de demo (%s)', (email, rol) => {
    const r = L.autenticar(nuevaDB(), email, '123456');
    expect(r.ok).toBe(true);
    expect(r.usuario.rol).toBe(rol);
  });

  test('CP-SEG-02 El correo no distingue mayúsculas ni espacios', () => {
    expect(L.autenticar(nuevaDB(), '  ADMIN@SIGEM.COM ', '123456').ok).toBe(true);
  });

  test('CP-SEG-03 Rechaza contraseña incorrecta con mensaje genérico', () => {
    const r = L.autenticar(nuevaDB(), 'admin@sigem.com', '654321');
    expect(r.ok).toBe(false);
    expect(r.error).toBe('Correo o contraseña incorrectos.');
  });

  test('CP-SEG-04 Un correo inexistente recibe el mismo mensaje (no revela usuarios)', () => {
    const r = L.autenticar(nuevaDB(), 'noexiste@sigem.com', '123456');
    expect(r.error).toBe('Correo o contraseña incorrectos.');
  });

  test('CP-SEG-05 Bloquea el acceso de usuarios inactivos', () => {
    const r = L.autenticar(nuevaDB(), 'fruiz@sigem.com', '123456');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/inactivo/);
  });

  test('CP-SEG-06 Rechaza campos vacíos', () => {
    expect(L.autenticar(nuevaDB(), '', '').ok).toBe(false);
  });

  test('CP-SEG-07 La contraseña distingue mayúsculas y minúsculas', () => {
    const db = nuevaDB();
    L.guardarUsuario(db, 'USR-02', { nombre: 'María López', email: 'administrativo@sigem.com', rol: 'Administrativo', estado: 'Activo', pass: 'Clave2026' }, admin(db));
    expect(L.autenticar(db, 'administrativo@sigem.com', 'clave2026').ok).toBe(false);
    expect(L.autenticar(db, 'administrativo@sigem.com', 'Clave2026').ok).toBe(true);
  });
});

describe('Control de acceso basado en roles (RBAC)', () => {
  test.each(['rentabilidad', 'gastos', 'usuarios', 'reportes', 'inventario', 'facturacion', 'pagos', 'clientes', 'cotizaciones', 'ordenes'])(
    'CP-SEG-08 El Técnico NO puede acceder a "%s"', (vista) => {
      expect(L.puedeAcceder('Técnico', vista)).toBe(false);
    });

  test('CP-SEG-09 El Técnico solo ve Dashboard, Mi panel técnico y Guía', () => {
    expect(L.vistasPermitidas('Técnico').sort()).toEqual(['dashboard', 'guia', 'panel-tecnico']);
  });

  test('CP-SEG-10 El Administrativo accede a clientes, cotizaciones, facturación y pagos, pero no a rentabilidad ni usuarios', () => {
    ['clientes', 'cotizaciones', 'facturacion', 'pagos'].forEach(v => expect(L.puedeAcceder('Administrativo', v)).toBe(true));
    ['rentabilidad', 'usuarios', 'gastos', 'reportes'].forEach(v => expect(L.puedeAcceder('Administrativo', v)).toBe(false));
  });

  test('CP-SEG-11 El Administrador accede a todos los módulos administrativos', () => {
    Object.keys(L.PERMISOS).filter(v => v !== 'panel-tecnico').forEach(v => expect(L.puedeAcceder('Administrador', v)).toBe(true));
  });

  test('CP-SEG-12 Un rol o vista inexistente no tiene acceso', () => {
    expect(L.puedeAcceder('Invitado', 'dashboard')).toBe(false);
    expect(L.puedeAcceder('Administrador', 'configuracion-secreta')).toBe(false);
  });

  test('CP-SEG-13 Cada rol inicia en su vista correspondiente', () => {
    expect(L.vistaInicio('Técnico')).toBe('panel-tecnico');
    expect(L.vistaInicio('Administrador')).toBe('dashboard');
  });
});

describe('Integridad y trazabilidad', () => {
  test('CP-SEG-14 Escapa HTML para prevenir inyección de scripts (XSS)', () => {
    expect(L.esc('<img src=x onerror="alert(1)">')).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
    expect(L.esc("O'Brien & Hijos")).toBe('O&#39;Brien &amp; Hijos');
  });

  test('CP-SEG-15 Las operaciones registran usuario, acción y fecha en la bitácora', () => {
    const db = nuevaDB();
    L.cambiarEstadoCotizacion(db, 'COT-2026-003', 'Aprobada', admin(db));
    expect(db.bitacora[0]).toMatchObject({ usuario: 'Ana Gutiérrez', accion: 'Cambió estado de cotización' });
    expect(db.bitacora[0].fecha).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });

  test('CP-SEG-16 Exige contraseña de al menos 6 caracteres al crear usuarios', () => {
    const db = nuevaDB();
    const r = L.guardarUsuario(db, null, { nombre: 'Nuevo', email: 'nuevo@sigem.com', rol: 'Técnico', estado: 'Activo', pass: '123' }, admin(db));
    expect(r.ok).toBe(false);
  });

  test('CP-SEG-17 No permite correos de usuario duplicados', () => {
    const db = nuevaDB();
    const r = L.guardarUsuario(db, null, { nombre: 'Copia', email: 'ADMIN@sigem.com', rol: 'Técnico', estado: 'Activo', pass: '123456' }, admin(db));
    expect(r.ok).toBe(false);
  });

  test('CP-SEG-18 El administrador no puede desactivarse ni quitarse el rol a sí mismo', () => {
    const db = nuevaDB();
    const yo = admin(db);
    const r = L.guardarUsuario(db, yo.id, { nombre: yo.nombre, email: yo.email, rol: 'Técnico', estado: 'Activo', pass: '123456' }, yo);
    expect(r.ok).toBe(false);
    expect(yo.rol).toBe('Administrador');
  });

  test('CP-SEG-19 Rechaza roles que no existen al crear usuarios', () => {
    const db = nuevaDB();
    expect(L.guardarUsuario(db, null, { nombre: 'X', email: 'x@sigem.com', rol: 'SuperUsuario', estado: 'Activo', pass: '123456' }, admin(db)).ok).toBe(false);
  });
});

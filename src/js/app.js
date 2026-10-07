/* =========================================================================
   SIGEM — Sistema Integral de Gestión Electromecánica
   Capa de presentación (interfaz de usuario).
   Depende de: logica.js (reglas de negocio) y datos-demo.js (datos simulados).
   ========================================================================= */
'use strict';
const L = window.SIGEM_LOGICA;
const { ymd, todayStr, addDays, enUltimos30, ultimosMeses, esc, byId } = L;

/* ---------------------------- ICONOS (SVG) ---------------------------- */
const ICONS = {
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  clientes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="8" r="2.6"/><path d="M16 14.2c2.7.5 4.5 2.6 4.5 5.8"/></svg>',
  equipos:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.1-3.1a5 5 0 01-6.4 6.4L5.6 21.4a2 2 0 01-2.8-2.8L11.6 9.8a5 5 0 016.4-6.4l-3.1 3.1z"/></svg>',
  cotizaciones:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8l4 4v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M16 3v4h4"/><path d="M8 12h8M8 16h5M8 8h3"/></svg>',
  ordenes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 3v3h6V3"/><path d="M8 12l2.5 2.5L16 9"/></svg>',
  panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7"/><path d="M9.5 14.5l2 2 3.5-4"/></svg>',
  inventario:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
  facturacion:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M9 12h6M9 16h6M9 8h2"/><circle cx="17" cy="17" r="0"/></svg>',
  pagos:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>',
  gastos:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h9"/><circle cx="18" cy="17" r="3.2"/><path d="M18 15.3V17l1.1.9"/><circle cx="7" cy="12" r="1.6"/></svg>',
  rentabilidad:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/><path d="M16 6h3v3"/></svg>',
  reportes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M8 16v-4M12 16V8m4 8v-6"/></svg>',
  usuarios:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 3v6c0 5-3.4 8.4-8 11-4.6-2.6-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4.5"/></svg>',
  guia:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2.5 1.8-2.5 3.5"/><path d="M12 17h.01"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>',
  print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1.5"/><path d="M6 17h12v5H6z"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  wrench:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.1-3.1a5 5 0 01-6.4 6.4L5.6 21.4a2 2 0 01-2.8-2.8L11.6 9.8a5 5 0 016.4-6.4l-3.1 3.1z"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L1 21h22L12 2z"/><path d="M12 9v5M12 17h.01"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  sign:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17s3-1 5-4 2-7 5-7 1 5 4 7 4 1 4 1"/><path d="M3 21h18"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>',
  money:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5c0-1 1-1.8 2.5-1.8s2.5.8 2.5 1.8-1 1.5-2.5 1.8-2.5.8-2.5 1.9 1 1.8 2.5 1.8 2.5-.8 2.5-1.8"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 3v6c0 5-3.4 8.4-8 11-4.6-2.6-8-6-8-11V5l8-3z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18"/><path d="M9 8h.01M9 12h.01M9 16h.01M15 8h.01M15 12h.01M15 16h.01"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  empty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M3 12h18"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
};
function ic(name,size){ return ICONS[name] || ''; }

/* ---------------------------- UTILIDADES ---------------------------- */
function fmtQ(n){ n = Number(n)||0; return 'Q ' + n.toLocaleString('es-GT',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtDate(d){ if(!d) return '—'; const dt = new Date(d+'T00:00:00'); if(isNaN(dt)) return d; return dt.toLocaleDateString('es-GT',{day:'2-digit',month:'short',year:'numeric'}); }
function fmtDateTime(d){ const dt = new Date(d); return dt.toLocaleString('es-GT',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
function uid(prefix){ return prefix + '-' + Math.random().toString(36).slice(2,7).toUpperCase(); }
function val(id){ const el = document.getElementById(id); return el ? el.value : ''; }
function errorToast(r){ toast((r.errores && r.errores.length ? r.errores : [r.error]).join(' '), 'error', 'alert'); }
function initials(name){ return (name||'?').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }

function toast(msg,type,iconName){
  type = type || 'info';
  const root = document.getElementById('toast-root');
  const div = document.createElement('div');
  div.className = 'toast ' + type;
  div.innerHTML = (iconName?ic(iconName):(type==='success'?ic('check'):type==='error'?ic('alert'):ic('info'))) + '<span>'+esc(msg)+'</span>';
  root.appendChild(div);
  setTimeout(()=>{ div.style.transition='opacity .3s'; div.style.opacity='0'; setTimeout(()=>div.remove(),300); }, 3400);
}

function openModal(html, opts){
  opts = opts || {};
  const root = document.getElementById('modal-root');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'active-modal';
  overlay.innerHTML = '<div class="modal-box '+(opts.size||'')+'">'+html+'</div>';
  overlay.addEventListener('mousedown', (e)=>{ if(e.target===overlay && !opts.persistent) closeModal(); });
  root.innerHTML = '';
  root.appendChild(overlay);
  requestAnimationFrame(()=>overlay.classList.add('open'));
  return overlay;
}
function closeModal(){
  const m = document.getElementById('active-modal');
  if(!m) return;
  m.classList.remove('open');
  setTimeout(()=>{ m.remove(); }, 150);
}
function modalShell(title, iconName, bodyHtml, footHtml){
  return '<div class="modal-head"><h3>'+ic(iconName)+esc(title)+'</h3><button class="modal-close" onclick="closeModal()">'+ic('x')+'</button></div>'+
         '<div class="modal-body">'+bodyHtml+'</div>'+
         (footHtml? '<div class="modal-foot">'+footHtml+'</div>' : '');
}

function badge(text, kind){
  return '<span class="badge badge-'+kind+'">'+esc(text)+'</span>';
}
const ESTADO_KIND = {
  // cotizaciones
  'Borrador':'gris','Enviada':'azul','Aprobada':'verde','Rechazada':'rojo','Vencida':'amarillo',
  // ordenes
  'Pendiente':'gris','Programada':'azul','En proceso':'amarillo','En espera':'morado','Finalizada':'verde','Cancelada':'rojo',
  // facturas
  'Pagada':'verde','Parcial':'amarillo','Anulada':'rojo',
  // equipos / clientes / inventario / técnico
  'Activo':'verde','Inactivo':'gris','Disponible':'verde','Ocupado':'amarillo','En mantenimiento':'amarillo','Fuera de servicio':'rojo',
  'Stock bajo':'rojo','Stock normal':'verde',
  'Alta':'rojo','Media':'amarillo','Baja':'gris',
};
function estadoBadge(txt){ return badge(txt, ESTADO_KIND[txt] || 'gris'); }

function downloadCSV(filename, rows){
  const csv = rows.map(r=>r.map(c=>{
    c = c==null? '' : String(c);
    if(/[",\n;]/.test(c)) c = '"'+c.replace(/"/g,'""')+'"';
    return c;
  }).join(',')).join('\n');
  const blob = new Blob(["﻿"+csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  // Se libera la URL después de iniciar la descarga; revocarla de inmediato hace que el archivo pierda su nombre.
  setTimeout(()=>{ a.remove(); URL.revokeObjectURL(url); }, 1500);
  toast('Reporte exportado: '+filename,'success','download');
}

/* ---------------------------- BASE DE DATOS SIMULADA ---------------------------- */
// Datos en memoria: se reinician al recargar la página (ver datos-demo.js).
const DB = window.SIGEM_DATOS.crearDatosDemo();

/* ---------------------------- ESTADO Y RBAC ---------------------------- */
const STATE = { user:null, view:'dashboard', params:{}, sidebarOpen:false };

// Los roles de cada vista se toman de L.PERMISOS (única fuente de verdad del RBAC).
const NAV_ITEMS = [
  {group:'Principal', items:[
    {id:'dashboard', label:'Dashboard', icon:'dashboard'},
  ]},
  {group:'Operación comercial', items:[
    {id:'clientes', label:'Clientes', icon:'clientes'},
    {id:'equipos', label:'Equipos', icon:'equipos'},
    {id:'cotizaciones', label:'Cotizaciones', icon:'cotizaciones'},
    {id:'ordenes', label:'Órdenes de trabajo', icon:'ordenes'},
  ]},
  {group:'Campo', items:[
    {id:'panel-tecnico', label:'Mi panel técnico', icon:'panel'},
    {id:'inventario', label:'Inventario', icon:'inventario'},
  ]},
  {group:'Finanzas', items:[
    {id:'facturacion', label:'Facturación', icon:'facturacion'},
    {id:'pagos', label:'Pagos y CxC', icon:'pagos'},
    {id:'gastos', label:'Gastos', icon:'gastos'},
    {id:'rentabilidad', label:'Rentabilidad', icon:'rentabilidad'},
    {id:'reportes', label:'Reportes gerenciales', icon:'reportes'},
  ]},
  {group:'Sistema', items:[
    {id:'usuarios', label:'Usuarios y seguridad', icon:'usuarios'},
    {id:'guia', label:'Guía de la demo', icon:'guia'},
  ]},
];
NAV_ITEMS.forEach(g=>g.items.forEach(i=>{ i.roles = L.PERMISOS[i.id]; }));
function allowedViewsFor(rol){ return L.vistasPermitidas(rol); }
function canAccess(viewId){ return !!STATE.user && L.puedeAcceder(STATE.user.rol, viewId); }
function homeViewFor(rol){ return L.vistaInicio(rol); }
/** Un técnico solo puede ver sus propias órdenes; administrador y administrativo ven todas. */
function puedeVerOrden(o){ return !!STATE.user && (canAccess('ordenes') || (STATE.user.rol==='Técnico' && o.tecnicoId===STATE.user.tecnicoId)); }

/* ---------------------------- AUTENTICACIÓN ---------------------------- */
const APP = window.APP = {};

APP.quickLogin = function(email){
  document.getElementById('login-email').value = email;
  document.getElementById('login-pass').value = '123456';
  APP.login();
};

APP.login = function(){
  const r = L.autenticar(DB, val('login-email'), val('login-pass'));
  const errBox = document.getElementById('login-error');
  if(!r.ok){ errBox.style.display='block'; errBox.textContent = r.error; return; }
  const u = r.usuario;
  errBox.style.display='none';
  STATE.user = u;
  u.ultimoAcceso = todayStr();
  L.registrarBitacora(DB, u, 'Inicio de sesión', 'Acceso exitoso como '+u.rol);
  document.getElementById('login-screen').style.display='none';
  document.getElementById('app-shell').style.display='block';
  renderShell();
  APP.nav(homeViewFor(u.rol));
  toast('Bienvenido(a), '+u.nombre.split(' ')[0]+' · Rol: '+u.rol, 'success','check');
};

APP.logout = function(){
  L.registrarBitacora(DB, STATE.user, 'Cierre de sesión', 'Sesión finalizada');
  STATE.user = null;
  closeModal();
  document.getElementById('app-shell').style.display='none';
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('login-email').value='';
  document.getElementById('login-pass').value='';
  document.getElementById('login-error').style.display='none';
  closeAllDropdowns();
};
APP.verPerfil = function(){
  const u = STATE.user; closeAllDropdowns();
  const body = '<div class="stat-row"><span>Nombre</span><b>'+esc(u.nombre)+'</b></div>'+
    '<div class="stat-row"><span>Correo</span><b>'+esc(u.email)+'</b></div>'+
    '<div class="stat-row"><span>Rol</span><b>'+esc(u.rol)+'</b></div>'+
    '<div class="stat-row"><span>Último acceso</span><b>'+fmtDate(u.ultimoAcceso)+'</b></div>'+
    '<hr class="sep"><p class="small-muted" style="margin:0 0 8px;">Módulos habilitados para su rol:</p><div class="chip-list">'+
    L.vistasPermitidas(u.rol).map(v=>{ const it = NAV_ITEMS.flatMap(g=>g.items).find(i=>i.id===v); return '<span class="chip">'+ic('check')+' '+esc(it?it.label:v)+'</span>'; }).join('')+'</div>';
  openModal(modalShell('Mi perfil', 'usuarios', body, '<button class="btn btn-primary" onclick="closeModal()">Cerrar</button>'));
};

/* ---------------------------- SHELL (sidebar / topbar) ---------------------------- */
function renderShell(){
  const u = STATE.user;
  document.getElementById('user-avatar').textContent = initials(u.nombre);
  document.getElementById('user-chip-name').textContent = u.nombre;
  document.getElementById('user-chip-role').textContent = u.rol;
  document.getElementById('dropdown-user-info').innerHTML = '<b style="color:#111827;display:block;font-size:13px;">'+esc(u.nombre)+'</b>'+esc(u.email)+' · '+esc(u.rol);
  renderNotifs();
  renderSidebarNav();
}
function renderSidebarNav(){
  const rol = STATE.user.rol;
  let html = '';
  NAV_ITEMS.forEach(g=>{
    const items = g.items.filter(i=>i.roles.includes(rol));
    if(!items.length) return;
    html += '<div class="nav-group-label">'+esc(g.group)+'</div>';
    items.forEach(i=>{
      let extra = '';
      if(i.id==='inventario'){ const low = DB.productos.filter(p=>p.existencia<=p.stockMin).length; if(low) extra='<span class="nav-badge">'+low+'</span>'; }
      if(i.id==='pagos'){ const venc = DB.facturas.filter(f=>f.estado==='Vencida').length; if(venc) extra='<span class="nav-badge">'+venc+'</span>'; }
      if(i.id==='panel-tecnico'){ const mine = ordenesDeTecnico(u_tecId()).filter(o=>o.fecha===todayStr() && !['Finalizada','Cancelada'].includes(o.estado)).length; if(mine) extra='<span class="nav-badge">'+mine+'</span>'; }
      html += '<div class="nav-item" data-view="'+i.id+'" onclick="APP.nav(\''+i.id+'\')">'+ic(i.icon)+'<span>'+esc(i.label)+'</span>'+extra+'</div>';
    });
  });
  document.getElementById('sidebar-nav').innerHTML = html;
}
function u_tecId(){ return STATE.user && STATE.user.tecnicoId; }
function markActiveNav(viewId){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.view===viewId));
}
function renderNotifs(){
  const low = DB.productos.filter(p=>p.existencia<=p.stockMin).length;
  let html = '';
  if(low) html += '<div class="notif-item">'+ic('alert')+' <b>Inventario bajo</b><span>'+low+' productos requieren reabastecimiento</span></div>';
  DB.notificaciones.forEach(n=>{ html += '<div class="notif-item"><b>'+esc(n.titulo)+'</b><span>'+esc(n.detalle)+'</span></div>'; });
  document.getElementById('notif-list').innerHTML = html;
}
APP.toggleDropdown = function(which){
  const id = 'dropdown-'+which;
  const el = document.getElementById(id);
  const wasOpen = el.classList.contains('open');
  closeAllDropdowns();
  if(!wasOpen) el.classList.add('open');
};
function closeAllDropdowns(){ document.querySelectorAll('.dropdown').forEach(d=>d.classList.remove('open')); }
document.addEventListener('click', (e)=>{
  if(!e.target.closest('.user-chip') && !e.target.closest('.icon-btn') && !e.target.closest('.dropdown')) closeAllDropdowns();
});
APP.toggleSidebar = function(force){
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('mobile-overlay');
  const open = force!==undefined ? force : !sb.classList.contains('open');
  sb.classList.toggle('open', open);
  ov.classList.toggle('open', open);
};

APP.globalSearch = function(q){
  const box = document.getElementById('global-search-results');
  q = q.trim().toLowerCase();
  if(!q){ box.style.display='none'; box.innerHTML=''; return; }
  const res = [];
  // Solo se buscan entidades de los módulos permitidos para el rol activo.
  if(canAccess('clientes')) DB.clientes.forEach(c=>{ if(c.nombre.toLowerCase().includes(q)||c.nit.toLowerCase().includes(q)) res.push({t:'Cliente', label:c.nombre, go:()=>APP.verCliente(c.id)}); });
  if(canAccess('equipos')) DB.equipos.forEach(e=>{ if(e.serie.toLowerCase().includes(q)||e.modelo.toLowerCase().includes(q)) res.push({t:'Equipo', label:e.modelo+' · '+e.serie, go:()=>APP.verEquipo(e.id)}); });
  DB.ordenes.forEach(o=>{ if(o.id.toLowerCase().includes(q) && puedeVerOrden(o)) res.push({t:'Orden', label:o.id, go:()=> canAccess('ordenes') ? APP.verOrden(o.id) : (o.estado==='Finalizada' ? APP.verReporteTecnico(o.id) : APP.abrirEjecucion(o.id))}); });
  if(canAccess('facturacion')) DB.facturas.forEach(f=>{ if(f.id.toLowerCase().includes(q)) res.push({t:'Factura', label:f.id, go:()=>APP.verFactura(f.id)}); });
  box.style.cssText='position:absolute;top:44px;left:0;right:0;background:#fff;border:1px solid var(--gris-200);border-radius:9px;box-shadow:var(--shadow-md);z-index:60;max-height:280px;overflow-y:auto;display:block;';
  if(!res.length){ box.innerHTML='<div class="empty-state" style="padding:16px;">Sin resultados</div>'; return; }
  box.innerHTML = res.slice(0,8).map((r,idx)=>'<div class="dropdown-item" onclick="APP.globalSearchGo('+idx+')"><span class="badge badge-azul" style="margin-right:4px;">'+r.t+'</span>'+esc(r.label)+'</div>').join('');
  window.__searchRes = res;
};
APP.globalSearchGo = function(idx){ const r = window.__searchRes[idx]; document.getElementById('global-search').value=''; document.getElementById('global-search-results').style.display='none'; r.go(); };

/* ---------------------------- ROUTER ---------------------------- */
const VIEW_RENDERERS = {}; // se llenan más abajo: VIEW_RENDERERS['dashboard'] = function(params){...}

APP.nav = function(viewId, params){
  if(!STATE.user) return;
  if(!canAccess(viewId)){ toast('No tiene permisos para acceder a este módulo.','error','shield'); return; }
  STATE.view = viewId; STATE.params = params||{};
  markActiveNav(viewId);
  APP.toggleSidebar(false);
  closeAllDropdowns();
  const root = document.getElementById('view-root');
  const renderer = VIEW_RENDERERS[viewId];
  root.innerHTML = renderer ? renderer(STATE.params) : '<div class="empty-state">'+ic('empty')+'<div>Módulo en construcción</div></div>';
  root.scrollIntoView({behavior:'instant'});
  window.scrollTo(0,0);
  if(window.__afterRender && window.__afterRender[viewId]) window.__afterRender[viewId](STATE.params);
};
window.__afterRender = {};

/* ---------------------------- MINI CHART LIBRARY (canvas, sin dependencias) ---------------------------- */
const PALETTE = ['#2f80ed','#00b8d9','#16a34a','#f59e0b','#dc2626','#7c3aed','#0ea5e9','#84cc16'];
function dpiCanvas(canvas){
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width || canvas.parentElement.clientWidth || 320;
  const h = canvas.height ? canvas.height / ratio : (canvas.dataset.h ? +canvas.dataset.h : 220);
  canvas.width = w * ratio; canvas.height = h * ratio;
  canvas.style.width = w+'px'; canvas.style.height = h+'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio,0,0,ratio,0,0);
  return {ctx, w, h};
}
function drawBarChart(canvasId, labels, series, opts){
  opts = opts||{};
  const canvas = document.getElementById(canvasId); if(!canvas) return;
  const {ctx,w,h} = dpiCanvas(canvas);
  ctx.clearRect(0,0,w,h);
  const padL=38, padB=28, padT=14, padR=10;
  const plotW = w-padL-padR, plotH = h-padT-padB;
  const allVals = series.flatMap(s=>s.data);
  const maxV = Math.max(1, ...allVals) * 1.15;
  const n = labels.length;
  const groupW = plotW/n;
  const barW = Math.min(28, (groupW*0.62)/series.length);
  // grid
  ctx.strokeStyle='#eef1f5'; ctx.lineWidth=1; ctx.font='10px Segoe UI'; ctx.fillStyle='#94a3b8';
  for(let g=0; g<=4; g++){
    const y = padT + plotH - (plotH*g/4);
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(w-padR,y); ctx.stroke();
    ctx.fillText(Math.round(maxV*g/4).toLocaleString(), 2, y+3);
  }
  labels.forEach((lab,i)=>{
    const gx = padL + i*groupW;
    series.forEach((s,si)=>{
      const val = s.data[i]||0;
      const bh = plotH * (val/maxV);
      const bx = gx + groupW/2 - (series.length*barW)/2 + si*barW;
      const by = padT+plotH-bh;
      ctx.fillStyle = s.color || PALETTE[si%PALETTE.length];
      ctx.beginPath();
      roundRectPath(ctx, bx, by, barW-4, bh, 3);
      ctx.fill();
    });
    ctx.fillStyle='#64748b'; ctx.font='10px Segoe UI'; ctx.textAlign='center';
    ctx.fillText(lab, gx+groupW/2, h-9);
    ctx.textAlign='left';
  });
}
function roundRectPath(ctx,x,y,w,h,r){
  if(h<0){ y=y+h; h=Math.abs(h); }
  r = Math.min(r, w/2, h/2);
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function drawLineChart(canvasId, labels, series, opts){
  opts = opts||{};
  const canvas = document.getElementById(canvasId); if(!canvas) return;
  const {ctx,w,h} = dpiCanvas(canvas);
  ctx.clearRect(0,0,w,h);
  const padL=40, padB=26, padT=16, padR=14;
  const plotW=w-padL-padR, plotH=h-padT-padB;
  const allVals = series.flatMap(s=>s.data);
  const maxV = Math.max(1, ...allVals) * 1.15;
  const minV = Math.min(0, ...allVals);
  const n = labels.length;
  ctx.strokeStyle='#eef1f5'; ctx.lineWidth=1; ctx.font='10px Segoe UI'; ctx.fillStyle='#94a3b8';
  for(let g=0; g<=4; g++){
    const y = padT + plotH - (plotH*g/4);
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(w-padR,y); ctx.stroke();
    ctx.fillText(Math.round(maxV*g/4).toLocaleString(), 2, y+3);
  }
  const xAt = i => padL + (n<=1? plotW/2 : plotW*i/(n-1));
  const yAt = v => padT + plotH - (plotH*(v-minV)/(maxV-minV||1));
  series.forEach((s,si)=>{
    const color = s.color || PALETTE[si%PALETTE.length];
    ctx.beginPath();
    s.data.forEach((v,i)=>{ const x=xAt(i), y=yAt(v); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.strokeStyle=color; ctx.lineWidth=2.4; ctx.lineJoin='round'; ctx.stroke();
    // area fill
    const grad = ctx.createLinearGradient(0,padT,0,padT+plotH);
    grad.addColorStop(0, color+'33'); grad.addColorStop(1, color+'02');
    ctx.lineTo(xAt(n-1), padT+plotH); ctx.lineTo(xAt(0), padT+plotH); ctx.closePath();
    ctx.fillStyle=grad; ctx.fill();
    s.data.forEach((v,i)=>{ const x=xAt(i), y=yAt(v); ctx.beginPath(); ctx.arc(x,y,3,0,7); ctx.fillStyle=color; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=1.4; ctx.stroke(); });
  });
  ctx.fillStyle='#64748b'; ctx.font='10px Segoe UI'; ctx.textAlign='center';
  labels.forEach((lab,i)=>{ ctx.fillText(lab, xAt(i), h-8); });
  ctx.textAlign='left';
}
function drawDonutChart(canvasId, data, opts){
  opts = opts||{};
  const canvas = document.getElementById(canvasId); if(!canvas) return;
  const {ctx,w,h} = dpiCanvas(canvas);
  ctx.clearRect(0,0,w,h);
  const cx=w/2, cy=h/2, R=Math.min(w,h)/2 - 6, r=R*0.6;
  const total = data.reduce((s,d)=>s+d.value,0) || 1;
  let start = -Math.PI/2;
  data.forEach((d,i)=>{
    const angle = (d.value/total)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,R,start,start+angle);
    ctx.closePath();
    ctx.fillStyle = d.color || PALETTE[i%PALETTE.length];
    ctx.fill();
    start += angle;
  });
  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.fill();
  ctx.globalCompositeOperation='source-over';
  if(opts.centerLabel){
    ctx.fillStyle='#111827'; ctx.font='700 15px Segoe UI'; ctx.textAlign='center';
    ctx.fillText(opts.centerLabel, cx, cy+2);
    if(opts.centerSub){ ctx.font='10px Segoe UI'; ctx.fillStyle='#94a3b8'; ctx.fillText(opts.centerSub, cx, cy+16); }
    ctx.textAlign='left';
  }
}
function chartLegend(data){
  return '<div class="chart-legend">'+data.map((d,i)=>'<span class="legend-item"><span class="legend-dot" style="background:'+(d.color||PALETTE[i%PALETTE.length])+'"></span>'+esc(d.label)+'</span>').join('')+'</div>';
}

/* ---------------------------- CONSULTAS (envoltorios sobre logica.js) ---------------------------- */
function cliente(id){ return byId(DB.clientes,id); }
function equipo(id){ return byId(DB.equipos,id); }
function tecnico(id){ return byId(DB.tecnicos,id); }
function producto(id){ return byId(DB.productos,id); }
function cotizacion(id){ return byId(DB.cotizaciones,id); }
function orden(id){ return byId(DB.ordenes,id); }
function factura(id){ return byId(DB.facturas,id); }
function equiposDeCliente(clienteId){ return DB.equipos.filter(e=>e.clienteId===clienteId); }
function ordenesDeCliente(clienteId){ return DB.ordenes.filter(o=>o.clienteId===clienteId); }
function ordenesDeTecnico(tecId){ return DB.ordenes.filter(o=>o.tecnicoId===tecId); }
function pagosDeFactura(facId){ return L.pagosDeFactura(DB, facId); }
function saldoFactura(fac){ return L.saldoFactura(DB, fac); }
function totalPagadoFactura(fac){ return L.totalPagadoFactura(DB, fac); }
function checkScheduleConflict(tecnicoId, fecha, hora, excludeOrderId){ return L.checkScheduleConflict(DB, tecnicoId, fecha, hora, excludeOrderId); }
function costoOrden(o){ return L.costoOrden(DB, o); }
function ingresoOrden(o){ return L.ingresoOrden(DB, o); }
function rentabilidadOrden(o){ return L.rentabilidadOrden(DB, o); }
function calcTotales(items, descuentoPct, impuestoPct){ return L.calcTotales(items, descuentoPct, impuestoPct); }

/* ============================================================
   VISTA: DASHBOARD
   ============================================================ */
VIEW_RENDERERS['dashboard'] = function(){
  const rol = STATE.user.rol;
  const esTecnico = rol==='Técnico';
  const cotPend = DB.cotizaciones.filter(c=>['Enviada','Borrador'].includes(c.estado)).length;
  const ordActivas = DB.ordenes.filter(o=>['Pendiente','Programada','En proceso','En espera'].includes(o.estado)).length;
  const tecDisp = DB.tecnicos.filter(t=>t.estado==='Disponible').length;
  const mesActual = '2026-09';
  const finalizadosMes = DB.ordenes.filter(o=>o.estado==='Finalizada' && enUltimos30(o.fecha)).length;
  const facPend = DB.facturas.filter(f=>['Pendiente','Parcial','Vencida'].includes(f.estado)).length;
  const cxc = DB.facturas.reduce((s,f)=>s+saldoFactura(f),0);
  const ingresosMes = DB.facturas.filter(f=>enUltimos30(f.fecha) && f.estado!=='Anulada').reduce((s,f)=>s+f.total,0);
  const gastosMes = DB.gastos.filter(g=>enUltimos30(g.fecha)).reduce((s,g)=>s+g.monto*(1+(g.impuestoPct||0)/100),0);
  const rentMes = ingresosMes - gastosMes;

  const kpisAdmin = [
    {label:'Cotizaciones pendientes', val:cotPend, icon:'cotizaciones', color:'linear-gradient(135deg,#2f80ed,#1a4d8c)'},
    {label:'Órdenes activas', val:ordActivas, icon:'ordenes', color:'linear-gradient(135deg,#00b8d9,#0284c7)'},
    {label:'Técnicos disponibles', val:tecDisp+' / '+DB.tecnicos.length, icon:'panel', color:'linear-gradient(135deg,#16a34a,#15803d)'},
    {label:'Servicios finalizados (30 días)', val:finalizadosMes, icon:'check', color:'linear-gradient(135deg,#7c3aed,#5b21b6)'},
    {label:'Facturas pendientes', val:facPend, icon:'facturacion', color:'linear-gradient(135deg,#f59e0b,#b45309)'},
    {label:'Cuentas por cobrar', val:fmtQ(cxc), icon:'pagos', color:'linear-gradient(135deg,#dc2626,#991b1b)'},
    {label:'Ingresos (últimos 30 días)', val:fmtQ(ingresosMes), icon:'money', color:'linear-gradient(135deg,#16a34a,#0f766e)'},
    {label:'Gastos (últimos 30 días)', val:fmtQ(gastosMes), icon:'gastos', color:'linear-gradient(135deg,#64748b,#334155)'},
    {label:'Rentabilidad (últimos 30 días)', val:fmtQ(rentMes), icon:'rentabilidad', color:'linear-gradient(135deg,#2f80ed,#00b8d9)'},
  ];
  const kpisTecnico = (()=>{
    const mine = ordenesDeTecnico(u_tecId());
    const hoy = mine.filter(o=>o.fecha===todayStr() && !['Cancelada'].includes(o.estado)).length;
    const prox = mine.filter(o=>o.fecha>todayStr() && !['Cancelada','Finalizada'].includes(o.estado)).length;
    const pend = mine.filter(o=>['Pendiente','En espera'].includes(o.estado)).length;
    const fin = mine.filter(o=>o.estado==='Finalizada').length;
    return [
      {label:'Mis órdenes de hoy', val:hoy, icon:'calendar', color:'linear-gradient(135deg,#2f80ed,#1a4d8c)'},
      {label:'Próximos servicios', val:prox, icon:'clock', color:'linear-gradient(135deg,#00b8d9,#0284c7)'},
      {label:'Servicios pendientes', val:pend, icon:'wrench', color:'linear-gradient(135deg,#f59e0b,#b45309)'},
      {label:'Servicios finalizados', val:fin, icon:'check', color:'linear-gradient(135deg,#16a34a,#15803d)'},
    ];
  })();
  const kpis = esTecnico ? kpisTecnico : kpisAdmin;

  const kpiHtml = kpis.map(k=>'<div class="kpi-card"><div class="kpi-icon" style="background:'+k.color+'">'+ic(k.icon)+'</div><div class="kpi-val">'+k.val+'</div><div class="kpi-label">'+esc(k.label)+'</div></div>').join('');

  let bodyExtra = '';
  if(esTecnico){
    const mine = ordenesDeTecnico(u_tecId()).filter(o=>o.fecha===todayStr());
    bodyExtra = '<div class="card"><div class="card-head"><h3>'+ic('calendar')+' Agenda de hoy</h3><p>'+fmtDate(todayStr())+'</p></div><div class="card-body pad-0">'+
      (mine.length? tablaOrdenesSimple(mine) : '<div class="empty-state">'+ic('empty')+'<div>No tiene órdenes programadas para hoy.</div></div>')+
      '</div></div>'+
      '<div class="note-box">'+ic('info')+'<div>Acceda a <b>Mi panel técnico</b> para ejecutar sus servicios, registrar repuestos utilizados y finalizar órdenes de trabajo.</div></div>';
    return '<div class="view-header"><div><h1 class="view-title">'+ic('dashboard')+'Panel de indicadores</h1><p class="view-sub">Bienvenido, '+esc(STATE.user.nombre)+' · Técnico de campo</p></div></div>'+
      '<div class="kpi-grid">'+kpiHtml+'</div>'+bodyExtra;
  }

  return '<div class="view-header"><div><h1 class="view-title">'+ic('dashboard')+'Dashboard ejecutivo</h1><p class="view-sub">Resumen operativo y financiero · '+fmtDate(todayStr())+'</p></div>'+
    '<div class="view-actions"><button class="btn btn-outline" onclick="APP.nav(\'reportes\')">'+ic('reportes')+' Ver reportes</button></div></div>'+
    '<div class="kpi-grid">'+kpiHtml+'</div>'+
    '<div class="grid-2">'+
      '<div class="card"><div class="card-head"><h3>'+ic('chart')+' Servicios por mes</h3><p>Últimos 6 meses</p></div><div class="card-body"><div class="chart-wrap"><canvas id="chart-servicios-mes" data-h="230"></canvas></div></div></div>'+
      '<div class="card"><div class="card-head"><h3>'+ic('ordenes')+' Órdenes por estado</h3></div><div class="card-body"><div class="chart-wrap"><canvas id="chart-ordenes-estado" data-h="180"></canvas></div>'+donutLegendOrdenes()+'</div></div>'+
    '</div>'+
    '<div class="grid-2">'+
      '<div class="card"><div class="card-head"><h3>'+ic('money')+' Ingresos vs. gastos</h3><p>Últimos 6 meses</p></div><div class="card-body"><div class="chart-wrap"><canvas id="chart-ing-gas" data-h="230"></canvas></div>'+chartLegend([{label:'Ingresos',color:PALETTE[2]},{label:'Gastos',color:PALETTE[4]}])+'</div></div>'+
      '<div class="card"><div class="card-head"><h3>'+ic('equipos')+' Servicios por tipo de equipo</h3></div><div class="card-body"><div class="chart-wrap"><canvas id="chart-tipo-equipo" data-h="180"></canvas></div><div id="tipo-equipo-legend"></div></div></div>'+
    '</div>'+
    '<div class="grid-2">'+
      '<div class="card"><div class="card-head"><h3>'+ic('alert')+' Alertas de inventario</h3><p>Productos por debajo del stock mínimo</p></div><div class="card-body pad-0">'+alertasInventarioMini()+'</div></div>'+
      '<div class="card"><div class="card-head"><h3>'+ic('clock')+' Actividad reciente</h3></div><div class="card-body">'+bitacoraMini()+'</div></div>'+
    '</div>';
};

function tablaOrdenesSimple(list){
  return '<div class="table-scroll"><table class="tbl"><thead><tr><th>Hora</th><th>Orden</th><th>Cliente</th><th>Servicio</th><th>Prioridad</th><th>Estado</th><th></th></tr></thead><tbody>'+
    list.map(o=>'<tr><td class="cell-strong">'+o.hora+'</td><td>'+o.id+'</td><td>'+esc(cliente(o.clienteId).nombre)+'</td><td>'+esc(o.tipoServicio)+'</td><td>'+estadoBadge(o.prioridad)+'</td><td>'+estadoBadge(o.estado)+'</td>'+
    '<td><button class="btn btn-sm btn-outline" onclick="APP.abrirEjecucion(\''+o.id+'\')">Abrir</button></td></tr>').join('')+
    '</tbody></table></div>';
}
function alertasInventarioMini(){
  const low = DB.productos.filter(p=>p.existencia<=p.stockMin).sort((a,b)=>a.existencia-b.existencia);
  if(!low.length) return '<div class="empty-state">'+ic('check')+'<div>Todo el inventario está en niveles normales.</div></div>';
  return '<div class="table-scroll"><table class="tbl"><thead><tr><th>Producto</th><th>Existencia</th><th>Mínimo</th><th>Estado</th></tr></thead><tbody>'+
    low.slice(0,6).map(p=>'<tr><td class="cell-strong">'+esc(p.nombre)+'</td><td>'+p.existencia+'</td><td>'+p.stockMin+'</td><td>'+estadoBadge('Stock bajo')+'</td></tr>').join('')+
    '</tbody></table></div>';
}
function bitacoraMini(){
  return DB.bitacora.slice(0,5).map(b=>'<div class="stat-row"><span>'+esc(b.accion)+' · '+esc(b.usuario)+'</span><b style="font-weight:500;color:var(--gris-500);font-size:11px;">'+esc(b.fecha)+'</b></div>').join('');
}
function donutLegendOrdenes(){
  const estados = ['Pendiente','Programada','En proceso','En espera','Finalizada','Cancelada'];
  const counts = estados.map(e=>DB.ordenes.filter(o=>o.estado===e).length);
  const data = estados.map((e,i)=>({label:e, value:counts[i]}));
  window.__pendingCharts = window.__pendingCharts||[];
  return chartLegend(data);
}

window.__afterRender['dashboard'] = function(){
  // Servicios por mes (últimos 6 meses simulados a partir de órdenes finalizadas)
  const meses = ultimosMeses(6);
  const base = [6,8,7,10,12, DB.ordenes.filter(o=>o.estado==='Finalizada').length + 3];
  if(document.getElementById('chart-servicios-mes')) drawBarChart('chart-servicios-mes', meses, [{label:'Servicios', data:base, color:PALETTE[0]}]);

  const estados = ['Pendiente','Programada','En proceso','En espera','Finalizada','Cancelada'];
  const counts = estados.map(e=>DB.ordenes.filter(o=>o.estado===e).length);
  if(document.getElementById('chart-ordenes-estado')) drawDonutChart('chart-ordenes-estado', estados.map((e,i)=>({label:e,value:counts[i]||0.0001})), {centerLabel:String(DB.ordenes.length), centerSub:'órdenes'});

  const ingSerie = [42000,38500,51200,47800,60300, DB.facturas.reduce((s,f)=>s+f.total,0)];
  const gasSerie = [21000,19800,24500,23100,27600, DB.gastos.reduce((s,g)=>s+g.monto*(1+(g.impuestoPct||0)/100),0)];
  if(document.getElementById('chart-ing-gas')) drawLineChart('chart-ing-gas', meses, [{label:'Ingresos',data:ingSerie,color:PALETTE[2]},{label:'Gastos',data:gasSerie,color:PALETTE[4]}]);

  const tipos = ['Bomba centrífuga','Bomba sumergible','Motor eléctrico','Panel de control','Variador de frecuencia'];
  const tcounts = tipos.map(t=> DB.ordenes.filter(o=>{ const eq=equipo(o.equipoId); return eq && eq.tipo===t; }).length || 0.0001);
  if(document.getElementById('chart-tipo-equipo')) drawDonutChart('chart-tipo-equipo', tipos.map((t,i)=>({label:t,value:tcounts[i]})));
  const el = document.getElementById('tipo-equipo-legend');
  if(el) el.innerHTML = chartLegend(tipos.map((t,i)=>({label:t,color:PALETTE[i%PALETTE.length]})));
};

/* ============================================================
   VISTA: CLIENTES
   ============================================================ */
VIEW_RENDERERS['clientes'] = function(){
  return '<div class="view-header"><div><h1 class="view-title">'+ic('clientes')+'Clientes</h1><p class="view-sub">Administración de clientes y cuentas comerciales</p></div>'+
    '<div class="view-actions"><button class="btn btn-primary" onclick="APP.formCliente()">'+ic('plus')+' Nuevo cliente</button></div></div>'+
    '<div class="card"><div class="table-toolbar">'+
      '<div class="tt-search">'+ic('search')+'<input type="text" id="f-cli-q" placeholder="Buscar por nombre, NIT o correo..." oninput="APP.renderClientesTabla()"></div>'+
      '<select id="f-cli-estado" onchange="APP.renderClientesTabla()"><option value="">Todos los estados</option><option>Activo</option><option>Inactivo</option></select>'+
    '</div><div class="card-body pad-0" id="clientes-tabla-wrap"></div></div>';
};
window.__afterRender['clientes'] = function(){ APP.renderClientesTabla(); };

APP.renderClientesTabla = function(){
  const q = (document.getElementById('f-cli-q')?.value||'').toLowerCase();
  const est = document.getElementById('f-cli-estado')?.value||'';
  let list = DB.clientes.filter(c=>
    (!q || c.nombre.toLowerCase().includes(q) || c.nit.toLowerCase().includes(q) || c.correo.toLowerCase().includes(q)) &&
    (!est || c.estado===est));
  const wrap = document.getElementById('clientes-tabla-wrap');
  if(!wrap) return;
  if(!list.length){ wrap.innerHTML = '<div class="empty-state">'+ic('empty')+'<div>No se encontraron clientes con ese criterio.</div></div>'; return; }
  wrap.innerHTML = '<div class="table-scroll"><table class="tbl"><thead><tr><th>Código</th><th>Nombre / Empresa</th><th>NIT</th><th>Teléfono</th><th>Correo</th><th>Estado</th><th>Equipos</th><th></th></tr></thead><tbody>'+
    list.map(c=>'<tr><td>'+c.id+'</td><td class="cell-strong">'+esc(c.nombre)+'</td><td>'+esc(c.nit)+'</td><td>'+esc(c.telefono)+'</td><td>'+esc(c.correo)+'</td><td>'+estadoBadge(c.estado)+'</td><td>'+equiposDeCliente(c.id).length+'</td>'+
    '<td><div class="cell-actions">'+
      '<button class="icon-action" title="Ver" onclick="APP.verCliente(\''+c.id+'\')">'+ic('eye')+'</button>'+
      '<button class="icon-action" title="Editar" onclick="APP.formCliente(\''+c.id+'\')">'+ic('edit')+'</button>'+
    '</div></td></tr>').join('')+
    '</tbody></table></div>';
};

APP.formCliente = function(id){
  const c = id ? cliente(id) : null;
  const body = '<div class="form-grid">'+
    '<div class="field"><label>Nombre / Razón social</label><input id="cf-nombre" value="'+esc(c?c.nombre:'')+'"></div>'+
    '<div class="field"><label>Nombre comercial (empresa)</label><input id="cf-empresa" value="'+esc(c?c.empresa:'')+'"></div>'+
    '<div class="field"><label>NIT</label><input id="cf-nit" value="'+esc(c?c.nit:'')+'"></div>'+
    '<div class="field"><label>Teléfono</label><input id="cf-telefono" value="'+esc(c?c.telefono:'')+'"></div>'+
    '<div class="field"><label>Correo electrónico</label><input id="cf-correo" value="'+esc(c?c.correo:'')+'"></div>'+
    '<div class="field"><label>Estado</label><select id="cf-estado"><option'+(c&&c.estado==='Activo'?' selected':'')+'>Activo</option><option'+(c&&c.estado==='Inactivo'?' selected':'')+'>Inactivo</option></select></div>'+
    '<div class="field full"><label>Dirección</label><input id="cf-direccion" value="'+esc(c?c.direccion:'')+'"></div>'+
  '</div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="APP.guardarCliente(\''+(id||'')+'\')">'+ic('check')+' Guardar cliente</button>';
  openModal(modalShell(c?'Editar cliente':'Nuevo cliente', 'clientes', body, foot));
};
APP.guardarCliente = function(id){
  const data = {nombre:val('cf-nombre'), empresa:val('cf-empresa'), nit:val('cf-nit'), telefono:val('cf-telefono'), correo:val('cf-correo'), direccion:val('cf-direccion'), estado:val('cf-estado')};
  const r = id ? L.actualizarCliente(DB, id, data, STATE.user) : L.crearCliente(DB, data, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  toast(id ? 'Cliente actualizado correctamente.' : 'Cliente '+r.cliente.id+' registrado correctamente. Continúe registrando su equipo.','success','check');
  closeModal();
  if(STATE.view==='clientes') APP.renderClientesTabla();
};

APP.verCliente = function(id, tab){
  const c = cliente(id); if(!c) return;
  tab = tab || 'info';
  const eqs = equiposDeCliente(id);
  const ords = ordenesDeCliente(id);
  const cots = DB.cotizaciones.filter(x=>x.clienteId===id);
  const body = '<div class="tabs" id="cli-tabs">'+
      '<button class="tab-btn '+(tab==='info'?'active':'')+'" onclick="APP.verCliente(\''+id+'\',\'info\')">Información</button>'+
      '<button class="tab-btn '+(tab==='equipos'?'active':'')+'" onclick="APP.verCliente(\''+id+'\',\'equipos\')">Equipos ('+eqs.length+')</button>'+
      '<button class="tab-btn '+(tab==='historial'?'active':'')+'" onclick="APP.verCliente(\''+id+'\',\'historial\')">Historial de servicios ('+ords.length+')</button>'+
    '</div>'+
    (tab==='info' ? (
      '<div class="two-col-sm">'+
        '<div class="stat-row"><span>Código</span><b>'+c.id+'</b></div>'+
        '<div class="stat-row"><span>Estado</span>'+estadoBadge(c.estado)+'</div>'+
      '</div>'+
      '<div class="stat-row"><span>Empresa</span><b>'+esc(c.empresa)+'</b></div>'+
      '<div class="stat-row"><span>NIT</span><b>'+esc(c.nit)+'</b></div>'+
      '<div class="stat-row"><span>Teléfono</span><b>'+esc(c.telefono)+'</b></div>'+
      '<div class="stat-row"><span>Correo</span><b>'+esc(c.correo)+'</b></div>'+
      '<div class="stat-row"><span>Dirección</span><b>'+esc(c.direccion)+'</b></div>'+
      '<hr class="sep">'+
      '<div class="stat-row"><span>Cotizaciones registradas</span><b>'+cots.length+'</b></div>'+
      '<div class="stat-row"><span>Órdenes de trabajo</span><b>'+ords.length+'</b></div>'+
      '<div class="stat-row"><span>Facturación total histórica</span><b>'+fmtQ(DB.facturas.filter(f=>f.clienteId===id && f.estado!=='Anulada').reduce((s,f)=>s+f.total,0))+'</b></div>'
    ) : tab==='equipos' ? (
      eqs.length ? '<div class="table-scroll"><table class="tbl"><thead><tr><th>Código</th><th>Tipo</th><th>Marca / Modelo</th><th>Ubicación</th><th>Estado</th></tr></thead><tbody>'+
        eqs.map(e=>'<tr><td>'+e.id+'</td><td>'+esc(e.tipo)+'</td><td class="cell-strong">'+esc(e.marca)+' '+esc(e.modelo)+'</td><td>'+esc(e.ubicacion)+'</td><td>'+estadoBadge(e.estado)+'</td></tr>').join('')+
        '</tbody></table></div>' : '<div class="empty-state">'+ic('empty')+'<div>Este cliente no tiene equipos registrados.</div></div>'
    ) : (
      ords.length ? '<div class="table-scroll"><table class="tbl"><thead><tr><th>Orden</th><th>Fecha</th><th>Equipo</th><th>Servicio</th><th>Técnico</th><th>Estado</th></tr></thead><tbody>'+
        ords.map(o=>'<tr><td>'+o.id+'</td><td>'+fmtDate(o.fecha)+'</td><td>'+(o.equipoId?esc(equipo(o.equipoId).tipo):'—')+'</td><td>'+esc(o.tipoServicio)+'</td><td>'+esc(tecnico(o.tecnicoId).nombre)+'</td><td>'+estadoBadge(o.estado)+'</td></tr>').join('')+
        '</tbody></table></div>' : '<div class="empty-state">'+ic('empty')+'<div>Sin historial de servicios.</div></div>'
    ));
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button><button class="btn btn-outline" onclick="APP.formCliente(\''+id+'\')">'+ic('edit')+' Editar</button><button class="btn btn-primary" onclick="closeModal();APP.nav(\'equipos\',{clienteId:\''+id+'\'})">'+ic('equipos')+' Ver equipos</button>';
  openModal(modalShell('Cliente: '+c.nombre, 'clientes', body, foot), {size:'wide'});
};

/* ============================================================
   VISTA: EQUIPOS
   ============================================================ */
const TIPOS_EQUIPO = L.TIPOS_EQUIPO;

VIEW_RENDERERS['equipos'] = function(params){
  window.__eqFiltroCliente = params && params.clienteId ? params.clienteId : (window.__eqFiltroCliente||'');
  return '<div class="view-header"><div><h1 class="view-title">'+ic('equipos')+'Equipos</h1><p class="view-sub">Inventario técnico de bombas, motores y paneles instalados en cliente</p></div>'+
    '<div class="view-actions"><button class="btn btn-primary" onclick="APP.formEquipo()">'+ic('plus')+' Nuevo equipo</button></div></div>'+
    '<div class="card"><div class="table-toolbar">'+
      '<div class="tt-search">'+ic('search')+'<input type="text" id="f-eq-q" placeholder="Buscar por serie, marca o modelo..." oninput="APP.renderEquiposTabla()"></div>'+
      '<select id="f-eq-tipo" onchange="APP.renderEquiposTabla()"><option value="">Todos los tipos</option>'+TIPOS_EQUIPO.map(t=>'<option>'+t+'</option>').join('')+'</select>'+
      '<select id="f-eq-cliente" onchange="APP.renderEquiposTabla()"><option value="">Todos los clientes</option>'+DB.clientes.map(c=>'<option value="'+c.id+'" '+(window.__eqFiltroCliente===c.id?'selected':'')+'>'+esc(c.nombre)+'</option>').join('')+'</select>'+
    '</div><div class="card-body pad-0" id="equipos-tabla-wrap"></div></div>';
};
window.__afterRender['equipos'] = function(){ if(window.__eqFiltroCliente) document.getElementById('f-eq-cliente').value = window.__eqFiltroCliente; APP.renderEquiposTabla(); };

APP.renderEquiposTabla = function(){
  const q = (document.getElementById('f-eq-q')?.value||'').toLowerCase();
  const tipo = document.getElementById('f-eq-tipo')?.value||'';
  const cli = document.getElementById('f-eq-cliente')?.value||'';
  let list = DB.equipos.filter(e=>
    (!q || e.serie.toLowerCase().includes(q) || e.marca.toLowerCase().includes(q) || e.modelo.toLowerCase().includes(q)) &&
    (!tipo || e.tipo===tipo) && (!cli || e.clienteId===cli));
  const wrap = document.getElementById('equipos-tabla-wrap');
  if(!list.length){ wrap.innerHTML = '<div class="empty-state">'+ic('empty')+'<div>No se encontraron equipos con ese criterio.</div></div>'; return; }
  wrap.innerHTML = '<div class="table-scroll"><table class="tbl"><thead><tr><th>Código</th><th>Cliente</th><th>Tipo</th><th>Marca / Modelo</th><th>HP</th><th>Serie</th><th>Últ. mantenimiento</th><th>Estado</th><th></th></tr></thead><tbody>'+
    list.map(e=>'<tr><td>'+e.id+'</td><td class="cell-strong">'+esc(cliente(e.clienteId).nombre)+'</td><td>'+esc(e.tipo)+'</td><td>'+esc(e.marca)+' '+esc(e.modelo)+'</td><td>'+(e.potenciaHP||'—')+'</td><td>'+esc(e.serie)+'</td><td>'+fmtDate(e.ultMant)+'</td><td>'+estadoBadge(e.estado)+'</td>'+
    '<td><div class="cell-actions"><button class="icon-action" title="Ver historial" onclick="APP.verEquipo(\''+e.id+'\')">'+ic('eye')+'</button><button class="icon-action" title="Editar" onclick="APP.formEquipo(\''+e.id+'\')">'+ic('edit')+'</button></div></td></tr>').join('')+
    '</tbody></table></div>';
};

APP.formEquipo = function(id){
  const e = id ? equipo(id) : null;
  const body = '<div class="form-grid">'+
    '<div class="field"><label>Cliente</label><select id="ef-cliente">'+DB.clientes.map(c=>'<option value="'+c.id+'" '+(e&&e.clienteId===c.id?'selected':'')+'>'+esc(c.nombre)+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Tipo de equipo</label><select id="ef-tipo">'+TIPOS_EQUIPO.map(t=>'<option '+(e&&e.tipo===t?'selected':'')+'>'+t+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Marca</label><input id="ef-marca" value="'+esc(e?e.marca:'')+'"></div>'+
    '<div class="field"><label>Modelo</label><input id="ef-modelo" value="'+esc(e?e.modelo:'')+'"></div>'+
    '<div class="field"><label>Potencia (HP)</label><input type="number" id="ef-hp" value="'+(e&&e.potenciaHP!=null?e.potenciaHP:'')+'"></div>'+
    '<div class="field"><label>Voltaje</label><input id="ef-voltaje" value="'+esc(e?e.voltaje:'')+'"></div>'+
    '<div class="field"><label>Número de serie</label><input id="ef-serie" value="'+esc(e?e.serie:'')+'"></div>'+
    '<div class="field"><label>Ubicación</label><input id="ef-ubicacion" value="'+esc(e?e.ubicacion:'')+'"></div>'+
    '<div class="field"><label>Estado</label><select id="ef-estado">'+['Activo','En mantenimiento','Fuera de servicio','Inactivo'].map(s=>'<option '+(e&&e.estado===s?'selected':'')+'>'+s+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Fecha de último mantenimiento</label><input type="date" id="ef-ultmant" value="'+(e?e.ultMant:todayStr())+'"></div>'+
  '</div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="APP.guardarEquipo(\''+(id||'')+'\')">'+ic('check')+' Guardar equipo</button>';
  openModal(modalShell(e?'Editar equipo':'Nuevo equipo', 'equipos', body, foot));
};
APP.guardarEquipo = function(id){
  const data = {clienteId:val('ef-cliente'), tipo:val('ef-tipo'), marca:val('ef-marca'), modelo:val('ef-modelo'), potenciaHP:val('ef-hp'),
    voltaje:val('ef-voltaje'), serie:val('ef-serie'), ubicacion:val('ef-ubicacion'), estado:val('ef-estado'), ultMant:val('ef-ultmant')};
  const r = id ? L.actualizarEquipo(DB, id, data, STATE.user) : L.crearEquipo(DB, data, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  toast(id ? 'Equipo actualizado correctamente.' : 'Equipo '+r.equipo.id+' registrado correctamente. Ya puede generar una cotización para este equipo.','success','check');
  closeModal();
  if(STATE.view==='equipos') APP.renderEquiposTabla();
};

APP.verEquipo = function(id){
  const e = equipo(id); if(!e) return;
  const hist = DB.mantenimientos.filter(m=>m.equipoId===id);
  const body = '<div class="two-col-sm">'+
      '<div class="stat-row"><span>Cliente</span><b>'+esc(cliente(e.clienteId).nombre)+'</b></div>'+
      '<div class="stat-row"><span>Estado</span>'+estadoBadge(e.estado)+'</div>'+
    '</div>'+
    '<div class="stat-row"><span>Tipo</span><b>'+esc(e.tipo)+'</b></div>'+
    '<div class="stat-row"><span>Marca / Modelo</span><b>'+esc(e.marca)+' '+esc(e.modelo)+'</b></div>'+
    '<div class="stat-row"><span>Potencia</span><b>'+(e.potenciaHP?e.potenciaHP+' HP':'N/A')+'</b></div>'+
    '<div class="stat-row"><span>Voltaje</span><b>'+esc(e.voltaje)+'</b></div>'+
    '<div class="stat-row"><span>Serie</span><b>'+esc(e.serie)+'</b></div>'+
    '<div class="stat-row"><span>Ubicación</span><b>'+esc(e.ubicacion)+'</b></div>'+
    '<hr class="sep"><h4 style="margin:0 0 10px;font-size:13px;">Historial de mantenimiento</h4>'+
    (hist.length ? '<div class="flow-steps">'+hist.map(h=>'<div class="flow-step"><div class="flow-num '+(h.tipo==='Preventivo'?'done':'')+'" style="background:'+(h.tipo==='Correctivo'?'var(--rojo)':'var(--verde)')+'">'+ic('wrench')+'</div><div class="flow-txt"><b>'+fmtDate(h.fecha)+' · '+esc(h.tipo)+'</b><span>'+esc(h.descripcion)+' — Téc. '+esc(h.tecnico)+'</span></div></div>').join('')+'</div>'
      : '<p class="small-muted">Sin mantenimientos registrados aún (equipo nuevo o recién ingresado).</p>');
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button><button class="btn btn-primary" onclick="APP.formEquipo(\''+id+'\')">'+ic('edit')+' Editar equipo</button>';
  openModal(modalShell('Equipo: '+e.tipo+' — '+e.serie, 'equipos', body, foot));
};

/* ============================================================
   VISTA: COTIZACIONES
   ============================================================ */
const ESTADOS_COT = L.ESTADOS_COT;

VIEW_RENDERERS['cotizaciones'] = function(){
  return '<div class="view-header"><div><h1 class="view-title">'+ic('cotizaciones')+'Cotizaciones</h1><p class="view-sub">Generación y seguimiento de cotizaciones de servicio</p></div>'+
    '<div class="view-actions"><button class="btn btn-primary" onclick="APP.formCotizacion()">'+ic('plus')+' Nueva cotización</button></div></div>'+
    '<div class="card"><div class="table-toolbar">'+
      '<div class="tt-search">'+ic('search')+'<input type="text" id="f-cot-q" placeholder="Buscar por número o cliente..." oninput="APP.renderCotizacionesTabla()"></div>'+
      '<select id="f-cot-estado" onchange="APP.renderCotizacionesTabla()"><option value="">Todos los estados</option>'+ESTADOS_COT.map(s=>'<option>'+s+'</option>').join('')+'</select>'+
    '</div><div class="card-body pad-0" id="cotizaciones-tabla-wrap"></div></div>';
};
window.__afterRender['cotizaciones'] = function(){ APP.renderCotizacionesTabla(); };

APP.renderCotizacionesTabla = function(){
  const q = (document.getElementById('f-cot-q')?.value||'').toLowerCase();
  const est = document.getElementById('f-cot-estado')?.value||'';
  let list = DB.cotizaciones.filter(c=>{
    const cl = cliente(c.clienteId);
    return (!q || c.id.toLowerCase().includes(q) || (cl&&cl.nombre.toLowerCase().includes(q))) && (!est || c.estado===est);
  }).slice().reverse();
  const wrap = document.getElementById('cotizaciones-tabla-wrap');
  if(!list.length){ wrap.innerHTML = '<div class="empty-state">'+ic('empty')+'<div>No se encontraron cotizaciones.</div></div>'; return; }
  wrap.innerHTML = '<div class="table-scroll"><table class="tbl"><thead><tr><th>Número</th><th>Cliente</th><th>Servicio</th><th>Fecha</th><th>Vigencia</th><th>Total</th><th>Estado</th><th></th></tr></thead><tbody>'+
    list.map(c=>{
      const t = calcTotales(c.items,c.descuentoPct,c.impuestoPct);
      const vig = addDays(c.fecha, c.vigenciaDias);
      return '<tr><td class="cell-strong">'+c.id+'</td><td>'+esc(cliente(c.clienteId).nombre)+'</td><td>'+esc(c.tipoServicio)+'</td><td>'+fmtDate(c.fecha)+'</td><td>'+fmtDate(vig)+'</td><td class="cell-strong">'+fmtQ(t.total)+'</td><td>'+estadoBadge(c.estado)+'</td>'+
      '<td><div class="cell-actions"><button class="icon-action" title="Ver" onclick="APP.verCotizacion(\''+c.id+'\')">'+ic('eye')+'</button><button class="icon-action" title="Editar" onclick="APP.formCotizacion(\''+c.id+'\')">'+ic('edit')+'</button></div></td></tr>';
    }).join('')+
    '</tbody></table></div>';
};

function nuevoItemVacio(){ return {desc:'', tipo:'Mano de obra', cant:1, pu:0}; }

APP.formCotizacion = function(id){
  const c = id ? cotizacion(id) : null;
  window.__cotItems = c ? JSON.parse(JSON.stringify(c.items)) : [nuevoItemVacio()];
  const clienteOpts = DB.clientes.map(cl=>'<option value="'+cl.id+'" '+(c&&c.clienteId===cl.id?'selected':'')+'>'+esc(cl.nombre)+'</option>').join('');
  const body = '<div class="form-grid">'+
    '<div class="field"><label>Cliente</label><select id="cotf-cliente" onchange="APP.actualizarEquiposCot()">'+clienteOpts+'</select></div>'+
    '<div class="field"><label>Equipo</label><select id="cotf-equipo"></select></div>'+
    '<div class="field"><label>Tipo de servicio</label><input id="cotf-tiposervicio" value="'+esc(c?c.tipoServicio:'Mantenimiento preventivo')+'"></div>'+
    '<div class="field"><label>Técnico recomendado</label><select id="cotf-tecnico">'+DB.tecnicos.map(t=>'<option value="'+t.id+'" '+(c&&c.tecnicoId===t.id?'selected':'')+'>'+esc(t.nombre)+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Fecha</label><input type="date" id="cotf-fecha" value="'+(c?c.fecha:todayStr())+'"></div>'+
    '<div class="field"><label>Vigencia (días)</label><input type="number" id="cotf-vigencia" value="'+(c?c.vigenciaDias:15)+'"></div>'+
  '</div><hr class="sep">'+
  '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><h4 style="margin:0;font-size:13px;">Detalle de la cotización</h4><button class="btn btn-sm btn-outline" onclick="APP.agregarItemCot()">'+ic('plus')+' Agregar línea</button></div>'+
  '<div id="cot-items-wrap"></div>'+
  '<div class="form-grid" style="margin-top:10px;">'+
    '<div class="field"><label>Descuento (%)</label><input type="number" id="cotf-descuento" value="'+(c?c.descuentoPct:0)+'" oninput="APP.recalcCot()"></div>'+
    '<div class="field"><label>Impuesto / IVA (%)</label><input type="number" id="cotf-impuesto" value="'+(c?c.impuestoPct:12)+'" oninput="APP.recalcCot()"></div>'+
  '</div>'+
  '<div class="total-box" id="cot-totales"></div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="APP.guardarCotizacion(\''+(id||'')+'\')">'+ic('check')+' Guardar cotización</button>';
  openModal(modalShell(c?'Editar cotización '+c.id:'Nueva cotización', 'cotizaciones', body, foot), {size:'wide'});
  APP.actualizarEquiposCot(c?c.equipoId:null);
  APP.renderItemsCot();
};
APP.actualizarEquiposCot = function(preselect){
  const clienteId = document.getElementById('cotf-cliente').value;
  const eqs = equiposDeCliente(clienteId);
  document.getElementById('cotf-equipo').innerHTML = eqs.map(e=>'<option value="'+e.id+'" '+(preselect===e.id?'selected':'')+'>'+esc(e.tipo)+' — '+esc(e.marca)+' '+esc(e.modelo)+'</option>').join('') || '<option value="">Sin equipos registrados</option>';
};
APP.agregarItemCot = function(){ window.__cotItems.push(nuevoItemVacio()); APP.renderItemsCot(); };
APP.quitarItemCot = function(idx){ window.__cotItems.splice(idx,1); APP.renderItemsCot(); };
APP.actualizarItemCot = function(idx, field, val){
  window.__cotItems[idx][field] = (field==='cant'||field==='pu') ? (+val||0) : val;
  APP.recalcCot();
};
APP.renderItemsCot = function(){
  const wrap = document.getElementById('cot-items-wrap');
  const tipos = ['Mano de obra','Repuestos','Materiales','Transporte'];
  wrap.innerHTML = '<table class="line-items"><thead><tr><th style="width:34%">Descripción</th><th>Tipo</th><th>Cant.</th><th>Precio unit.</th><th>Subtotal</th><th></th></tr></thead><tbody>'+
    window.__cotItems.map((it,idx)=>'<tr>'+
      '<td><input value="'+esc(it.desc)+'" placeholder="Ej. Mano de obra técnica" onchange="APP.actualizarItemCot('+idx+',\'desc\',this.value)"></td>'+
      '<td><select onchange="APP.actualizarItemCot('+idx+',\'tipo\',this.value)">'+tipos.map(t=>'<option '+(it.tipo===t||(t==='Repuestos'&&it.tipo==='Repuesto')?'selected':'')+'>'+t+'</option>').join('')+'</select></td>'+
      '<td><input type="number" min="0" step="1" value="'+it.cant+'" onchange="APP.actualizarItemCot('+idx+',\'cant\',this.value)"></td>'+
      '<td><input type="number" min="0" step="0.01" value="'+it.pu+'" onchange="APP.actualizarItemCot('+idx+',\'pu\',this.value)"></td>'+
      '<td class="cell-strong">'+fmtQ(it.cant*it.pu)+'</td>'+
      '<td><button class="icon-action" onclick="APP.quitarItemCot('+idx+')">'+ic('trash')+'</button></td>'+
    '</tr>').join('')+
    '</tbody></table>';
  APP.recalcCot();
};
APP.recalcCot = function(){
  const desc = +document.getElementById('cotf-descuento').value || 0;
  const imp = +document.getElementById('cotf-impuesto').value || 0;
  const t = calcTotales(window.__cotItems, desc, imp);
  document.getElementById('cot-totales').innerHTML =
    '<div class="total-line"><span>Subtotal</span><b>'+fmtQ(t.subtotal)+'</b></div>'+
    '<div class="total-line"><span>Descuento ('+desc+'%)</span><b>-'+fmtQ(t.descuento)+'</b></div>'+
    '<div class="total-line"><span>Impuesto / IVA ('+imp+'%)</span><b>'+fmtQ(t.impuesto)+'</b></div>'+
    '<div class="total-line grand"><span>Total</span><span>'+fmtQ(t.total)+'</span></div>';
};
APP.guardarCotizacion = function(id){
  const data = {clienteId:val('cotf-cliente'), equipoId:val('cotf-equipo'), tipoServicio:val('cotf-tiposervicio'), tecnicoId:val('cotf-tecnico'),
    fecha:val('cotf-fecha'), vigenciaDias:val('cotf-vigencia'), descuentoPct:val('cotf-descuento'), impuestoPct:val('cotf-impuesto'), items:window.__cotItems};
  const r = id ? L.actualizarCotizacion(DB, id, data, STATE.user) : L.crearCotizacion(DB, data, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  toast(id ? 'Cotización actualizada.' : 'Cotización '+r.cotizacion.id+' creada en estado Borrador.','success','check');
  closeModal();
  if(STATE.view==='cotizaciones') APP.renderCotizacionesTabla();
};

APP.verCotizacion = function(id){
  const c = cotizacion(id); if(!c) return;
  const t = calcTotales(c.items,c.descuentoPct,c.impuestoPct);
  const cl = cliente(c.clienteId); const eq = equipo(c.equipoId); const tec = tecnico(c.tecnicoId);
  const yaOrden = DB.ordenes.some(o=>o.cotizacionId===id);
  const body = '<div class="print-only" style="margin-bottom:14px;"><h2 style="margin:0;">SIGEM · Cotización '+c.id+'</h2><p class="small-muted">Sistema Integral de Gestión Electromecánica</p></div>'+
    '<div class="two-col-sm">'+
      '<div class="stat-row"><span>Cliente</span><b>'+esc(cl.nombre)+'</b></div>'+
      '<div class="stat-row"><span>Estado</span>'+estadoBadge(c.estado)+'</div>'+
    '</div>'+
    '<div class="stat-row"><span>Equipo</span><b>'+(eq?esc(eq.tipo)+' — '+esc(eq.modelo):'N/A')+'</b></div>'+
    '<div class="stat-row"><span>Tipo de servicio</span><b>'+esc(c.tipoServicio)+'</b></div>'+
    '<div class="stat-row"><span>Técnico recomendado</span><b>'+esc(tec.nombre)+'</b></div>'+
    '<div class="stat-row"><span>Fecha / Vigencia</span><b>'+fmtDate(c.fecha)+' — vence '+fmtDate(addDays(c.fecha,c.vigenciaDias))+'</b></div>'+
    '<hr class="sep">'+
    '<table class="line-items"><thead><tr><th>Descripción</th><th>Tipo</th><th>Cant.</th><th>P. unitario</th><th>Subtotal</th></tr></thead><tbody>'+
      c.items.map(it=>'<tr><td>'+esc(it.desc)+'</td><td>'+esc(it.tipo)+'</td><td>'+it.cant+'</td><td>'+fmtQ(it.pu)+'</td><td class="cell-strong">'+fmtQ(it.cant*it.pu)+'</td></tr>').join('')+
    '</tbody></table>'+
    '<div class="total-box">'+
      '<div class="total-line"><span>Subtotal</span><b>'+fmtQ(t.subtotal)+'</b></div>'+
      '<div class="total-line"><span>Descuento</span><b>-'+fmtQ(t.descuento)+'</b></div>'+
      '<div class="total-line"><span>Impuesto</span><b>'+fmtQ(t.impuesto)+'</b></div>'+
      '<div class="total-line grand"><span>Total</span><span>'+fmtQ(t.total)+'</span></div>'+
    '</div>'+
    (c.estado==='Aprobada' && yaOrden ? '<div class="note-box" style="margin-top:14px;">'+ic('check')+'<div>Ya existe una orden de trabajo generada a partir de esta cotización.</div></div>' : '');
  let estadoBtns = '<select id="cotf-cambio-estado" class="no-print" style="margin-right:auto;">'+ESTADOS_COT.map(s=>'<option '+(c.estado===s?'selected':'')+'>'+s+'</option>').join('')+'</select>'+
    '<button class="btn btn-outline no-print" onclick="APP.cambiarEstadoCotizacion(\''+id+'\')">Actualizar estado</button>';
  let genOrdenBtn = (c.estado==='Aprobada' && !yaOrden) ? '<button class="btn btn-success no-print" onclick="APP.generarOrdenDesdeCot(\''+id+'\')">'+ic('ordenes')+' Generar orden de trabajo</button>' : '';
  const foot = '<div class="modal-foot between no-print" style="display:flex;width:100%;">'+
      '<div style="display:flex;gap:8px;align-items:center;">'+estadoBtns+'</div>'+
      '<div style="display:flex;gap:8px;">'+genOrdenBtn+'<button class="btn btn-secondary" onclick="window.print()">'+ic('print')+' Imprimir</button><button class="btn btn-primary" onclick="closeModal()">Cerrar</button></div>'+
    '</div>';
  const overlay = openModal(modalShell('Cotización '+c.id, 'cotizaciones', body, ''), {size:'wide'});
  overlay.querySelector('.modal-box').insertAdjacentHTML('beforeend', foot);
};
APP.cambiarEstadoCotizacion = function(id){
  const nuevo = val('cotf-cambio-estado');
  const r = L.cambiarEstadoCotizacion(DB, id, nuevo, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  toast('Cotización '+id+' actualizada a "'+nuevo+'".','success','check');
  APP.verCotizacion(id);
  if(STATE.view==='cotizaciones') APP.renderCotizacionesTabla();
};
APP.generarOrdenDesdeCot = function(id){
  const r = L.crearOrdenDesdeCotizacion(DB, id, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  closeModal();
  toast('Orden '+r.orden.id+' generada. Ahora puede asignar técnico y programar fecha/hora.','success','check');
  APP.nav('ordenes');
  setTimeout(()=>APP.verOrden(r.orden.id), 200);
};

/* ============================================================
   VISTA: ÓRDENES DE TRABAJO
   ============================================================ */
const ESTADOS_ORD = L.ESTADOS_ORD;
const PRIORIDADES = L.PRIORIDADES;

VIEW_RENDERERS['ordenes'] = function(){
  window.__ordVista = window.__ordVista || 'lista';
  return '<div class="view-header"><div><h1 class="view-title">'+ic('ordenes')+'Órdenes de trabajo</h1><p class="view-sub">Programación y seguimiento de servicios en campo</p></div>'+
    '<div class="view-actions"><button class="btn btn-primary" onclick="APP.formOrden()">'+ic('plus')+' Nueva orden</button></div></div>'+
    '<div class="tabs"><button class="tab-btn '+(window.__ordVista==='lista'?'active':'')+'" onclick="APP.cambiarVistaOrdenes(\'lista\')">'+ic('ordenes')+' Listado</button><button class="tab-btn '+(window.__ordVista==='agenda'?'active':'')+'" onclick="APP.cambiarVistaOrdenes(\'agenda\')">'+ic('calendar')+' Agenda de técnicos</button></div>'+
    '<div id="ordenes-content"></div>';
};
window.__afterRender['ordenes'] = function(){ APP.renderOrdenesContent(); };
APP.cambiarVistaOrdenes = function(v){ window.__ordVista=v; APP.nav('ordenes'); };
APP.renderOrdenesContent = function(){
  const wrap = document.getElementById('ordenes-content');
  if(window.__ordVista==='agenda'){ wrap.innerHTML = renderAgendaTecnicos(); return; }
  wrap.innerHTML = '<div class="card"><div class="table-toolbar">'+
      '<div class="tt-search">'+ic('search')+'<input type="text" id="f-ord-q" placeholder="Buscar por número o cliente..." oninput="APP.renderOrdenesTabla()"></div>'+
      '<select id="f-ord-estado" onchange="APP.renderOrdenesTabla()"><option value="">Todos los estados</option>'+ESTADOS_ORD.map(s=>'<option>'+s+'</option>').join('')+'</select>'+
      '<select id="f-ord-tecnico" onchange="APP.renderOrdenesTabla()"><option value="">Todos los técnicos</option>'+DB.tecnicos.map(t=>'<option value="'+t.id+'">'+esc(t.nombre)+'</option>').join('')+'</select>'+
    '</div><div class="card-body pad-0" id="ordenes-tabla-wrap"></div></div>';
  APP.renderOrdenesTabla();
};
APP.renderOrdenesTabla = function(){
  const q=(document.getElementById('f-ord-q')?.value||'').toLowerCase();
  const est=document.getElementById('f-ord-estado')?.value||'';
  const tec=document.getElementById('f-ord-tecnico')?.value||'';
  let list = DB.ordenes.filter(o=>{
    const cl = cliente(o.clienteId);
    return (!q || o.id.toLowerCase().includes(q) || (cl&&cl.nombre.toLowerCase().includes(q))) && (!est||o.estado===est) && (!tec||o.tecnicoId===tec);
  }).slice().sort((a,b)=> (a.fecha+a.hora) < (b.fecha+b.hora) ? 1 : -1);
  const wrap = document.getElementById('ordenes-tabla-wrap');
  if(!list.length){ wrap.innerHTML = '<div class="empty-state">'+ic('empty')+'<div>No se encontraron órdenes.</div></div>'; return; }
  wrap.innerHTML = '<div class="table-scroll"><table class="tbl"><thead><tr><th>Orden</th><th>Cliente</th><th>Fecha / Hora</th><th>Técnico</th><th>Servicio</th><th>Prioridad</th><th>Estado</th><th></th></tr></thead><tbody>'+
    list.map(o=>'<tr><td class="cell-strong">'+o.id+'</td><td>'+esc(cliente(o.clienteId).nombre)+'</td><td>'+fmtDate(o.fecha)+' '+o.hora+'</td><td>'+esc(tecnico(o.tecnicoId).nombre)+'</td><td>'+esc(o.tipoServicio)+'</td><td>'+estadoBadge(o.prioridad)+'</td><td>'+estadoBadge(o.estado)+'</td>'+
    '<td><div class="cell-actions"><button class="icon-action" title="Ver" onclick="APP.verOrden(\''+o.id+'\')">'+ic('eye')+'</button><button class="icon-action" title="Editar" onclick="APP.formOrden(\''+o.id+'\')">'+ic('edit')+'</button></div></td></tr>').join('')+
    '</tbody></table></div>';
};
function renderAgendaTecnicos(){
  const fechas = [];
  for(let i=-1;i<=5;i++) fechas.push(addDays(todayStr(), i));
  let html = '<div class="card"><div class="card-head"><h3>'+ic('calendar')+' Agenda semanal por técnico</h3><p>'+fmtDate(fechas[0])+' — '+fmtDate(fechas[fechas.length-1])+'</p></div><div class="table-scroll"><table class="tbl"><thead><tr><th>Técnico</th>'+fechas.map(f=>'<th>'+fmtDate(f)+'</th>').join('')+'</tr></thead><tbody>';
  DB.tecnicos.forEach(t=>{
    html += '<tr><td class="cell-strong">'+esc(t.nombre)+'</td>';
    fechas.forEach(f=>{
      const ords = DB.ordenes.filter(o=>o.tecnicoId===t.id && o.fecha===f && o.estado!=='Cancelada');
      html += '<td>'+(ords.length? ords.map(o=>'<div style="margin-bottom:4px;"><span class="badge badge-'+ (ESTADO_KIND[o.estado]||'gris') +'" style="cursor:pointer;" onclick="APP.verOrden(\''+o.id+'\')">'+o.hora+' · '+o.id.replace('OT-2026-','#')+'</span></div>').join('') : '<span class="small-muted">—</span>')+'</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div></div><div class="note-box">'+ic('info')+'<div>Al programar una nueva orden, SIGEM valida automáticamente que el técnico seleccionado no tenga otra orden activa en la misma fecha y hora.</div></div>';
  return html;
}

APP.formOrden = function(id){
  const o = id ? orden(id) : null;
  const clienteOpts = DB.clientes.map(c=>'<option value="'+c.id+'" '+(o&&o.clienteId===c.id?'selected':'')+'>'+esc(c.nombre)+'</option>').join('');
  const body = '<div class="form-grid">'+
    '<div class="field"><label>Cliente</label><select id="of-cliente" onchange="APP.actualizarEquiposOrd()">'+clienteOpts+'</select></div>'+
    '<div class="field"><label>Equipo</label><select id="of-equipo"></select></div>'+
    '<div class="field"><label>Técnico asignado</label><select id="of-tecnico">'+DB.tecnicos.map(t=>'<option value="'+t.id+'" '+(o&&o.tecnicoId===t.id?'selected':'')+'>'+esc(t.nombre)+' ('+t.estado+')</option>').join('')+'</select></div>'+
    '<div class="field"><label>Tipo de servicio</label><input id="of-tiposervicio" value="'+esc(o?o.tipoServicio:'Mantenimiento preventivo')+'"></div>'+
    '<div class="field"><label>Fecha programada</label><input type="date" id="of-fecha" value="'+(o?o.fecha:todayStr())+'"></div>'+
    '<div class="field"><label>Hora</label><input type="time" id="of-hora" value="'+(o?o.hora:'08:00')+'"></div>'+
    '<div class="field"><label>Prioridad</label><select id="of-prioridad">'+PRIORIDADES.map(p=>'<option '+(o&&o.prioridad===p?'selected':'')+'>'+p+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Estado</label><select id="of-estado">'+ESTADOS_ORD.map(s=>'<option '+(o&&o.estado===s?'selected':'')+'>'+s+'</option>').join('')+'</select></div>'+
    '<div class="field full"><label>Descripción del problema</label><textarea id="of-descripcion" rows="3">'+esc(o?o.descripcion:'')+'</textarea></div>'+
  '</div><div id="of-conflicto"></div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="APP.guardarOrden(\''+(id||'')+'\')">'+ic('check')+' Guardar orden</button>';
  openModal(modalShell(o?'Editar orden '+o.id:'Nueva orden de trabajo', 'ordenes', body, foot), {size:'wide'});
  APP.actualizarEquiposOrd(o?o.equipoId:null);
  ['of-tecnico','of-fecha','of-hora'].forEach(fid=>document.getElementById(fid).addEventListener('change', ()=>APP.validarConflictoUI(id)));
  APP.validarConflictoUI(id);
};
APP.actualizarEquiposOrd = function(preselect){
  const clienteId = document.getElementById('of-cliente').value;
  const eqs = equiposDeCliente(clienteId);
  document.getElementById('of-equipo').innerHTML = '<option value="">— Sin equipo específico —</option>'+eqs.map(e=>'<option value="'+e.id+'" '+(preselect===e.id?'selected':'')+'>'+esc(e.tipo)+' — '+esc(e.marca)+' '+esc(e.modelo)+'</option>').join('');
};
APP.validarConflictoUI = function(excludeId){
  const tecnicoId = document.getElementById('of-tecnico').value;
  const fecha = document.getElementById('of-fecha').value;
  const hora = document.getElementById('of-hora').value;
  const conflicto = checkScheduleConflict(tecnicoId, fecha, hora, excludeId);
  const box = document.getElementById('of-conflicto');
  if(conflicto){
    box.innerHTML = '<div class="danger-box" style="margin-top:6px;">'+ic('alert')+'<div><b>Conflicto de agenda detectado:</b> '+esc(tecnico(tecnicoId).nombre)+' ya tiene asignada la orden '+conflicto.id+' el '+fmtDate(fecha)+' a las '+hora+' ('+esc(cliente(conflicto.clienteId).nombre)+'). Seleccione otro horario o técnico.</div></div>';
  } else {
    box.innerHTML = '<div class="note-box" style="margin-top:6px;">'+ic('check')+'<div>El técnico está disponible en ese horario. Sin conflictos detectados.</div></div>';
  }
};
APP.guardarOrden = function(id){
  const data = {clienteId:val('of-cliente'), equipoId:val('of-equipo')||null, tecnicoId:val('of-tecnico'), tipoServicio:val('of-tiposervicio'),
    fecha:val('of-fecha'), hora:val('of-hora'), prioridad:val('of-prioridad'), estado:val('of-estado'), descripcion:val('of-descripcion')};
  const r = id ? L.actualizarOrden(DB, id, data, STATE.user) : L.crearOrden(DB, data, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  toast(id ? 'Orden actualizada correctamente.' : 'Orden '+r.orden.id+' creada y asignada a '+tecnico(r.orden.tecnicoId).nombre+'.','success','check');
  closeModal();
  if(STATE.view==='ordenes') APP.renderOrdenesContent();
};

APP.verOrden = function(id){
  const o = orden(id); if(!o) return;
  if(!puedeVerOrden(o)){ toast('No tiene permisos para acceder a esta orden.','error','shield'); return; }
  const cl = cliente(o.clienteId); const eq = o.equipoId?equipo(o.equipoId):null; const tec = tecnico(o.tecnicoId);
  const fac = DB.facturas.find(f=>f.ordenId===id);
  const body = '<div class="two-col-sm">'+
      '<div class="stat-row"><span>Cliente</span><b>'+esc(cl.nombre)+'</b></div>'+
      '<div class="stat-row"><span>Estado</span>'+estadoBadge(o.estado)+'</div>'+
    '</div>'+
    '<div class="stat-row"><span>Equipo</span><b>'+(eq?esc(eq.tipo)+' — '+esc(eq.modelo):'No especificado')+'</b></div>'+
    '<div class="stat-row"><span>Técnico asignado</span><b>'+esc(tec.nombre)+'</b></div>'+
    '<div class="stat-row"><span>Fecha / Hora</span><b>'+fmtDate(o.fecha)+' — '+o.hora+'</b></div>'+
    '<div class="stat-row"><span>Prioridad</span>'+estadoBadge(o.prioridad)+'</div>'+
    '<div class="stat-row"><span>Tipo de servicio</span><b>'+esc(o.tipoServicio)+'</b></div>'+
    '<div class="stat-row"><span>Descripción del problema</span><b>'+esc(o.descripcion)+'</b></div>'+
    (o.cotizacionId? '<div class="stat-row"><span>Cotización origen</span><b>'+o.cotizacionId+'</b></div>' : '')+
    (o.estado==='Finalizada' ? ('<hr class="sep"><h4 style="margin:0 0 8px;font-size:13px;">Resumen de ejecución</h4>'+
      '<div class="stat-row"><span>Horario</span><b>'+(o.ejecucion.horaInicio||'—')+' a '+(o.ejecucion.horaFin||'—')+'</b></div>'+
      '<div class="stat-row"><span>Diagnóstico</span><b>'+esc(o.ejecucion.diagnostico||'—')+'</b></div>'+
      '<div class="stat-row"><span>Repuestos usados</span><b>'+((o.ejecucion.repuestos||[]).map(r=>producto(r.productoId).nombre+' x'+r.cantidad).join(', ')||'Ninguno')+'</b></div>'+
      (fac ? '<div class="stat-row"><span>Factura relacionada</span><b>'+fac.id+' — '+estadoBadge(fac.estado)+'</b></div>' : '')
    ) : '');
  const acciones = [];
  if(['Pendiente','Programada','En proceso','En espera'].includes(o.estado)) acciones.push('<button class="btn btn-outline" onclick="closeModal();APP.abrirEjecucion(\''+id+'\')">'+ic('panel')+' Abrir en panel técnico</button>');
  if(o.estado==='Finalizada') acciones.push('<button class="btn btn-outline" onclick="APP.verReporteTecnico(\''+id+'\')">'+ic('reportes')+' Ver reporte técnico</button>');
  if(o.estado==='Finalizada' && !fac && canAccess('facturacion')) acciones.push('<button class="btn btn-success" onclick="APP.generarFactura(\''+id+'\')">'+ic('facturacion')+' Generar factura</button>');
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button><button class="btn btn-outline" onclick="APP.formOrden(\''+id+'\')">'+ic('edit')+' Editar</button>'+acciones.join('');
  openModal(modalShell('Orden '+o.id, 'ordenes', body, foot), {size:'wide'});
};

/* ============================================================
   VISTA: PANEL DEL TÉCNICO
   ============================================================ */
VIEW_RENDERERS['panel-tecnico'] = function(){
  const tecId = u_tecId();
  const tec = tecnico(tecId);
  if(!tec) return '<div class="empty-state">'+ic('empty')+'<div>Su usuario no está vinculado a un técnico de campo. Contacte al administrador.</div></div>';
  const mine = ordenesDeTecnico(tecId);
  const hoy = mine.filter(o=>o.fecha===todayStr() && !['Cancelada'].includes(o.estado));
  const proximos = mine.filter(o=>o.fecha>todayStr() && !['Cancelada','Finalizada'].includes(o.estado)).sort((a,b)=>a.fecha<b.fecha?-1:1);
  const pendientes = mine.filter(o=>['Pendiente','En espera'].includes(o.estado));
  const historial = mine.filter(o=>['Finalizada','Cancelada'].includes(o.estado)).sort((a,b)=>a.fecha<b.fecha?1:-1);
  window.__panelTab = window.__panelTab || 'hoy';
  const tabs = [['hoy','Hoy ('+hoy.length+')'],['proximos','Próximos ('+proximos.length+')'],['pendientes','Pendientes ('+pendientes.length+')'],['historial','Historial ('+historial.length+')']];
  const activeList = {hoy, proximos, pendientes, historial}[window.__panelTab];
  return '<div class="view-header"><div><h1 class="view-title">'+ic('panel')+'Mi panel técnico</h1><p class="view-sub">'+esc(tec.nombre)+' · '+esc(tec.especialidad)+'</p></div></div>'+
    '<div class="kpi-grid">'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#2f80ed,#1a4d8c)">'+ic('calendar')+'</div><div class="kpi-val">'+hoy.length+'</div><div class="kpi-label">Órdenes de hoy</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#00b8d9,#0284c7)">'+ic('clock')+'</div><div class="kpi-val">'+proximos.length+'</div><div class="kpi-label">Próximos servicios</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#f59e0b,#b45309)">'+ic('wrench')+'</div><div class="kpi-val">'+pendientes.length+'</div><div class="kpi-label">Servicios pendientes</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#16a34a,#15803d)">'+ic('check')+'</div><div class="kpi-val">'+historial.filter(o=>o.estado==='Finalizada').length+'</div><div class="kpi-label">Servicios finalizados</div></div>'+
    '</div>'+
    '<div class="card"><div class="tabs" style="padding:0 18px;margin:0;border-bottom:1px solid var(--gris-100);">'+tabs.map(t=>'<button class="tab-btn '+(window.__panelTab===t[0]?'active':'')+'" onclick="APP.panelTecTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div><div class="card-body pad-0">'+
      (activeList.length ? '<div class="table-scroll"><table class="tbl"><thead><tr><th>Orden</th><th>Fecha / Hora</th><th>Cliente</th><th>Equipo</th><th>Servicio</th><th>Prioridad</th><th>Estado</th><th></th></tr></thead><tbody>'+
        activeList.map(o=>'<tr><td class="cell-strong">'+o.id+'</td><td>'+fmtDate(o.fecha)+' '+o.hora+'</td><td>'+esc(cliente(o.clienteId).nombre)+'</td><td>'+(o.equipoId?esc(equipo(o.equipoId).tipo):'—')+'</td><td>'+esc(o.tipoServicio)+'</td><td>'+estadoBadge(o.prioridad)+'</td><td>'+estadoBadge(o.estado)+'</td>'+
        '<td><button class="btn btn-sm '+(o.estado==='Finalizada'?'btn-outline':'btn-primary')+'" onclick="'+(o.estado==='Finalizada'?'APP.verReporteTecnico':'APP.abrirEjecucion')+'(\''+o.id+'\')">'+(o.estado==='Finalizada'?'Ver reporte':'Ejecutar')+'</button></td></tr>').join('')+
        '</tbody></table></div>'
      : '<div class="empty-state">'+ic('empty')+'<div>No hay órdenes en esta categoría.</div></div>')+
    '</div></div>';
};
APP.panelTecTab = function(t){ window.__panelTab=t; APP.nav('panel-tecnico'); };

/* --------- Ejecución de servicio (registro técnico) --------- */
APP.abrirEjecucion = function(ordenId){
  const o = orden(ordenId); if(!o) return;
  if(!puedeVerOrden(o)){ toast('No tiene permisos para acceder a esta orden.','error','shield'); return; }
  window.__ejecRepuestos = (o.ejecucion.repuestos||[]).map(r=>Object.assign({},r));
  window.__ejecFotos = o.ejecucion.fotos || 0;
  window.__ejecFirmaTec = o.ejecucion.firmaTecnico || false;
  window.__ejecFirmaCli = o.ejecucion.firmaCliente || false;
  const cl = cliente(o.clienteId); const eq = o.equipoId?equipo(o.equipoId):null;
  const body =
    '<div class="note-box" style="margin-bottom:14px;">'+ic('info')+'<div><b>'+esc(cl.nombre)+'</b> — '+(eq?esc(eq.tipo)+' '+esc(eq.modelo)+' (Serie '+esc(eq.serie)+')':'Sin equipo específico')+'<br>'+esc(o.descripcion)+'</div></div>'+
    '<div class="form-grid">'+
      '<div class="field"><label>Hora de inicio</label><input type="time" id="ex-inicio" value="'+(o.ejecucion.horaInicio||new Date().toTimeString().slice(0,5))+'"></div>'+
      '<div class="field"><label>Hora de finalización</label><input type="time" id="ex-fin" value="'+(o.ejecucion.horaFin||'')+'"></div>'+
      '<div class="field full"><label>Diagnóstico</label><textarea id="ex-diagnostico" rows="2" placeholder="Describa la causa raíz del problema...">'+esc(o.ejecucion.diagnostico)+'</textarea></div>'+
      '<div class="field full"><label>Trabajo realizado</label><textarea id="ex-trabajo" rows="2" placeholder="Detalle las acciones ejecutadas...">'+esc(o.ejecucion.trabajo)+'</textarea></div>'+
      '<div class="field full"><label>Mediciones (corriente, voltaje, vibración, temperatura...)</label><input id="ex-mediciones" value="'+esc(o.ejecucion.mediciones)+'"></div>'+
      '<div class="field full"><label>Observaciones</label><textarea id="ex-observaciones" rows="2">'+esc(o.ejecucion.observaciones)+'</textarea></div>'+
      '<div class="field full"><label>Recomendaciones</label><textarea id="ex-recomendaciones" rows="2">'+esc(o.ejecucion.recomendaciones)+'</textarea></div>'+
    '</div><hr class="sep">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><h4 style="margin:0;font-size:13px;">Repuestos utilizados</h4><button class="btn btn-sm btn-outline" onclick="APP.agregarRepuestoEjec()">'+ic('plus')+' Agregar repuesto</button></div>'+
    '<div id="ejec-repuestos-wrap"></div>'+
    '<hr class="sep"><h4 style="margin:0 0 8px;font-size:13px;">Fotografías (simuladas)</h4>'+
    '<div class="photo-grid" id="ejec-fotos-wrap"></div>'+
    '<hr class="sep"><div class="two-col-sm">'+
      '<div><h4 style="margin:0 0 8px;font-size:13px;">Firma del técnico</h4><div class="signature-box'+(window.__ejecFirmaTec?' signed':'')+'" onclick="APP.firmar(\'tec\')" id="firma-tec-box">'+(window.__ejecFirmaTec? ic('check')+' Firmado por '+esc(tecnico(o.tecnicoId).nombre) : ic('sign')+' Toque para firmar')+'</div></div>'+
      '<div><h4 style="margin:0 0 8px;font-size:13px;">Firma del cliente</h4><div class="signature-box'+(window.__ejecFirmaCli?' signed':'')+'" onclick="APP.firmar(\'cli\')" id="firma-cli-box">'+(window.__ejecFirmaCli? ic('check')+' Firmado por '+esc(cl.nombre) : ic('sign')+' Toque para firmar') +'</div></div>'+
    '</div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Guardar y cerrar</button>'+(o.estado!=='Finalizada' ? '<button class="btn btn-success" onclick="APP.finalizarServicio(\''+ordenId+'\')">'+ic('check')+' Finalizar servicio</button>' : '');
  openModal(modalShell('Ejecutar orden '+o.id, 'panel', body, foot), {size:'xwide'});
  APP.renderRepuestosEjec();
  APP.renderFotosEjec();
};
APP.agregarRepuestoEjec = function(){ window.__ejecRepuestos.push({productoId:DB.productos[0].id, cantidad:1}); APP.renderRepuestosEjec(); };
APP.quitarRepuestoEjec = function(idx){ window.__ejecRepuestos.splice(idx,1); APP.renderRepuestosEjec(); };
APP.actualizarRepuestoEjec = function(idx, field, val){ window.__ejecRepuestos[idx][field] = field==='cantidad' ? Math.max(1,+val||1) : val; APP.renderRepuestosEjec(); };
APP.renderRepuestosEjec = function(){
  const wrap = document.getElementById('ejec-repuestos-wrap'); if(!wrap) return;
  if(!window.__ejecRepuestos.length){ wrap.innerHTML = '<p class="small-muted">No se han registrado repuestos para este servicio.</p>'; return; }
  wrap.innerHTML = '<table class="line-items"><thead><tr><th style="width:50%">Producto</th><th>Cantidad</th><th>Existencia disp.</th><th></th></tr></thead><tbody>'+
    window.__ejecRepuestos.map((r,idx)=>{
      const p = producto(r.productoId);
      const insuf = p && r.cantidad > p.existencia;
      return '<tr><td><select onchange="APP.actualizarRepuestoEjec('+idx+',\'productoId\',this.value)">'+DB.productos.map(pp=>'<option value="'+pp.id+'" '+(r.productoId===pp.id?'selected':'')+'>'+esc(pp.nombre)+'</option>').join('')+'</select></td>'+
      '<td><input type="number" min="1" value="'+r.cantidad+'" onchange="APP.actualizarRepuestoEjec('+idx+',\'cantidad\',this.value)"></td>'+
      '<td>'+(p?p.existencia:'—')+(insuf?' <span class="badge badge-rojo">Insuficiente</span>':'')+'</td>'+
      '<td><button class="icon-action" onclick="APP.quitarRepuestoEjec('+idx+')">'+ic('trash')+'</button></td></tr>';
    }).join('')+'</tbody></table>';
};
APP.renderFotosEjec = function(){
  const wrap = document.getElementById('ejec-fotos-wrap'); if(!wrap) return;
  let html = '';
  for(let i=0;i<window.__ejecFotos;i++) html += '<div class="photo-slot">'+ic('camera')+'<span>Foto '+(i+1)+'</span></div>';
  html += '<div class="photo-slot add" onclick="APP.tomarFotoSimulada()">'+ic('plus')+'<span>Agregar</span></div>';
  wrap.innerHTML = html;
};
APP.tomarFotoSimulada = function(){ window.__ejecFotos++; APP.renderFotosEjec(); toast('Fotografía simulada capturada.','info','camera'); };
APP.firmar = function(who){
  if(who==='tec'){ window.__ejecFirmaTec = true; document.getElementById('firma-tec-box').className='signature-box signed'; document.getElementById('firma-tec-box').innerHTML = ic('check')+' Firma registrada'; }
  else { window.__ejecFirmaCli = true; document.getElementById('firma-cli-box').className='signature-box signed'; document.getElementById('firma-cli-box').innerHTML = ic('check')+' Firma registrada'; }
  toast('Firma capturada correctamente.','success','check');
};
APP.finalizarServicio = function(ordenId){
  const ejecucionData = {
    horaInicio:val('ex-inicio'), horaFin:val('ex-fin'),
    diagnostico:val('ex-diagnostico').trim(), trabajo:val('ex-trabajo').trim(),
    mediciones:val('ex-mediciones').trim(), observaciones:val('ex-observaciones').trim(),
    recomendaciones:val('ex-recomendaciones').trim(), repuestos:window.__ejecRepuestos.slice(),
    fotos:window.__ejecFotos, firmaTecnico:window.__ejecFirmaTec, firmaCliente:window.__ejecFirmaCli,
  };
  const r = L.finalizarOrden(DB, ordenId, ejecucionData, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  closeModal();
  renderSidebarNav(); renderNotifs();
  toast('Servicio finalizado. Orden '+ordenId+' actualizada e inventario descontado automáticamente.','success','check');
  if(STATE.view==='panel-tecnico') APP.nav('panel-tecnico');
  if(STATE.view==='ordenes') APP.renderOrdenesContent();
  setTimeout(()=>APP.verReporteTecnico(ordenId), 250);
};

/* --------- Reporte técnico imprimible --------- */
APP.verReporteTecnico = function(ordenId){
  const o = orden(ordenId); if(!o) return;
  if(!puedeVerOrden(o)){ toast('No tiene permisos para acceder a esta orden.','error','shield'); return; }
  const cl = cliente(o.clienteId); const eq = o.equipoId?equipo(o.equipoId):null; const tec = tecnico(o.tecnicoId);
  const ex = o.ejecucion;
  const repuestosHtml = (ex.repuestos||[]).length ? '<table class="line-items"><thead><tr><th>Repuesto</th><th>Cantidad</th></tr></thead><tbody>'+
    ex.repuestos.map(r=>'<tr><td>'+esc(producto(r.productoId).nombre)+'</td><td>'+r.cantidad+'</td></tr>').join('')+'</tbody></table>' : '<p class="small-muted">No se utilizaron repuestos en este servicio.</p>';
  const body = '<div class="print-only" style="margin-bottom:10px;"><h2 style="margin:0;">SIGEM · Reporte técnico</h2><p class="small-muted">Sistema Integral de Gestión Electromecánica</p></div>'+
    '<div class="two-col-sm">'+
      '<div class="stat-row"><span>Orden</span><b>'+o.id+'</b></div>'+
      '<div class="stat-row"><span>Fecha</span><b>'+fmtDate(o.fecha)+'</b></div>'+
    '</div>'+
    '<div class="stat-row"><span>Cliente</span><b>'+esc(cl.nombre)+'</b></div>'+
    '<div class="stat-row"><span>Equipo</span><b>'+(eq?esc(eq.tipo)+' — '+esc(eq.marca)+' '+esc(eq.modelo)+' (Serie '+esc(eq.serie)+')':'No especificado')+'</b></div>'+
    '<div class="stat-row"><span>Técnico</span><b>'+esc(tec.nombre)+'</b></div>'+
    '<div class="stat-row"><span>Horario</span><b>'+(ex.horaInicio||'—')+' a '+(ex.horaFin||'—')+'</b></div>'+
    '<hr class="sep">'+
    '<p><b>Problema reportado:</b><br>'+esc(o.descripcion)+'</p>'+
    '<p><b>Diagnóstico:</b><br>'+esc(ex.diagnostico||'—')+'</p>'+
    '<p><b>Trabajo realizado:</b><br>'+esc(ex.trabajo||'—')+'</p>'+
    '<p><b>Mediciones:</b><br>'+esc(ex.mediciones||'—')+'</p>'+
    '<p><b>Repuestos utilizados:</b></p>'+repuestosHtml+
    '<p><b>Recomendaciones:</b><br>'+esc(ex.recomendaciones||'—')+'</p>'+
    '<p><b>Fotografías adjuntas:</b> '+(ex.fotos||0)+' imagen(es)</p>'+
    '<div class="two-col-sm" style="margin-top:14px;">'+
      '<div><span class="small-muted">Firma del técnico</span><div class="signature-box'+(ex.firmaTecnico?' signed':'')+'">'+(ex.firmaTecnico?ic('check')+' '+esc(tec.nombre):'Sin firma')+'</div></div>'+
      '<div><span class="small-muted">Firma del cliente</span><div class="signature-box'+(ex.firmaCliente?' signed':'')+'">'+(ex.firmaCliente?ic('check')+' '+esc(cl.nombre):'Sin firma')+'</div></div>'+
    '</div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button><button class="btn btn-outline" onclick="window.print()">'+ic('print')+' Imprimir / Descargar PDF</button>';
  openModal(modalShell('Reporte técnico — '+o.id, 'reportes', body, foot), {size:'wide'});
};

/* ============================================================
   VISTA: INVENTARIO
   ============================================================ */
VIEW_RENDERERS['inventario'] = function(){
  const cats = [...new Set(DB.productos.map(p=>p.categoria))];
  const bajos = DB.productos.filter(p=>p.existencia<=p.stockMin).length;
  const valorTotal = DB.productos.reduce((s,p)=>s+p.existencia*p.costo,0);
  return '<div class="view-header"><div><h1 class="view-title">'+ic('inventario')+'Inventario</h1><p class="view-sub">Repuestos, materiales y componentes electromecánicos</p></div>'+
    '<div class="view-actions"><button class="btn btn-primary" onclick="APP.formProducto()">'+ic('plus')+' Nuevo producto</button></div></div>'+
    '<div class="kpi-grid">'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#2f80ed,#1a4d8c)">'+ic('box')+'</div><div class="kpi-val">'+DB.productos.length+'</div><div class="kpi-label">Productos registrados</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#dc2626,#991b1b)">'+ic('alert')+'</div><div class="kpi-val">'+bajos+'</div><div class="kpi-label">Con stock bajo</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#16a34a,#15803d)">'+ic('money')+'</div><div class="kpi-val">'+fmtQ(valorTotal)+'</div><div class="kpi-label">Valor total en costo</div></div>'+
    '</div>'+
    (bajos ? '<div class="warn-box" style="margin-bottom:16px;">'+ic('alert')+'<div><b>'+bajos+' producto(s) por debajo del stock mínimo.</b> Se recomienda generar orden de compra con los proveedores registrados.</div></div>' : '')+
    '<div class="card"><div class="table-toolbar">'+
      '<div class="tt-search">'+ic('search')+'<input type="text" id="f-inv-q" placeholder="Buscar producto..." oninput="APP.renderInventarioTabla()"></div>'+
      '<select id="f-inv-cat" onchange="APP.renderInventarioTabla()"><option value="">Todas las categorías</option>'+cats.map(c=>'<option>'+c+'</option>').join('')+'</select>'+
      '<select id="f-inv-estado" onchange="APP.renderInventarioTabla()"><option value="">Todos</option><option>Stock bajo</option><option>Stock normal</option></select>'+
    '</div><div class="card-body pad-0" id="inventario-tabla-wrap"></div></div>';
};
window.__afterRender['inventario'] = function(){ APP.renderInventarioTabla(); };
APP.renderInventarioTabla = function(){
  const q=(document.getElementById('f-inv-q')?.value||'').toLowerCase();
  const cat=document.getElementById('f-inv-cat')?.value||'';
  const est=document.getElementById('f-inv-estado')?.value||'';
  let list = DB.productos.filter(p=>{
    const bajo = p.existencia<=p.stockMin;
    return (!q||p.nombre.toLowerCase().includes(q)) && (!cat||p.categoria===cat) &&
      (!est || (est==='Stock bajo'?bajo:!bajo));
  });
  const wrap = document.getElementById('inventario-tabla-wrap');
  if(!list.length){ wrap.innerHTML = '<div class="empty-state">'+ic('empty')+'<div>No se encontraron productos.</div></div>'; return; }
  wrap.innerHTML = '<div class="table-scroll"><table class="tbl"><thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Existencia</th><th>Mínimo</th><th>Costo</th><th>P. venta</th><th>Proveedor</th><th>Estado</th><th></th></tr></thead><tbody>'+
    list.map(p=>{ const bajo = p.existencia<=p.stockMin; return '<tr'+(bajo?' style="background:#fef2f2;"':'')+'><td>'+p.id+'</td><td class="cell-strong">'+esc(p.nombre)+'</td><td>'+esc(p.categoria)+'</td><td'+(bajo?' style="color:var(--rojo);font-weight:700;"':'')+'>'+p.existencia+'</td><td>'+p.stockMin+'</td><td>'+fmtQ(p.costo)+'</td><td>'+fmtQ(p.precio)+'</td><td>'+esc(p.proveedor)+'</td><td>'+estadoBadge(bajo?'Stock bajo':'Stock normal')+'</td>'+
      '<td><button class="icon-action" title="Editar" onclick="APP.formProducto(\''+p.id+'\')">'+ic('edit')+'</button></td></tr>'; }).join('')+
    '</tbody></table></div>';
};
APP.formProducto = function(id){
  const p = id ? producto(id) : null;
  const cats = ['Rodamientos','Contactores','Guardamotores','Breakers','Cable eléctrico','Sellos mecánicos','Impulsores','Capacitores','Variadores de frecuencia','Otros'];
  const body = '<div class="form-grid">'+
    '<div class="field full"><label>Nombre del producto</label><input id="pf-nombre" value="'+esc(p?p.nombre:'')+'"></div>'+
    '<div class="field"><label>Categoría</label><select id="pf-categoria">'+cats.map(c=>'<option '+(p&&p.categoria===c?'selected':'')+'>'+c+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Proveedor</label><input id="pf-proveedor" value="'+esc(p?p.proveedor:'')+'"></div>'+
    '<div class="field"><label>Existencia actual</label><input type="number" id="pf-existencia" value="'+(p?p.existencia:0)+'"></div>'+
    '<div class="field"><label>Stock mínimo</label><input type="number" id="pf-stockmin" value="'+(p?p.stockMin:5)+'"></div>'+
    '<div class="field"><label>Costo (Q)</label><input type="number" step="0.01" id="pf-costo" value="'+(p?p.costo:0)+'"></div>'+
    '<div class="field"><label>Precio de venta (Q)</label><input type="number" step="0.01" id="pf-precio" value="'+(p?p.precio:0)+'"></div>'+
  '</div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="APP.guardarProducto(\''+(id||'')+'\')">'+ic('check')+' Guardar producto</button>';
  openModal(modalShell(p?'Editar producto':'Nuevo producto', 'inventario', body, foot));
};
APP.guardarProducto = function(id){
  const data = {nombre:val('pf-nombre'), categoria:val('pf-categoria'), proveedor:val('pf-proveedor'), existencia:val('pf-existencia'),
    stockMin:val('pf-stockmin'), costo:val('pf-costo'), precio:val('pf-precio')};
  const r = L.guardarProducto(DB, id, data);
  if(!r.ok){ errorToast(r); return; }
  toast(id ? 'Producto actualizado.' : 'Producto '+r.producto.id+' agregado al inventario.','success','check');
  closeModal();
  if(STATE.view==='inventario') APP.nav('inventario');
  renderSidebarNav(); renderNotifs();
};

/* ============================================================
   VISTA: FACTURACIÓN
   ============================================================ */
const ESTADOS_FAC = L.ESTADOS_FAC;

VIEW_RENDERERS['facturacion'] = function(){
  const finalizadasSinFactura = DB.ordenes.filter(o=>o.estado==='Finalizada' && !DB.facturas.some(f=>f.ordenId===o.id));
  return '<div class="view-header"><div><h1 class="view-title">'+ic('facturacion')+'Facturación</h1><p class="view-sub">Facturación simulada — sin conexión a sistemas fiscales reales</p></div></div>'+
    (finalizadasSinFactura.length ? '<div class="note-box" style="margin-bottom:16px;">'+ic('info')+'<div><b>'+finalizadasSinFactura.length+' orden(es) finalizada(s)</b> aún no tienen factura generada. '+
      finalizadasSinFactura.map(o=>'<button class="btn btn-sm btn-outline" style="margin:6px 6px 0 0;" onclick="APP.generarFactura(\''+o.id+'\')">Generar factura de '+o.id+'</button>').join('')+'</div></div>' : '')+
    '<div class="card"><div class="table-toolbar">'+
      '<div class="tt-search">'+ic('search')+'<input type="text" id="f-fac-q" placeholder="Buscar por número o cliente..." oninput="APP.renderFacturasTabla()"></div>'+
      '<select id="f-fac-estado" onchange="APP.renderFacturasTabla()"><option value="">Todos los estados</option>'+ESTADOS_FAC.map(s=>'<option>'+s+'</option>').join('')+'</select>'+
    '</div><div class="card-body pad-0" id="facturas-tabla-wrap"></div></div>';
};
window.__afterRender['facturacion'] = function(){ APP.renderFacturasTabla(); };
APP.renderFacturasTabla = function(){
  const q=(document.getElementById('f-fac-q')?.value||'').toLowerCase();
  const est=document.getElementById('f-fac-estado')?.value||'';
  let list = DB.facturas.filter(f=>{ const cl=cliente(f.clienteId); return (!q||f.id.toLowerCase().includes(q)||(cl&&cl.nombre.toLowerCase().includes(q))) && (!est||f.estado===est); }).slice().reverse();
  const wrap = document.getElementById('facturas-tabla-wrap');
  if(!list.length){ wrap.innerHTML = '<div class="empty-state">'+ic('empty')+'<div>No se encontraron facturas.</div></div>'; return; }
  wrap.innerHTML = '<div class="table-scroll"><table class="tbl"><thead><tr><th>Número</th><th>Cliente</th><th>Fecha</th><th>Orden</th><th>Total</th><th>Saldo</th><th>Estado</th><th></th></tr></thead><tbody>'+
    list.map(f=>'<tr><td class="cell-strong">'+f.id+'</td><td>'+esc(cliente(f.clienteId).nombre)+'</td><td>'+fmtDate(f.fecha)+'</td><td>'+(f.ordenId||'—')+'</td><td class="cell-strong">'+fmtQ(f.total)+'</td><td>'+fmtQ(saldoFactura(f))+'</td><td>'+estadoBadge(f.estado)+'</td>'+
    '<td><button class="icon-action" title="Ver" onclick="APP.verFactura(\''+f.id+'\')">'+ic('eye')+'</button></td></tr>').join('')+
    '</tbody></table></div>';
};
APP.generarFactura = function(ordenId){
  const r = L.generarFacturaDesdeOrden(DB, ordenId, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  closeModal();
  toast('Factura '+r.factura.id+' generada por '+fmtQ(r.factura.total)+'.','success','check');
  APP.nav('facturacion');
  setTimeout(()=>APP.verFactura(r.factura.id), 200);
};
APP.verFactura = function(id){
  const f = factura(id); if(!f) return;
  const cl = cliente(f.clienteId);
  const pagos = pagosDeFactura(id);
  const saldo = saldoFactura(f);
  const body = '<div class="print-only" style="margin-bottom:10px;"><h2 style="margin:0;">SIGEM · Factura '+f.id+'</h2><p class="small-muted">Documento simulado — sin validez fiscal</p></div>'+
    '<div class="two-col-sm">'+
      '<div class="stat-row"><span>Cliente</span><b>'+esc(cl.nombre)+'</b></div>'+
      '<div class="stat-row"><span>Estado</span>'+estadoBadge(f.estado)+'</div>'+
    '</div>'+
    '<div class="stat-row"><span>NIT</span><b>'+esc(cl.nit)+'</b></div>'+
    '<div class="stat-row"><span>Fecha</span><b>'+fmtDate(f.fecha)+'</b></div>'+
    '<div class="stat-row"><span>Orden relacionada</span><b>'+(f.ordenId||'N/A')+'</b></div>'+
    '<div class="total-box">'+
      '<div class="total-line"><span>Subtotal</span><b>'+fmtQ(f.subtotal)+'</b></div>'+
      '<div class="total-line"><span>Impuesto (IVA)</span><b>'+fmtQ(f.impuesto)+'</b></div>'+
      '<div class="total-line grand"><span>Total</span><span>'+fmtQ(f.total)+'</span></div>'+
      '<div class="total-line"><span>Pagado</span><b>'+fmtQ(totalPagadoFactura(f))+'</b></div>'+
      '<div class="total-line"><span>Saldo pendiente</span><b style="color:'+(saldo>0?'var(--rojo)':'var(--verde)')+'">'+fmtQ(saldo)+'</b></div>'+
    '</div>'+
    '<hr class="sep"><h4 style="margin:0 0 8px;font-size:13px;">Pagos aplicados</h4>'+
    (pagos.length? '<table class="line-items"><thead><tr><th>Pago</th><th>Fecha</th><th>Método</th><th>Monto</th></tr></thead><tbody>'+pagos.map(p=>'<tr><td>'+p.id+'</td><td>'+fmtDate(p.fecha)+'</td><td>'+esc(p.metodo)+'</td><td>'+fmtQ(p.monto)+'</td></tr>').join('')+'</tbody></table>' : '<p class="small-muted">Sin pagos registrados.</p>');
  let cambiarEstado = '<select id="facf-estado" class="no-print">'+ESTADOS_FAC.map(s=>'<option '+(f.estado===s?'selected':'')+'>'+s+'</option>').join('')+'</select><button class="btn btn-outline no-print" onclick="APP.cambiarEstadoFactura(\''+id+'\')">Actualizar</button>';
  const foot = '<div style="display:flex;gap:8px;align-items:center;margin-right:auto;">'+cambiarEstado+'</div>'+
    (saldo>0.009 && f.estado!=='Anulada' ? '<button class="btn btn-success" onclick="closeModal();APP.formPago(\''+id+'\')">'+ic('pagos')+' Registrar pago</button>' : '')+
    '<button class="btn btn-secondary" onclick="window.print()">'+ic('print')+' Imprimir</button><button class="btn btn-primary" onclick="closeModal()">Cerrar</button>';
  openModal(modalShell('Factura '+f.id, 'facturacion', body, foot), {size:'wide'});
};
APP.cambiarEstadoFactura = function(id){
  const r = L.cambiarEstadoFactura(DB, id, val('facf-estado'), STATE.user);
  if(!r.ok){ errorToast(r); return; }
  toast('Factura '+id+' actualizada a "'+r.factura.estado+'".','success','check');
  APP.verFactura(id);
  if(STATE.view==='facturacion') APP.renderFacturasTabla();
};

/* ============================================================
   VISTA: PAGOS Y CUENTAS POR COBRAR
   ============================================================ */
VIEW_RENDERERS['pagos'] = function(){
  const totalCxC = DB.facturas.reduce((s,f)=>s+saldoFactura(f),0);
  const vencidas = DB.facturas.filter(f=>f.estado==='Vencida');
  const porVencer = DB.facturas.filter(f=>f.estado!=='Pagada' && f.estado!=='Anulada' && f.estado!=='Vencida');
  return '<div class="view-header"><div><h1 class="view-title">'+ic('pagos')+'Pagos y cuentas por cobrar</h1><p class="view-sub">Control de cobros, pagos parciales y totales</p></div></div>'+
    '<div class="kpi-grid">'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#dc2626,#991b1b)">'+ic('money')+'</div><div class="kpi-val">'+fmtQ(totalCxC)+'</div><div class="kpi-label">Total por cobrar</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#b45309,#92400e)">'+ic('alert')+'</div><div class="kpi-val">'+vencidas.length+'</div><div class="kpi-label">Facturas vencidas</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#2f80ed,#1a4d8c)">'+ic('clock')+'</div><div class="kpi-val">'+porVencer.length+'</div><div class="kpi-label">Próximas a vencer / pendientes</div></div>'+
    '</div>'+
    '<div class="grid-2">'+
      '<div class="card"><div class="card-head"><h3>'+ic('facturacion')+' Facturas con saldo pendiente</h3></div><div class="card-body pad-0" id="pagos-facturas-wrap"></div></div>'+
      '<div class="card"><div class="card-head"><h3>'+ic('pagos')+' Pagos recientes</h3></div><div class="card-body pad-0" id="pagos-historial-wrap"></div></div>'+
    '</div>';
};
window.__afterRender['pagos'] = function(){
  const pendientes = DB.facturas.filter(f=>saldoFactura(f)>0.009).slice().sort((a,b)=>a.fecha<b.fecha?1:-1);
  document.getElementById('pagos-facturas-wrap').innerHTML = pendientes.length ? '<div class="table-scroll"><table class="tbl"><thead><tr><th>Factura</th><th>Cliente</th><th>Total</th><th>Saldo</th><th>Estado</th><th></th></tr></thead><tbody>'+
    pendientes.map(f=>'<tr><td class="cell-strong">'+f.id+'</td><td>'+esc(cliente(f.clienteId).nombre)+'</td><td>'+fmtQ(f.total)+'</td><td style="color:var(--rojo);font-weight:700;">'+fmtQ(saldoFactura(f))+'</td><td>'+estadoBadge(f.estado)+'</td><td><button class="btn btn-sm btn-success" onclick="APP.formPago(\''+f.id+'\')">Registrar pago</button></td></tr>').join('')+'</tbody></table></div>' : '<div class="empty-state">'+ic('check')+'<div>No hay saldos pendientes por cobrar.</div></div>';
  const historial = DB.pagos.slice().reverse();
  document.getElementById('pagos-historial-wrap').innerHTML = '<div class="table-scroll"><table class="tbl"><thead><tr><th>Pago</th><th>Factura</th><th>Cliente</th><th>Fecha</th><th>Método</th><th>Monto</th></tr></thead><tbody>'+
    historial.map(p=>'<tr><td>'+p.id+'</td><td>'+p.facturaId+'</td><td>'+esc(cliente(p.clienteId).nombre)+'</td><td>'+fmtDate(p.fecha)+'</td><td>'+esc(p.metodo)+'</td><td class="cell-strong">'+fmtQ(p.monto)+'</td></tr>').join('')+'</tbody></table></div>';
};
APP.formPago = function(facturaId){
  const f = factura(facturaId);
  const saldo = saldoFactura(f);
  const body = '<div class="note-box" style="margin-bottom:14px;">'+ic('info')+'<div>Factura <b>'+f.id+'</b> — Cliente: '+esc(cliente(f.clienteId).nombre)+'<br>Total: '+fmtQ(f.total)+' · Saldo pendiente: <b>'+fmtQ(saldo)+'</b></div></div>'+
    '<div class="form-grid">'+
      '<div class="field"><label>Tipo de pago</label><select id="pgf-tipo" onchange="document.getElementById(\'pgf-monto\').value = this.value===\'total\'?'+saldo+':\'\'">'+
        '<option value="total">Pago total</option><option value="parcial">Pago parcial</option></select></div>'+
      '<div class="field"><label>Monto a pagar (Q)</label><input type="number" step="0.01" id="pgf-monto" value="'+saldo+'"></div>'+
      '<div class="field"><label>Método de pago</label><select id="pgf-metodo"><option>Transferencia</option><option>Efectivo</option><option>Cheque</option><option>Tarjeta</option></select></div>'+
      '<div class="field"><label>Fecha</label><input type="date" id="pgf-fecha" value="'+todayStr()+'"></div>'+
    '</div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="APP.confirmarPago(\''+facturaId+'\')">'+ic('check')+' Registrar pago</button>';
  openModal(modalShell('Registrar pago', 'pagos', body, foot));
};
APP.confirmarPago = function(facturaId){
  const r = L.registrarPago(DB, facturaId, +val('pgf-monto'), val('pgf-metodo'), val('pgf-fecha'), STATE.user);
  if(!r.ok){ errorToast(r); return; }
  closeModal();
  toast('Pago '+r.pago.id+' registrado por '+fmtQ(r.pago.monto)+'. Factura en estado "'+r.factura.estado+'".','success','check');
  renderSidebarNav();
  if(STATE.view==='pagos') APP.nav('pagos');
  if(STATE.view==='facturacion') APP.renderFacturasTabla();
};

/* ============================================================
   VISTA: GASTOS
   ============================================================ */
const CATS_GASTO = L.CATS_GASTO;
VIEW_RENDERERS['gastos'] = function(){
  const totalMes = DB.gastos.filter(g=>enUltimos30(g.fecha)).reduce((s,g)=>s+g.monto*(1+(g.impuestoPct||0)/100),0);
  return '<div class="view-header"><div><h1 class="view-title">'+ic('gastos')+'Gastos</h1><p class="view-sub">Registro de egresos operativos y administrativos</p></div>'+
    '<div class="view-actions"><button class="btn btn-primary" onclick="APP.formGasto()">'+ic('plus')+' Nuevo gasto</button></div></div>'+
    '<div class="kpi-grid"><div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#64748b,#334155)">'+ic('gastos')+'</div><div class="kpi-val">'+fmtQ(totalMes)+'</div><div class="kpi-label">Gastos de los últimos 30 días</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#f59e0b,#b45309)">'+ic('reportes')+'</div><div class="kpi-val">'+DB.gastos.length+'</div><div class="kpi-label">Registros totales</div></div></div>'+
    '<div class="card"><div class="table-toolbar">'+
      '<div class="tt-search">'+ic('search')+'<input type="text" id="f-gas-q" placeholder="Buscar por descripción o proveedor..." oninput="APP.renderGastosTabla()"></div>'+
      '<select id="f-gas-cat" onchange="APP.renderGastosTabla()"><option value="">Todas las categorías</option>'+CATS_GASTO.map(c=>'<option>'+c+'</option>').join('')+'</select>'+
    '</div><div class="card-body pad-0" id="gastos-tabla-wrap"></div></div>';
};
window.__afterRender['gastos'] = function(){ APP.renderGastosTabla(); };
APP.renderGastosTabla = function(){
  const q=(document.getElementById('f-gas-q')?.value||'').toLowerCase();
  const cat=document.getElementById('f-gas-cat')?.value||'';
  let list = DB.gastos.filter(g=>(!q||g.descripcion.toLowerCase().includes(q)||g.proveedor.toLowerCase().includes(q))&&(!cat||g.categoria===cat)).slice().reverse();
  const wrap = document.getElementById('gastos-tabla-wrap');
  if(!list.length){ wrap.innerHTML='<div class="empty-state">'+ic('empty')+'<div>Sin gastos registrados.</div></div>'; return; }
  wrap.innerHTML = '<div class="table-scroll"><table class="tbl"><thead><tr><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Proveedor</th><th>Monto</th><th>Impuesto</th><th>Total</th></tr></thead><tbody>'+
    list.map(g=>{ const imp=g.monto*(g.impuestoPct||0)/100; return '<tr><td>'+fmtDate(g.fecha)+'</td><td>'+badge(g.categoria,'azul')+'</td><td>'+esc(g.descripcion)+'</td><td>'+esc(g.proveedor)+'</td><td>'+fmtQ(g.monto)+'</td><td>'+fmtQ(imp)+'</td><td class="cell-strong">'+fmtQ(g.monto+imp)+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
};
APP.formGasto = function(){
  const body = '<div class="form-grid">'+
    '<div class="field"><label>Fecha</label><input type="date" id="gf-fecha" value="'+todayStr()+'"></div>'+
    '<div class="field"><label>Categoría</label><select id="gf-categoria">'+CATS_GASTO.map(c=>'<option>'+c+'</option>').join('')+'</select></div>'+
    '<div class="field full"><label>Descripción</label><input id="gf-descripcion"></div>'+
    '<div class="field"><label>Proveedor</label><input id="gf-proveedor"></div>'+
    '<div class="field"><label>Monto (Q)</label><input type="number" step="0.01" id="gf-monto"></div>'+
    '<div class="field"><label>Impuesto (%)</label><input type="number" id="gf-impuesto" value="12"></div>'+
  '</div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="APP.guardarGasto()">'+ic('check')+' Guardar gasto</button>';
  openModal(modalShell('Nuevo gasto', 'gastos', body, foot));
};
APP.guardarGasto = function(){
  const r = L.registrarGasto(DB, {fecha:val('gf-fecha'), categoria:val('gf-categoria'), descripcion:val('gf-descripcion'), proveedor:val('gf-proveedor'), monto:val('gf-monto'), impuestoPct:val('gf-impuesto')}, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  closeModal(); toast('Gasto '+r.gasto.id+' registrado.','success','check');
  if(STATE.view==='gastos') APP.nav('gastos');
};

/* ============================================================
   VISTA: RENTABILIDAD
   ============================================================ */
VIEW_RENDERERS['rentabilidad'] = function(){
  const finalizadas = DB.ordenes.filter(o=>o.estado==='Finalizada');
  const filas = finalizadas.map(o=>Object.assign({orden:o}, rentabilidadOrden(o)));
  const ingresoTotal = filas.reduce((s,f)=>s+f.ingreso,0);
  const costoTotal = filas.reduce((s,f)=>s+f.costos.total,0);
  const utilidadTotal = ingresoTotal-costoTotal;
  const margenProm = ingresoTotal>0 ? (utilidadTotal/ingresoTotal*100) : 0;
  const perdida = filas.filter(f=>f.utilidad<0);
  return '<div class="view-header"><div><h1 class="view-title">'+ic('rentabilidad')+'Rentabilidad</h1><p class="view-sub">Análisis de utilidad por servicio, cliente y mes</p></div></div>'+
    '<div class="kpi-grid">'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#16a34a,#15803d)">'+ic('money')+'</div><div class="kpi-val">'+fmtQ(ingresoTotal)+'</div><div class="kpi-label">Ingresos sin IVA (servicios finalizados)</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#64748b,#334155)">'+ic('gastos')+'</div><div class="kpi-val">'+fmtQ(costoTotal)+'</div><div class="kpi-label">Costos totales</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#2f80ed,#00b8d9)">'+ic('rentabilidad')+'</div><div class="kpi-val">'+fmtQ(utilidadTotal)+'</div><div class="kpi-label">Utilidad total</div></div>'+
      '<div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#7c3aed,#5b21b6)">'+ic('target')+'</div><div class="kpi-val">'+margenProm.toFixed(1)+'%</div><div class="kpi-label">Margen promedio</div></div>'+
    '</div>'+
    '<div class="grid-2">'+
      '<div class="card"><div class="card-head"><h3>'+ic('chart')+' Rentabilidad mensual</h3></div><div class="card-body"><div class="chart-wrap"><canvas id="chart-rent-mensual" data-h="220"></canvas></div></div></div>'+
      '<div class="card"><div class="card-head"><h3>'+ic('clientes')+' Rentabilidad por cliente</h3></div><div class="card-body"><div class="chart-wrap"><canvas id="chart-rent-cliente" data-h="220"></canvas></div></div></div>'+
    '</div>'+
    (perdida.length ? '<div class="danger-box" style="margin-bottom:16px;">'+ic('alert')+'<div><b>'+perdida.length+' servicio(s) con pérdida detectada.</b> Revise los costos asociados a estas órdenes.</div></div>' : '')+
    '<div class="card"><div class="card-head"><h3>'+ic('rentabilidad')+' Rentabilidad por servicio</h3><p>Ejemplo de cálculo: Ingreso − (Mano de obra + Repuestos + Transporte + Otros) = Utilidad</p></div>'+
    '<div class="card-body pad-0"><div class="table-scroll"><table class="tbl"><thead><tr><th>Orden</th><th>Cliente</th><th>Ingreso (sin IVA)</th><th>M. Obra</th><th>Repuestos</th><th>Transporte</th><th>Otros</th><th>Costo total</th><th>Utilidad</th><th>Margen</th></tr></thead><tbody>'+
      filas.map(f=>'<tr'+(f.utilidad<0?' style="background:#fef2f2;"':'')+'><td class="cell-strong">'+f.orden.id+'</td><td>'+esc(cliente(f.orden.clienteId).nombre)+'</td><td>'+fmtQ(f.ingreso)+'</td><td>'+fmtQ(f.costos.manoObra)+'</td><td>'+fmtQ(f.costos.repuestos)+'</td><td>'+fmtQ(f.costos.transporte)+'</td><td>'+fmtQ(f.costos.otros)+'</td><td>'+fmtQ(f.costos.total)+'</td>'+
      '<td style="color:'+(f.utilidad<0?'var(--rojo)':'var(--verde)')+';font-weight:700;">'+fmtQ(f.utilidad)+'</td><td>'+badge(f.margen+'%', f.margen<0?'rojo':f.margen<20?'amarillo':'verde')+'</td></tr>').join('')+
    '</tbody></table></div></div></div>';
};
window.__afterRender['rentabilidad'] = function(){
  const meses = ultimosMeses(6);
  const ing = [42000,38500,51200,47800,60300, DB.facturas.reduce((s,f)=>s+f.total,0)];
  const gas = [21000,19800,24500,23100,27600, DB.gastos.reduce((s,g)=>s+g.monto*(1+(g.impuestoPct||0)/100),0)];
  const utilidad = meses.map((m,i)=>ing[i]-gas[i]);
  if(document.getElementById('chart-rent-mensual')) drawBarChart('chart-rent-mensual', meses, [{label:'Utilidad', data:utilidad, color:PALETTE[2]}]);
  const finalizadas = DB.ordenes.filter(o=>o.estado==='Finalizada');
  const porCliente = {};
  finalizadas.forEach(o=>{ const r=rentabilidadOrden(o); const nombre=cliente(o.clienteId).nombre; porCliente[nombre]=(porCliente[nombre]||0)+r.utilidad; });
  const labs = Object.keys(porCliente); const vals = Object.values(porCliente);
  if(document.getElementById('chart-rent-cliente') && labs.length) drawBarChart('chart-rent-cliente', labs.map(l=>l.split(' ')[0]), [{label:'Utilidad', data:vals, color:PALETTE[5]}]);
};

/* ============================================================
   VISTA: REPORTES GERENCIALES
   ============================================================ */
const REPORTES_DEF = [
  {id:'r1', nombre:'Servicios por período', icon:'calendar', desc:'Listado de órdenes de trabajo en un rango de fechas.'},
  {id:'r2', nombre:'Servicios por técnico', icon:'panel', desc:'Cantidad de servicios atendidos por cada técnico.'},
  {id:'r3', nombre:'Productividad de técnicos', icon:'chart', desc:'Servicios finalizados vs. asignados, por técnico.'},
  {id:'r4', nombre:'Cotizaciones aprobadas', icon:'check', desc:'Cotizaciones con estado Aprobada y su valor.'},
  {id:'r5', nombre:'Cotizaciones rechazadas', icon:'x', desc:'Cotizaciones con estado Rechazada y su valor.'},
  {id:'r6', nombre:'Facturas pendientes', icon:'facturacion', desc:'Facturas con saldo pendiente de cobro.'},
  {id:'r7', nombre:'Clientes con mayor facturación', icon:'clientes', desc:'Ranking de clientes por monto facturado.'},
  {id:'r8', nombre:'Repuestos más utilizados', icon:'inventario', desc:'Repuestos con mayor consumo en órdenes.'},
  {id:'r9', nombre:'Rentabilidad por cliente', icon:'rentabilidad', desc:'Utilidad generada por cada cliente.'},
  {id:'r10', nombre:'Rentabilidad por servicio', icon:'money', desc:'Utilidad y margen de cada orden finalizada.'},
];
function datosReporte(id){
  switch(id){
    case 'r1': return {headers:['Orden','Cliente','Fecha','Servicio','Técnico','Estado'], rows: DB.ordenes.map(o=>[o.id, cliente(o.clienteId).nombre, fmtDate(o.fecha), o.tipoServicio, tecnico(o.tecnicoId).nombre, o.estado])};
    case 'r2': return {headers:['Técnico','Órdenes asignadas','Finalizadas'], rows: DB.tecnicos.map(t=>{ const mine=ordenesDeTecnico(t.id); return [t.nombre, mine.length, mine.filter(o=>o.estado==='Finalizada').length]; })};
    case 'r3': return {headers:['Técnico','Asignadas','Finalizadas','Productividad'], rows: DB.tecnicos.map(t=>{ const mine=ordenesDeTecnico(t.id); const fin=mine.filter(o=>o.estado==='Finalizada').length; return [t.nombre, mine.length, fin, mine.length?((fin/mine.length*100).toFixed(0)+'%'):'0%']; })};
    case 'r4': { const l=DB.cotizaciones.filter(c=>c.estado==='Aprobada'); return {headers:['Cotización','Cliente','Fecha','Total'], rows:l.map(c=>[c.id, cliente(c.clienteId).nombre, fmtDate(c.fecha), fmtQ(calcTotales(c.items,c.descuentoPct,c.impuestoPct).total)])}; }
    case 'r5': { const l=DB.cotizaciones.filter(c=>c.estado==='Rechazada'); return {headers:['Cotización','Cliente','Fecha','Total'], rows:l.map(c=>[c.id, cliente(c.clienteId).nombre, fmtDate(c.fecha), fmtQ(calcTotales(c.items,c.descuentoPct,c.impuestoPct).total)])}; }
    case 'r6': { const l=DB.facturas.filter(f=>saldoFactura(f)>0.009); return {headers:['Factura','Cliente','Fecha','Total','Saldo','Estado'], rows:l.map(f=>[f.id, cliente(f.clienteId).nombre, fmtDate(f.fecha), fmtQ(f.total), fmtQ(saldoFactura(f)), f.estado])}; }
    case 'r7': { const map={}; DB.facturas.forEach(f=>{ if(f.estado==='Anulada') return; const n=cliente(f.clienteId).nombre; map[n]=(map[n]||0)+f.total; }); const arr=Object.entries(map).sort((a,b)=>b[1]-a[1]); return {headers:['Cliente','Total facturado'], rows:arr.map(a=>[a[0], fmtQ(a[1])])}; }
    case 'r8': { const map={}; DB.ordenes.forEach(o=>(o.ejecucion.repuestos||[]).forEach(r=>{ const p=producto(r.productoId); if(!p) return; map[p.nombre]=(map[p.nombre]||0)+r.cantidad; })); const arr=Object.entries(map).sort((a,b)=>b[1]-a[1]); return {headers:['Repuesto','Cantidad utilizada'], rows: arr.length?arr.map(a=>[a[0],a[1]]):[['Sin datos','0']]}; }
    case 'r9': { const map={}; DB.ordenes.filter(o=>o.estado==='Finalizada').forEach(o=>{ const r=rentabilidadOrden(o); const n=cliente(o.clienteId).nombre; map[n]=(map[n]||0)+r.utilidad; }); const arr=Object.entries(map).sort((a,b)=>b[1]-a[1]); return {headers:['Cliente','Utilidad generada'], rows: arr.length?arr.map(a=>[a[0], fmtQ(a[1])]):[['Sin datos','Q 0.00']]}; }
    case 'r10': { const l=DB.ordenes.filter(o=>o.estado==='Finalizada'); return {headers:['Orden','Cliente','Ingreso','Costo','Utilidad','Margen'], rows:l.map(o=>{ const r=rentabilidadOrden(o); return [o.id, cliente(o.clienteId).nombre, fmtQ(r.ingreso), fmtQ(r.costos.total), fmtQ(r.utilidad), r.margen+'%']; })}; }
  }
}
VIEW_RENDERERS['reportes'] = function(){
  return '<div class="view-header"><div><h1 class="view-title">'+ic('reportes')+'Reportes gerenciales</h1><p class="view-sub">10 reportes clave para la toma de decisiones</p></div></div>'+
    '<div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">'+
    REPORTES_DEF.map(r=>'<div class="card" style="margin-bottom:0;"><div class="card-body">'+
      '<div class="kpi-icon" style="background:linear-gradient(135deg,#2f80ed,#1a4d8c);margin-bottom:10px;">'+ic(r.icon)+'</div>'+
      '<h3 style="margin:0 0 4px;font-size:14px;">'+esc(r.nombre)+'</h3><p class="small-muted" style="margin:0 0 12px;">'+esc(r.desc)+'</p>'+
      '<div style="display:flex;gap:8px;"><button class="btn btn-sm btn-outline" onclick="APP.verReporte(\''+r.id+'\')">'+ic('eye')+' Ver</button><button class="btn btn-sm btn-secondary" onclick="APP.exportarReporte(\''+r.id+'\')">'+ic('download')+' CSV</button></div>'+
    '</div></div>').join('')+
    '</div>';
};
APP.verReporte = function(id){
  const def = REPORTES_DEF.find(r=>r.id===id);
  const d = datosReporte(id);
  const body = '<div class="table-scroll"><table class="tbl"><thead><tr>'+d.headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+
    (d.rows.length ? d.rows.map(row=>'<tr>'+row.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>').join('') : '<tr><td colspan="'+d.headers.length+'" style="text-align:center;color:var(--gris-400);padding:20px;">Sin datos disponibles</td></tr>')+
    '</tbody></table></div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button><button class="btn btn-primary" onclick="APP.exportarReporte(\''+id+'\')">'+ic('download')+' Exportar a CSV</button>';
  openModal(modalShell(def.nombre, def.icon, body, foot), {size:'wide'});
};
APP.exportarReporte = function(id){
  const def = REPORTES_DEF.find(r=>r.id===id);
  const d = datosReporte(id);
  // Nombre de archivo sin tildes: algunos navegadores descartan nombres con caracteres no ASCII.
  const nombre = def.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_');
  downloadCSV('SIGEM_'+nombre+'.csv', [d.headers, ...d.rows]);
};

/* ============================================================
   VISTA: USUARIOS Y SEGURIDAD
   ============================================================ */
VIEW_RENDERERS['usuarios'] = function(){
  window.__usrTab = window.__usrTab || 'usuarios';
  return '<div class="view-header"><div><h1 class="view-title">'+ic('usuarios')+'Usuarios y seguridad</h1><p class="view-sub">Gestión de usuarios, roles y control de acceso</p></div>'+
    '<div class="view-actions"><button class="btn btn-primary" onclick="APP.formUsuario()">'+ic('plus')+' Nuevo usuario</button></div></div>'+
    '<div class="tabs">'+
      '<button class="tab-btn '+(window.__usrTab==='usuarios'?'active':'')+'" onclick="APP.usrTab(\'usuarios\')">Usuarios</button>'+
      '<button class="tab-btn '+(window.__usrTab==='permisos'?'active':'')+'" onclick="APP.usrTab(\'permisos\')">Matriz de permisos</button>'+
      '<button class="tab-btn '+(window.__usrTab==='bitacora'?'active':'')+'" onclick="APP.usrTab(\'bitacora\')">Bitácora de actividad</button>'+
    '</div><div id="usuarios-content"></div>';
};
window.__afterRender['usuarios'] = function(){ APP.renderUsuariosContent(); };
APP.usrTab = function(t){ window.__usrTab=t; APP.nav('usuarios'); };
APP.renderUsuariosContent = function(){
  const wrap = document.getElementById('usuarios-content');
  if(window.__usrTab==='permisos'){ wrap.innerHTML = renderMatrizPermisos(); return; }
  if(window.__usrTab==='bitacora'){
    wrap.innerHTML = '<div class="card"><div class="card-body pad-0"><div class="table-scroll"><table class="tbl"><thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>'+
      DB.bitacora.map(b=>'<tr><td>'+esc(b.fecha)+'</td><td class="cell-strong">'+esc(b.usuario)+'</td><td>'+badge(b.accion,'azul')+'</td><td>'+esc(b.detalle)+'</td></tr>').join('')+
      '</tbody></table></div></div></div>';
    return;
  }
  wrap.innerHTML = '<div class="card"><div class="card-body pad-0"><div class="table-scroll"><table class="tbl"><thead><tr><th>Código</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Último acceso</th><th>Estado</th><th></th></tr></thead><tbody>'+
    DB.usuarios.map(u=>'<tr><td>'+u.id+'</td><td class="cell-strong">'+esc(u.nombre)+'</td><td>'+esc(u.email)+'</td><td>'+badge(u.rol, u.rol==='Administrador'?'morado':u.rol==='Técnico'?'azul':'amarillo')+'</td><td>'+fmtDate(u.ultimoAcceso)+'</td><td>'+estadoBadge(u.estado)+'</td>'+
    '<td><button class="icon-action" title="Editar" onclick="APP.formUsuario(\''+u.id+'\')">'+ic('edit')+'</button></td></tr>').join('')+
    '</tbody></table></div></div></div>';
};
function renderMatrizPermisos(){
  const modulos = [
    ['Dashboard (general)', true, true, true],
    ['Clientes', true, true, false],
    ['Equipos', true, true, false],
    ['Cotizaciones', true, true, false],
    ['Órdenes de trabajo', true, true, false],
    ['Mi panel técnico', false, false, true],
    ['Inventario', true, false, false],
    ['Facturación', true, true, false],
    ['Pagos y CxC', true, true, false],
    ['Gastos', true, false, false],
    ['Rentabilidad y costos administrativos', true, false, false],
    ['Reportes gerenciales', true, false, false],
    ['Usuarios y configuración', true, false, false],
    ['Impuestos y márgenes', true, false, false],
  ];
  return '<div class="card"><div class="card-head"><h3>'+ic('shield')+' Matriz de control de acceso basado en roles (RBAC)</h3></div><div class="card-body pad-0">'+
    '<div class="table-scroll"><table class="tbl access-table"><thead><tr><th>Módulo / Información</th><th>Administrador</th><th>Administrativo</th><th>Técnico</th></tr></thead><tbody>'+
    modulos.map(m=>'<tr><td>'+esc(m[0])+'</td><td>'+(m[1]?'<span class="perm-yes">'+ic('check')+'</span>':'<span class="perm-no">'+ic('x')+'</span>')+'</td><td>'+(m[2]?'<span class="perm-yes">'+ic('check')+'</span>':'<span class="perm-no">'+ic('x')+'</span>')+'</td><td>'+(m[3]?'<span class="perm-yes">'+ic('check')+'</span>':'<span class="perm-no">'+ic('x')+'</span>')+'</td></tr>').join('')+
    '</tbody></table></div></div></div>'+
    '<div class="warn-box">'+ic('shield')+'<div><b>Regla de seguridad clave:</b> el rol Técnico no puede visualizar rentabilidad, costos administrativos, configuración, usuarios ni impuestos. Esta restricción se aplica automáticamente al iniciar sesión: el menú lateral solo muestra los módulos permitidos para el rol activo.</div></div>';
}
APP.formUsuario = function(id){
  const u = id ? byId(DB.usuarios,id) : null;
  const body = '<div class="form-grid">'+
    '<div class="field"><label>Nombre completo</label><input id="uf-nombre" value="'+esc(u?u.nombre:'')+'"></div>'+
    '<div class="field"><label>Correo electrónico</label><input id="uf-email" value="'+esc(u?u.email:'')+'"></div>'+
    '<div class="field"><label>Rol</label><select id="uf-rol">'+['Administrador','Administrativo','Técnico'].map(r=>'<option '+(u&&u.rol===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Estado</label><select id="uf-estado"><option '+(u&&u.estado==='Activo'?'selected':'')+'>Activo</option><option '+(u&&u.estado==='Inactivo'?'selected':'')+'>Inactivo</option></select></div>'+
    '<div class="field full"><label>Contraseña (demo)</label><input type="password" id="uf-pass" value="'+(u?esc(u.pass):'123456')+'"><div class="small-muted" style="margin-top:4px;">Mínimo 6 caracteres.</div></div>'+
  '</div>';
  const foot = '<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button><button class="btn btn-primary" onclick="APP.guardarUsuario(\''+(id||'')+'\')">'+ic('check')+' Guardar usuario</button>';
  openModal(modalShell(u?'Editar usuario':'Nuevo usuario', 'usuarios', body, foot));
};
APP.guardarUsuario = function(id){
  const data = {nombre:val('uf-nombre'), email:val('uf-email'), rol:val('uf-rol'), estado:val('uf-estado'), pass:val('uf-pass')};
  const r = L.guardarUsuario(DB, id, data, STATE.user);
  if(!r.ok){ errorToast(r); return; }
  toast(id ? 'Usuario actualizado.' : 'Usuario '+r.usuario.id+' creado.','success','check');
  closeModal();
  if(STATE.view==='usuarios') APP.renderUsuariosContent();
};

/* ============================================================
   VISTA: GUÍA DE LA DEMO (flujo, calidad, pruebas, arquitectura)
   ============================================================ */
const FLUJO_13 = [
  {n:1, t:'Registrar cliente', d:'Cree un cliente nuevo con sus datos comerciales y de contacto.', view:'clientes', accion:"APP.formCliente()"},
  {n:2, t:'Registrar equipo', d:'Asocie un equipo (bomba, motor o panel) al cliente registrado.', view:'equipos', accion:"APP.formEquipo()"},
  {n:3, t:'Crear cotización', d:'Genere una cotización con mano de obra, repuestos, transporte e impuestos.', view:'cotizaciones', accion:"APP.formCotizacion()"},
  {n:4, t:'Aprobar cotización', d:'Cambie el estado de la cotización a "Aprobada" para habilitar la orden de trabajo.', view:'cotizaciones', accion:null},
  {n:5, t:'Generar orden de trabajo', d:'Desde la cotización aprobada, use el botón "Generar orden de trabajo".', view:'cotizaciones', accion:null},
  {n:6, t:'Asignar técnico', d:'Confirme o reasigne el técnico y programe fecha/hora (con validación de choques).', view:'ordenes', accion:null},
  {n:7, t:'Técnico ejecuta el servicio', d:'Inicie sesión como Técnico y abra la orden desde "Mi panel técnico".', view:'panel-tecnico', accion:null},
  {n:8, t:'Registrar repuestos utilizados', d:'Dentro de la ejecución, agregue los repuestos usados; se valida la existencia.', view:'panel-tecnico', accion:null},
  {n:9, t:'Finalizar servicio', d:'Presione "Finalizar servicio": la orden cambia a Finalizada y se descuenta el inventario.', view:'panel-tecnico', accion:null},
  {n:10, t:'Generar reporte técnico', d:'Se genera automáticamente el reporte técnico imprimible con firmas.', view:'ordenes', accion:null},
  {n:11, t:'Generar factura', d:'Desde la orden finalizada, genere la factura simulada.', view:'facturacion', accion:null},
  {n:12, t:'Registrar pago', d:'Registre un pago total o parcial sobre la factura generada.', view:'pagos', accion:null},
  {n:13, t:'Consultar rentabilidad', d:'Revise la utilidad y el margen del servicio en el módulo de Rentabilidad.', view:'rentabilidad', accion:null},
];
VIEW_RENDERERS['guia'] = function(){
  window.__guiaTab = window.__guiaTab || 'flujo';
  const tabs = [['flujo','Flujo de 13 pasos'],['calidad','Calidad ISO/IEC 25010'],['pruebas','Pruebas de caja negra'],['arquitectura','Arquitectura conceptual']];
  return '<div class="view-header"><div><h1 class="view-title">'+ic('guia')+'Guía de la demostración</h1><p class="view-sub">Material de apoyo para la exposición universitaria</p></div></div>'+
    '<div class="tabs">'+tabs.map(t=>'<button class="tab-btn '+(window.__guiaTab===t[0]?'active':'')+'" onclick="APP.guiaTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>'+
    '<div id="guia-content"></div>';
};
APP.guiaTab = function(t){ window.__guiaTab=t; APP.nav('guia'); };
window.__afterRender['guia'] = function(){ document.getElementById('guia-content').innerHTML = renderGuiaTabContent(); };

function renderGuiaTabContent(){
  const tab = window.__guiaTab;
  if(tab==='flujo') return renderFlujoGuia();
  if(tab==='calidad') return renderCalidadISO();
  if(tab==='pruebas') return renderPruebasCajaNegra();
  return renderArquitectura();
}
function renderFlujoGuia(){
  return '<div class="note-box" style="margin-bottom:16px;">'+ic('info')+'<div>Este flujo cubre el ciclo completo del negocio: desde el registro del cliente hasta el análisis de rentabilidad del servicio. Úselo como guion durante la exposición. Puede navegar directamente a cada módulo con el botón "Ir".</div></div>'+
    '<div class="card"><div class="card-body"><div class="flow-steps">'+
    FLUJO_13.map(f=>'<div class="flow-step"><div class="flow-num">'+f.n+'</div><div class="flow-txt"><b>'+esc(f.t)+'</b><span>'+esc(f.d)+'</span></div>'+
      '<div class="flow-goto"><button class="btn btn-sm btn-outline" onclick="APP.irFlujo(\''+f.view+'\''+(f.accion?",'"+f.accion.replace(/'/g,"\\'")+"'":'')+')">Ir '+ic('arrow')+'</button></div></div>').join('')+
    '</div></div></div>';
}
APP.irFlujo = function(view, accionStr){
  if(!canAccess(view)){ toast('Este paso requiere iniciar sesión con un rol que tenga acceso a "'+view+'". Cierre sesión y use el usuario indicado.','error','shield'); return; }
  APP.nav(view);
  if(accionStr){ setTimeout(()=>{ try{ new Function(accionStr)(); }catch(e){} }, 150); }
};
function renderCalidadISO(){
  const items = [
    {t:'Adecuación funcional', icon:'check', d:'Cada módulo (clientes, equipos, cotizaciones, órdenes, inventario, facturación, pagos, rentabilidad) cumple con exactitud el propósito para el que fue diseñado, cubriendo los procesos reales de una empresa de mantenimiento electromecánico.'},
    {t:'Usabilidad', icon:'guia', d:'Navegación por menú lateral organizado por área, formularios claros con validaciones en línea, buscador global, filtros y notificaciones visuales que facilitan el aprendizaje del sistema sin capacitación extensa.'},
    {t:'Seguridad', icon:'shield', d:'Autenticación simulada, control de acceso basado en roles (RBAC), bitácora de actividad y restricción explícita de información sensible (rentabilidad, costos, impuestos) para el rol Técnico.'},
  ];
  return '<div class="grid-2b">'+items.map(i=>'<div class="card"><div class="card-body"><div class="kpi-icon" style="background:linear-gradient(135deg,#2f80ed,#1a4d8c);margin-bottom:10px;">'+ic(i.icon)+'</div><h3 style="margin:0 0 6px;font-size:14.5px;">'+esc(i.t)+' <span class="badge badge-azul">ISO/IEC 25010</span></h3><p style="font-size:12.8px;color:var(--gris-600);margin:0;">'+esc(i.d)+'</p></div></div>').join('')+
    '<div class="card" style="grid-column:1/-1;"><div class="card-body"><h3 style="margin:0 0 10px;font-size:14px;">Otras características consideradas</h3><div class="chip-list">'+
      ['Eficiencia de desempeño','Compatibilidad','Fiabilidad','Mantenibilidad','Portabilidad'].map(c=>'<span class="chip">'+ic('check')+' '+c+'</span>').join('')+
    '</div></div></div></div>';
}
const CASOS_PRUEBA = [
  {tipo:'Funcional', caso:'Cálculo de totales en cotización', entrada:'Mano de obra Q1,000 · Repuestos Q1,500 · Transporte Q300 · IVA 12%', esperado:'Subtotal Q2,800.00, Impuesto Q336.00, Total Q3,136.00', resultado:'Correcto'},
  {tipo:'Funcional', caso:'Descuento automático de inventario', entrada:'Finalizar orden con 2 unidades de "Rodamiento 6205-2RS"', esperado:'La existencia del producto disminuye en 2 unidades', resultado:'Correcto'},
  {tipo:'Integración', caso:'Generar orden desde cotización aprobada', entrada:'Cotización COT-2026-001 en estado Aprobada', esperado:'Se crea una nueva orden de trabajo vinculada a la cotización', resultado:'Correcto'},
  {tipo:'Sistema', caso:'Validación de conflicto de horario', entrada:'Asignar a Carlos Méndez el 22/08/2026 08:00 (ya ocupado)', esperado:'El sistema muestra alerta de conflicto y bloquea el guardado', resultado:'Correcto'},
  {tipo:'Aceptación', caso:'Generación de factura desde orden finalizada', entrada:'Orden OT-2026-001 en estado Finalizada', esperado:'Se genera factura con subtotal, impuesto y total coherentes con la cotización', resultado:'Correcto'},
  {tipo:'Regresión', caso:'Pago parcial no debe marcar factura como pagada', entrada:'Factura de Q1,000.00, pago de Q400.00', esperado:'Estado de factura cambia a "Parcial", saldo Q600.00', resultado:'Correcto'},
  {tipo:'Usabilidad', caso:'Búsqueda global de una orden', entrada:'Texto "OT-2026-002" en el buscador superior', esperado:'Se muestra resultado y permite navegar directamente a la orden', resultado:'Correcto'},
  {tipo:'Seguridad', caso:'Acceso restringido para rol Técnico', entrada:'Usuario con rol Técnico intenta acceder a "Rentabilidad"', esperado:'Acceso denegado, módulo no visible en el menú', resultado:'Correcto'},
];
function renderPruebasCajaNegra(){
  return '<div class="note-box" style="margin-bottom:16px;">'+ic('info')+'<div>SIGEM fue diseñado considerando principalmente <b>pruebas de caja negra</b>: se validan las entradas y salidas de cada proceso sin conocer el detalle interno de implementación. Estos son casos representativos; la suite completa (150 casos automatizados y los casos manuales para el grupo evaluador) está en la carpeta <b>docs/</b> del repositorio.</div></div>'+
    '<div class="card"><div class="card-head"><h3>'+ic('reportes')+' Casos de prueba representativos</h3></div><div class="card-body pad-0">'+
    '<div class="table-scroll"><table class="tbl"><thead><tr><th>Tipo</th><th>Caso de prueba</th><th>Entrada</th><th>Resultado esperado</th><th>Resultado</th></tr></thead><tbody>'+
    CASOS_PRUEBA.map(c=>'<tr><td>'+badge(c.tipo,'azul')+'</td><td class="cell-strong">'+esc(c.caso)+'</td><td>'+esc(c.entrada)+'</td><td>'+esc(c.esperado)+'</td><td>'+estadoBadge('Activo')+' '+esc(c.resultado)+'</td></tr>').join('')+
    '</tbody></table></div></div></div>'+
    '<div class="card"><div class="card-body"><h3 style="margin:0 0 10px;font-size:13.5px;">Tipos de prueba contemplados en el diseño</h3><div class="chip-list">'+
    ['Pruebas funcionales','Pruebas de integración','Pruebas de sistema','Pruebas de aceptación','Pruebas de regresión','Pruebas de usabilidad','Pruebas de seguridad'].map(t=>'<span class="chip">'+ic('check')+' '+t+'</span>').join('')+
    '</div></div></div>';
}
function renderArquitectura(){
  return '<div class="card"><div class="card-head"><h3>'+ic('building')+' Arquitectura conceptual de SIGEM</h3><p>Estado actual de la demo y evolución propuesta hacia producción</p></div>'+
    '<div class="card-body">'+
    '<div class="grid-2b">'+
      '<div><h4 style="margin:0 0 8px;font-size:13px;color:var(--acento);">Demo actual (frontend)</h4>'+
        '<div class="stat-row"><span>Interfaz</span><b>HTML5 + CSS3 + JavaScript (SPA)</b></div>'+
        '<div class="stat-row"><span>Datos</span><b>Modelo en memoria (mock data)</b></div>'+
        '<div class="stat-row"><span>Autenticación</span><b>Simulada por rol</b></div>'+
        '<div class="stat-row"><span>Lógica de negocio</span><b>Módulo independiente (logica.js) con pruebas automatizadas</b></div>'+
        '<div class="stat-row"><span>Gráficos</span><b>Motor propio sobre &lt;canvas&gt;</b></div>'+
        '<div class="stat-row"><span>Despliegue</span><b>Sitio estático en GitHub Pages</b></div>'+
      '</div>'+
      '<div><h4 style="margin:0 0 8px;font-size:13px;color:var(--verde);">Evolución propuesta a producción</h4>'+
        '<div class="stat-row"><span>Frontend</span><b>React / Next.js + Tailwind CSS</b></div>'+
        '<div class="stat-row"><span>Backend</span><b>API REST (Node.js / .NET / Laravel)</b></div>'+
        '<div class="stat-row"><span>Base de datos</span><b>Relacional (PostgreSQL / SQL Server)</b></div>'+
        '<div class="stat-row"><span>Autenticación</span><b>JWT / OAuth2 + roles en base de datos</b></div>'+
        '<div class="stat-row"><span>Facturación</span><b>Integración con FEL / SAT (Guatemala)</b></div>'+
      '</div>'+
    '</div><hr class="sep">'+
    '<h4 style="margin:0 0 10px;font-size:13px;">Capas del sistema (vista lógica)</h4>'+
    '<div style="display:flex;flex-direction:column;gap:8px;">'+
      capaArq('Presentación', 'Interfaz web SIGEM · Dashboard, formularios, reportes', '#2f80ed')+
      flechaArq()+
      capaArq('Lógica de negocio', 'Cotizador, agenda técnica, control de inventario, facturación, rentabilidad', '#00b8d9')+
      flechaArq()+
      capaArq('Acceso a datos (futuro)', 'API REST · Autenticación · Reglas de negocio en servidor', '#16a34a')+
      flechaArq()+
      capaArq('Persistencia (futuro)', 'Base de datos relacional · Integración facturación electrónica SAT', '#7c3aed')+
    '</div>'+
    '</div></div>';
}
function capaArq(t,d,color){ return '<div style="border-left:4px solid '+color+';background:var(--gris-50);border-radius:8px;padding:10px 14px;"><b style="font-size:13px;">'+esc(t)+'</b><div class="small-muted">'+esc(d)+'</div></div>'; }
function flechaArq(){ return '<div style="text-align:center;color:var(--gris-400);">'+ic('down')+'</div>'; }

/* ---------------------------- INICIALIZACIÓN ---------------------------- */
document.getElementById('login-pass').addEventListener('keydown', e=>{ if(e.key==='Enter') APP.login(); });
document.getElementById('login-email').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('login-pass').focus(); });
window.addEventListener('resize', ()=>{ if(STATE.user && VIEW_RENDERERS[STATE.view]) { const fn = window.__afterRender[STATE.view]; if(fn) fn(STATE.params); } });
document.getElementById('login-screen').style.display = 'flex';
document.getElementById('app-shell').style.display = 'none';

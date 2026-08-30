var projects = {
  'postgres-retail-admin': {
    name: 'postgres-retail-admin',
    tags: ['PostgreSQL', 'Bash', 'SQL'],
    desc: 'Simula la base de datos de un negocio retail (tiendas, productos, inventario, ventas de TPV, empleados, turnos de caja) para practicar tareas reales de administración de PostgreSQL sobre un caso con sentido de negocio, no ejercicios de SQL sueltos.',
    learnings: [
      'Roles con privilegio mínimo: retail_readonly (solo lectura) y retail_app (lectura/escritura, sin poder borrar tablas) — ninguno con permisos de superusuario.',
      'Índice compuesto medido con EXPLAIN ANALYZE sobre 5.000 filas reales: 0.479ms sin índice → 0.175ms con índice (2.7x más rápido).',
      'Trigger que mantiene el inventario actualizado solo a partir de un historial de movimientos (kardex), con un turno de caja real cuadrado y otro con descuadre (-2,50€), calculados a partir de ventas generadas paso a paso.'
    ],
    repo: 'https://github.com/sergioseoane/postgres-retail-admin'
  },
  'nagios-monitoring-lab': {
    name: 'nagios-monitoring-lab',
    tags: ['Nagios', 'Linux', 'Docker'],
    desc: 'Monitorización con Nagios Core de un servidor Linux y, de forma explícita, de la base de datos del proyecto postgres-retail-admin — conectando ambos proyectos entre sí en vez de dejarlos sueltos. Incluye tiendas TPV simuladas y automatización de incidencias (Acknowledge, Scheduled Downtime) vía comandos externos.',
    learnings: [
      'Prueba de carga real con pgbench: la alerta de CPU se disparó sola, sin forzar nada a mano, confirmando el ciclo completo de detección.'
    ],
    repo: 'https://github.com/sergioseoane/nagios-monitoring-lab'
  },
  'netscan': {
    name: 'netscan',
    tags: ['Python', 'Tkinter', 'Redes'],
    desc: 'Escáner de red propio en Python, con interfaz de comandos e interfaz gráfica con pestañas, más una carpeta de scripts de auditoría rutinaria (certificados SSL, comparador de línea base, versiones por banner con CVEs reales, e informe semanal en HTML).',
    learnings: [
      'Barrido de host y puertos en paralelo con ThreadPoolExecutor — de varios minutos a segundos para una subred /24 completa.',
      'Wake-on-LAN verificado byte a byte: el paquete mágico generado coincide exactamente con el formato oficial (6 bytes 0xFF + la MAC repetida 16 veces).'
    ],
    repo: 'https://github.com/sergioseoane/netscan'
  },
  'portfolio-infra': {
    name: 'portfolio-infra',
    tags: ['Docker Compose', 'AWS', 'Cloudflare Tunnel'],
    desc: 'La infraestructura que sirve esta misma página: una única instancia AWS de la capa gratuita (1GB RAM) con Postgres, Nagios y esta landing, donde únicamente la landing es alcanzable desde internet, a través de un túnel de Cloudflare.',
    learnings: [
      'El túnel de Cloudflare es una conexión de salida, no de entrada: la instancia "llama" a Cloudflare y no al revés, así que no hace falta abrir ningún puerto de entrada salvo SSH.',
      'Separación en dos redes internas de Docker (edge-net / backend-net): si el contenedor del túnel se viera comprometido, no existe ninguna ruta de red hacia Postgres o Nagios — no por firewall, sino porque no hay ningún camino entre las dos redes.',
      'Presupuesto de memoria calculado y ajustado para caber en 1GB (Postgres con shared_buffers=64MB, límites de memoria explícitos por contenedor).'
    ],
    repo: 'https://github.com/sergioseoane/portfolio-infra'
  }
};

function openModal(id) {
  var p = projects[id];
  if (!p) return;
  document.getElementById('modal-title').textContent = p.name;
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-tags').innerHTML = p.tags.map(function(t) {
    return '<span class="tag">' + t + '</span>';
  }).join('');
  document.getElementById('modal-learnings').innerHTML = p.learnings.map(function(l) {
    return '<li>' + l + '</li>';
  }).join('');
  document.getElementById('modal-repo-link').href = p.repo;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

function tick() {
  var el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleString('es-ES');
}
tick();
setInterval(tick, 1000);

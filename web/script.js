var projects = {
  'postgres-retail-admin': {
    name: 'postgres-retail-admin',
    tags: ['PostgreSQL', 'Bash', 'SQL'],
    desc: 'Administración de PostgreSQL sobre un esquema realista de retail/TPV (tiendas, inventario, empleados, turnos de caja y ventas), aplicando prácticas de administración de bases de datos de producción.',
    learnings: [
      'Diseño de esquemas relacionales: modelado de un dominio de negocio real con integridad referencial completa.',
      'Control de acceso (RBAC): roles diferenciados de solo lectura y aplicación, bajo el principio de mínimo privilegio.',
      'Automatización a nivel de base de datos: triggers y funciones en PL/pgSQL para mantener la integridad de datos.',
      'Gestión de backups con verificación activa de integridad, no solo generación.',
      'Optimización basada en evidencia: decisiones de indexación respaldadas por EXPLAIN ANALYZE.'
    ],
    repo: 'https://github.com/sergioseoane/postgres-retail-admin'
  },
  'nagios-monitoring-lab': {
    name: 'nagios-monitoring-lab',
    tags: ['Nagios', 'Linux', 'Docker'],
    desc: 'Monitorización con Nagios Core de un servidor Linux y de la base de datos del proyecto postgres-retail-admin, con automatización de la gestión de incidencias mediante el motor de comandos externos.',
    learnings: [
      'Administración de sistemas y contenedores: orquestación con Docker Compose y segmentación de red interna.',
      'Configuración completa de Nagios Core: hosts, servicios, comandos, plantillas y contactos.',
      'Monitorización de bases de datos con mínimo privilegio, mediante un rol de solo lectura dedicado.',
      'Gestión de secretos fuera del código, mediante variables de entorno y archivos de macros no versionados.',
      'Automatización de operaciones (ITOps/NOC): reconocimiento de incidencias y ventanas de mantenimiento programadas.'
    ],
    repo: 'https://github.com/sergioseoane/nagios-monitoring-lab'
  },
  'netscan': {
    name: 'netscan',
    tags: ['Python', 'Tkinter', 'Redes'],
    desc: 'Herramienta de escaneo y auditoría de red en Python, con interfaz de línea de comandos e interfaz gráfica, orientada a tareas reales de administración de red: descubrimiento de hosts, diagnóstico y auditoría recurrente.',
    learnings: [
      'Programación de red a bajo nivel: escaneo de hosts y puertos mediante sockets TCP paralelizados.',
      'Identificación de dispositivos: resolución de fabricante por MAC y detección de direcciones aleatorias/privadas.',
      'Diagnóstico de red: estimación de sistema operativo por TTL y diagnóstico de conectividad en cascada.',
      'Integración con APIs externas: consulta de vulnerabilidades reales (CVE) contra la API del NVD (NIST).',
      'Automatización operativa: certificados TLS, comparación de inventario de red y tareas programadas de Windows.'
    ],
    repo: 'https://github.com/sergioseoane/netscan'
  },
  'portfolio-infra': {
    name: 'portfolio-infra',
    tags: ['AWS IAM', 'OIDC', 'Systems Manager', 'Docker Compose'],
    desc: 'Infraestructura en AWS que sirve esta misma página: una instancia EC2 sin un solo puerto de entrada, administrada y desplegada por completo a través de Systems Manager, con autenticación federada entre GitHub y AWS mediante OIDC.',
    learnings: [
      'IAM: roles separados por función (instancia EC2 / despliegue desde GitHub), cada uno con permisos mínimos y auditables.',
      'OIDC entre GitHub y AWS: autenticación federada sin ninguna clave de AWS almacenada en GitHub — la política de confianza restringe qué repositorios y ramas pueden desplegar.',
      'AWS Systems Manager: acceso administrativo y despliegue continuo sin abrir el puerto 22 en ningún momento.',
      'EC2 y Security Groups: instancia con cero puertos de entrada publicados, incluyendo el diagnóstico de un fallo real causado por una región "opt-in" de AWS.',
      'Segmentación de red a nivel de contenedor: redes Docker independientes que limitan el impacto de un compromiso.',
      'Gestión de secretos: credenciales y tokens fuera del código, mediante variables de entorno no versionadas.',
      'Gestión de recursos en entornos restringidos: presupuesto de memoria calculado por servicio para 1GB de RAM.',
      'Orquestación con Docker Compose: arranque basado en comprobaciones de salud, no en tiempos de espera arbitrarios.'
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

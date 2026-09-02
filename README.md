# portfolio-infra

Infraestructura de despliegue que orquesta el conjunto del portfolio
técnico en una única instancia cloud (capa gratuita, 1GB de RAM),
aplicando principios reales de seguridad perimetral, segmentación de
red y gestión de secretos — no solo "hacer que funcione", sino
hacerlo con una superficie de exposición mínima deliberada.

## Objetivo del proyecto

Diseñar el despliegue de varios servicios internos (base de datos,
monitorización) junto a un único punto de acceso público, de forma
que un fallo o compromiso del componente expuesto **no** suponga una
vía de acceso al resto de la infraestructura.

## Arquitectura y decisión de seguridad central

```
                    Internet
                       │
                       ▼
              Túnel de Cloudflare
           (conexión saliente, no entrante)
                       │
                       ▼
        ┌──────────────────────────┐
        │        edge-net           │
        │  cloudflared + landing     │
        └──────────────────────────┘
                       │
              (sin ruta de red)
                       │
        ┌──────────────────────────┐
        │       backend-net          │
        │   PostgreSQL + Nagios       │
        └──────────────────────────┘
```

La instancia no publica ningún puerto de entrada salvo SSH — el
tráfico público llega mediante un túnel que la propia instancia
inicia hacia Cloudflare, nunca al revés. Los servicios internos
(base de datos, monitorización) están además en una **red Docker
distinta** a la del componente público: si el contenedor expuesto se
viera comprometido, no existe ninguna ruta de red hacia el resto,
no por regla de firewall, sino por ausencia estructural de conexión
entre ambas redes.

## Competencias técnicas aplicadas

- **Seguridad perimetral sin exposición interna**: un único servicio
  público mediante un túnel de conexión saliente, sin puertos de
  entrada.
- **Segmentación de red a nivel de contenedor**: redes Docker
  independientes que limitan el radio de impacto de un componente
  comprometido.
- **Gestión de secretos**: credenciales y tokens fuera del código,
  mediante variables de entorno no versionadas.
- **Gestión de recursos en entornos restringidos**: presupuesto de
  memoria por servicio (`mem_limit`) para operar de forma estable en
  una instancia de 1GB de RAM.
- **Orquestación con Docker Compose**: arranque basado en
  comprobaciones de salud (`healthcheck`), no en tiempos de espera
  arbitrarios.

## Estructura del repositorio

```
docker-compose.yml   → definición completa de la infraestructura
.env.example          → plantilla de variables de entorno (sin datos reales)
web/
  index.html
  style.css
  script.js
```

## Cómo ejecutarlo

```bash
cp .env.example .env
# Completar variables: credenciales de base de datos, panel de
# monitorización y token del túnel de Cloudflare

docker compose up -d
```

Requiere que [`postgres-retail-admin`](../postgres-retail-admin) y
[`nagios-monitoring-lab`](../nagios-monitoring-lab) estén clonados
como carpetas hermanas de este repositorio, ya que sus archivos de
configuración se montan directamente en los contenedores
correspondientes.

## Proyectos relacionados

- [`postgres-retail-admin`](../postgres-retail-admin)
- [`nagios-monitoring-lab`](../nagios-monitoring-lab)

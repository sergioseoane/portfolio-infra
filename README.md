# portfolio-infra

Infraestructura de despliegue en **AWS** para una parte de mi
portfolio técnico — no es todo el portfolio, es la pieza que
demuestra cómo diseño, aseguro y automatizo una infraestructura
cloud real: aislamiento de red, despliegue continuo y cero acceso
SSH.

**La landing de mi portfolio vive aquí**: [portfolio.sergioseoane.com](https://portfolio.sergioseoane.com)

## Objetivo del proyecto

Dos objetivos a la vez: que sirva como banco de pruebas real para
aplicar y demostrar prácticas de infraestructura — redes, seguridad,
CI/CD, IAM — sobre un caso concreto, y que a la vez sostenga una web
pública de verdad, sin que esta última comprometa la seguridad de lo
primero.

La base de datos y el panel de monitorización son de uso interno,
para las pruebas — no necesitan ser accesibles desde fuera, así que
se diseñan completamente aislados de internet.

## Conocimientos de AWS aplicados

- **IAM**: roles separados por función, uno para la instancia EC2 y
  otro distinto para el despliegue desde GitHub, cada uno con
  permisos mínimos y auditables.
- **OIDC entre GitHub y AWS**: autenticación federada sin ninguna
  clave de AWS almacenada en GitHub — la política de confianza
  restringe qué repositorios y ramas pueden desplegar.
- **AWS Systems Manager (SSM)**: acceso administrativo y ejecución
  remota de comandos sin abrir el puerto 22 en ningún momento.
- **EC2 y Security Groups**: instancia con cero puertos de entrada
  publicados, incluyendo el diagnóstico de un fallo real causado por
  una región "opt-in" de AWS, `eu-south-2`.
- **STS**: uso práctico de `AssumeRoleWithWebIdentity` y de cómo
  GitHub codifica la identidad del repositorio en el token validado.

## Arquitectura

```
                    Internet
                       │
                       ▼
              Túnel de Cloudflare
                       │
                       ▼
        ┌──────────────────────────┐
        │  edge-net: cloudflared     │
        │       + landing            │
        └──────────────────────────┘
                       │
              (sin ruta de red)
                       │
        ┌──────────────────────────┐
        │  backend-net: PostgreSQL   │
        │       + Nagios              │
        └──────────────────────────┘

  GitHub Actions ─(OIDC)─▶ AWS IAM ─▶ SSM ─▶ instancia
      (sin claves guardadas, sin puerto de entrada)
```

La instancia no publica ningún puerto de entrada: el tráfico público
llega por el túnel de Cloudflare, y los despliegues por SSM — ambas
son conexiones que la instancia inicia hacia fuera, nunca al revés.
Los servicios internos viven además en una red Docker distinta a la
del componente público, sin ninguna ruta entre ambas.

## Competencias técnicas aplicadas

- Segmentación de red a nivel de contenedor.
- Gestión de secretos fuera del código, mediante variables de entorno y GitHub Secrets.
- Presupuesto de memoria por servicio para una instancia de 1GB de RAM.
- Orquestación con Docker Compose basada en `healthcheck`.
- Diagnóstico metódico de fallos con evidencia directa: logs, tokens decodificados, estados de comando.

## Cómo ejecutarlo

```bash
cp .env.example .env
docker compose up -d
```

Requiere [`postgres-retail-admin`](../postgres-retail-admin) y
[`nagios-monitoring-lab`](../nagios-monitoring-lab) clonados como
carpetas hermanas.

## Despliegue continuo (CI/CD)

```
GitHub Actions → OIDC → AWS STS → AWS SSM → git pull + docker compose
```

Cada `push` a `main` despliega solo, respetando qué servicios
estaban corriendo antes de actualizar.

## Proyectos relacionados

- [`postgres-retail-admin`](../postgres-retail-admin)
- [`nagios-monitoring-lab`](../nagios-monitoring-lab)

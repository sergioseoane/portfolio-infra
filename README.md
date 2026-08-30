# portfolio-infra

Orquesta en una sola instancia AWS (capa gratuita, 1GB RAM) los
proyectos de sistemas del portfolio, y expone **únicamente una
landing page propia** a través de un túnel de Cloudflare — nada más.

## Qué hay detrás, y qué es público

| Servicio | Accesible desde internet | Por qué |
|---|---|---|
| `portfolio-web` (Nginx + landing) | ✅ Sí, vía túnel | Es la única pieza pensada para que la vea un visitante |
| `postgres` | ❌ No | No tiene interfaz visual, y una base de datos nunca debe exponerse directamente |
| `nagios` | ❌ No | Queda como proyecto de práctica interno; se documenta en su repo con capturas, no en vivo |

## Cómo levantarlo

```bash
cp .env.example .env
# Genera el tunel en el panel de Cloudflare Zero Trust (Access > Tunnels)
# y pega el token en .env

docker compose up -d
```

En el panel de Cloudflare, configura la ruta pública del túnel:
- **Subdominio**: `portfolio`
- **Dominio**: `sergioseoane.com`
- **Servicio**: `http://portfolio-web:80`

Quedará accesible en **https://portfolio.sergioseoane.com** — el
dominio raíz (`sergioseoane.com`) se deja libre.

## Memoria estimada (instancia de 1GB)

| Servicio | RAM aprox. |
|---|---|
| PostgreSQL (ajustado) | 150-200MB |
| Nagios | 80-120MB |
| Nginx (landing) | 10-20MB |
| Cloudflared | 40-60MB |
| Sistema operativo | 150-200MB |
| **Total** | **~450-600MB**, con margen dentro de 1GB |

Recomendado además: crear un archivo de swap de 2GB en la instancia
como red de seguridad ante picos puntuales.

### Configuración de la Swap de Seguridad (2GB)
Si estás en una instancia Linux de 1GB, ejecuta estos comandos para crear el espacio de intercambio:
```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

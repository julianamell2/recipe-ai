# Guía de despliegue

Esta guía describe el proceso general para desplegar Recipe AI en un servidor VPS usando Docker, Docker Compose, dominio y HTTPS.

## 1. Crear servidor VPS

Se usará AWS Lightsail con Ubuntu.

Configuración recomendada:

* Ubuntu 24.04
* 1 GB RAM mínimo
* Puertos abiertos:

  * 22 para SSH
  * 80 para HTTP
  * 443 para HTTPS

## 2. Conectarse al servidor

Entrar por SSH:

```
ssh usuario@IP_DEL_SERVIDOR
```

## 3. Instalar Docker

Actualizar paquetes:

```
sudo apt update
```

Instalar Docker:

```
sudo apt install docker.io -y
```

Instalar Docker Compose:

```
sudo apt install docker-compose -y
```

Verificar instalación:

```
docker --version
docker compose version
```

## 4. Clonar repositorio

Clonar el proyecto:

```
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```
cd recipe-ai
```

## 5. Configurar variables de entorno

Verificar que exista el archivo `.env` con las variables necesarias:

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/recipe_ai
SECRET_KEY=clave_secreta
ALGORITHM=HS256
OPENROUTER_API_KEY=clave_openrouter
OPENROUTER_MODEL=openrouter/auto
```

En Docker Compose, la API debe conectarse a PostgreSQL usando el host `db`, no `localhost`.

## 6. Levantar servicios

Construir y levantar contenedores:

```
docker compose up -d --build
```

Verificar contenedores:

```
docker ps
```

Deben aparecer:

* recipe_api
* recipe_db

## 7. Probar API

Abrir en navegador:

```
http://IP_DEL_SERVIDOR:8000/docs
```

## 8. Configurar dominio

En el proveedor del dominio, crear un registro tipo A:

```
@ -> IP_DEL_SERVIDOR
```

También se puede usar un subdominio:

```
api -> IP_DEL_SERVIDOR
```

## 9. Instalar Nginx

Instalar Nginx:

```
sudo apt install nginx -y
```

Crear configuración para redirigir tráfico hacia la API.

Ejemplo:

```
server {
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 10. Configurar HTTPS

Instalar Certbot:

```
sudo apt install certbot python3-certbot-nginx -y
```

Generar certificado:

```
sudo certbot --nginx
```

Después de esto, la API debe quedar disponible en:

```
https://tudominio.com
```

## 11. Comandos útiles

Ver logs:

```
docker compose logs -f
```

Reiniciar servicios:

```
docker compose restart
```

Apagar servicios:

```
docker compose down
```

Reconstruir servicios:

```
docker compose up -d --build
```

# Recipe AI

Recipe AI es una aplicación web que permite registrar ingredientes disponibles en casa y generar recetas usando inteligencia artificial mediante OpenRouter.

## Tecnologías usadas

* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* JWT
* OpenRouter
* Pytest
* Docker
* Docker Compose
* HTML
* CSS
* JavaScript
* Bootstrap

## Funcionalidades principales

* Registro de usuarios
* Inicio de sesión con JWT
* Gestión de ingredientes
* Generación de recetas con IA
* Guardado de recetas en base de datos
* Historial de recetas
* Eliminación de recetas
* Sistema de calificaciones
* Pruebas unitarias con pytest
* Ejecución con Docker Compose

## Requisitos previos

Antes de ejecutar el proyecto se necesita tener instalado:

* Python 3.13
* Git
* Docker Desktop
* VS Code

## Instalación local

Clonar el repositorio:

```
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```
cd recipe-ai
```

Crear entorno virtual:

```
python -m venv venv
```

Activar entorno virtual en Windows:

```
venv\Scripts\activate
```

Instalar dependencias:

```
pip install -r requirements.txt
```

## Variables de entorno

El proyecto usa un archivo `.env` con variables como:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recipe_ai
SECRET_KEY=clave_secreta
ALGORITHM=HS256
OPENROUTER_API_KEY=clave_openrouter
OPENROUTER_MODEL=openrouter/auto
```

## Ejecutar base de datos con Docker

Levantar PostgreSQL:

```
docker compose up -d db
```

Verificar contenedores:

```
docker ps
```

## Ejecutar backend local

Con el entorno virtual activado:

```
uvicorn app.main:app --reload
```

Abrir Swagger:

```
http://127.0.0.1:8000/docs
```

## Ejecutar frontend

Abrir el archivo:

```
frontend/index.html
```

También se puede usar la extensión Live Server de VS Code.

## Ejecutar todo con Docker Compose

Construir y levantar servicios:

```
docker compose up -d --build
```

Esto levanta:

* API FastAPI
* Base de datos PostgreSQL

Abrir Swagger:

```
http://127.0.0.1:8000/docs
```

Para apagar los servicios:

```
docker compose down
```

## Ejecutar pruebas

Ejecutar:

```
pytest -v
```

El proyecto incluye pruebas para:

* Validación de ingredientes
* Generación del prompt
* Parseo de respuesta del LLM
* Endpoint principal de la API

## Endpoints principales

Autenticación:

```
POST /auth/register
POST /auth/login
```

Ingredientes:

```
POST /ingredients/
GET /ingredients/
DELETE /ingredients/{id}
```

Recetas:

```
POST /recipes/generate
GET /recipes/
DELETE /recipes/{id}
```

Calificaciones:

```
POST /ratings/
GET /ratings/
```

## Documentación automática

FastAPI genera documentación automática en:

```
http://127.0.0.1:8000/docs
```

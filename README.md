# Technical test

---

# 🚀 Backend con FastAPI

## 📋 Requisitos previos

- Python instalado en tu sistema.

## ⚙️ Instalación

Accede a la carpeta del backend:

```bash
cd backend
```

Crea un entorno virtual:

**En Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

Instala las dependencias necesarias, puede instalar tantas como considere necesario.:

```bash
pip install -r requirements.txt
```

---

## 🗃️ Base de datos local (MongoDB)

Puedes levantar la instancia de MongoDB usando Docker. El archivo `docker-compose.yml` ya está incluido en el proyecto.

## 📋 Requisitos previos

- Docker instalado en tu sistema.

### 🐳 Iniciar MongoDB con Docker

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up -d
```

Esto iniciará un contenedor de MongoDB accesible en `localhost:27017`, con las siguientes credenciales:

- Usuario: `root`
- Contraseña: `rootpassword`

los valores los debes agregar al archivo .env
```bash
USERNAME='root'
PASSWORD='rootpassword'
DATABASE_URL='mongodb://root:rootpassword@localhost:27017'
```

---

## 🚀 Ejecutar el servidor

Desde la carpeta del backend:

```bash
uvicorn src.main:app --reload
```

Accede a la documentación interactiva en:  
http://localhost:8000/docs

---

# ⚛️ Frontend con React

La carpeta `frontend` contiene la base de un frontend desarrollado con React.

## 📋 Requisitos previos

- Node.js
- npm
- Tener corriendo la API de FastAPI en http://localhost:8000

## ⚙️ Instalación

Accede a la carpeta del frontend:

```bash
cd frontend
```

Instala las dependencias:

```bash
npm install
```

## 🚀 Ejecutar la aplicación

```bash
npm run dev
```

La aplicación se ejecutará en http://localhost:5173 y se comunicará con tu API en http://localhost:8000.

## 📁 Estructura del proyecto

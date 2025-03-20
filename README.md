# API de Usuarios - Athendat S.R.L.

API desarrollada en NestJS utilizando Prisma ORM y MongoDB, con autenticación JWT, notificaciones en tiempo real mediante Socket.IO y documentación Swagger.

## 📋 Requisitos Previos

- Node.js (v18+)
- npm (v9+)
- MongoDB instalado y en ejecución
- Nest CLI instalado globalmente (`npm install -g @nestjs/cli`)

## 🚀 Configuración Inicial

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <DIRECTORIO_DEL_PROYECTO>
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
    ```

3. **Configurar Prisma:**
   ```bash
   npx prisma db push  
   npx prisma generate
    ```


4. **Variables de entorno:**
   ```bash
    JWT_SECRET=<TU_SECRETO_JWT>
    DATABASE_URL=<URL_MONGODB> # Ej: mongodb://localhost:27017/athendat
    PORT=<PUERTO_API> # Ej: 3000
   ```

##  🏃‍♀️‍➡️ Correr la aplicación

**Modo desarrollo:**
```bash
npm run start:dev
```

La API estará disponible en http://localhost:{PORT}.

### 📘 Documentación de la API

#### Accede a Swagger UI en:

  ```bash
  http://localhost:{PORT}/api
  ```

### ¿Qué esperar?

1. **Al correr la aplicación, se generará una carpeta logs y dentro se guardarán los logs en el sistema. Siendo guardados bajo el formato [2023-10-25] INFO: User admin@athendat.com realizó CREATE_USER**

2. **A su vez, se crea una conexión en tiempo real a través de Socket.IO. En la cual se crea un evento notification. El cual también emitirá todos los logs del sistema que no sean de lectura.**



# Disfrute!! 😊


## 📄 Licencia

#### MIT License - © 2025 Rosniel Allesta Fundora
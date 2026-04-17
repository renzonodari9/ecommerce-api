# 🚀 E-commerce API

REST API completa para e-commerce con autenticación, pagos y documentación Swagger.

## 📌 Descripción
Backend robusto para e-commerce que proporciona endpoints RESTful para gestión de productos, categorías, órdenes, usuarios y pagos con Stripe. Incluye documentación Swagger y autenticación JWT.

## 🛠️ Tecnologías
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (Autenticación)
- Stripe (Pagos)
- Swagger (Documentación)
- Zod (Validación)
- Helmet & Rate Limiting

## ⚡ Features
- Autenticación JWT (Register/Login)
- Gestión de usuarios
- CRUD productos y categorías
- Gestión de órdenes
- Pagos con Stripe
- Documentación Swagger (/api-docs)
- Validación de datos con Zod
- Rate limiting
- Seguridad con Helmet
- Tests con Jest

## 🌐 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/register | Registro de usuario |
| POST | /api/auth/login | Inicio de sesión |
| GET | /api/products | Listar productos |
| POST | /api/products | Crear producto |
| GET | /api/orders | Listar órdenes |
| POST | /api/checkout | Procesar pago |

## 📖 Documentación
Swagger disponible en: `http://localhost:3001/api-docs`

## 📦 Instalación

```bash
# Clonar el repo
git clone https://github.com/renzonodari9/ecommerce-api.git
cd ecommerce-api

# Instalar dependencias
npm install

# Configurar base de datos PostgreSQL
# Crear archivo .env con DATABASE_URL

# Generar cliente Prisma y sincronizar BD
npm run db:push

# (Opcional) Poblar con datos de prueba
npm run db:seed

# Ejecutar en desarrollo
npm run dev
```

## 🔐 Variables de Entorno (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
PORT=3001
```

## 🔐 Credenciales (Desarrollo)
- **Email**: admin@ecommerce.com
- **Contraseña**: Admin123!

## 👨‍💻 Autor
**Renzo Nodari** - Desarrollador Full Stack
- GitHub: @renzonodari9

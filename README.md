# 🛒 E-commerce REST API

Professional E-commerce REST API built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based with refresh tokens
- **Products**: CRUD operations with filtering, pagination, and search
- **Categories**: Hierarchical product categorization
- **Shopping Cart**: Add, update, remove items
- **Orders**: Complete order workflow with status tracking
- **Payments**: Stripe integration ready
- **Security**: Rate limiting, helmet, CORS, input validation
- **Documentation**: Swagger/OpenAPI documentation
- **Testing**: Jest unit tests

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/renzonodari9/ecommerce-api.git
cd ecommerce-api

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
```

## 🗄️ Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

## 🚀 Running the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📚 API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/api/health

## 🔐 Default Credentials

After seeding:

**Admin:**
- Email: admin@ecommerce.com
- Password: Admin123!

**User:**
- Email: user@example.com
- Password: User123!

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## 📁 Project Structure

```
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/      # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seeder
└── tests/              # Test files
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile |
| PATCH | /api/auth/profile | Update profile |
| POST | /api/auth/change-password | Change password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products |
| GET | /api/products/:slug | Get product by slug |
| POST | /api/products | Create product (Admin) |
| PATCH | /api/products/:id | Update product (Admin) |
| DELETE | /api/products/:id | Delete product (Admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | List categories |
| GET | /api/categories/:slug | Get category by slug |
| POST | /api/categories | Create category (Admin) |
| PATCH | /api/categories/:id | Update category (Admin) |
| DELETE | /api/categories/:id | Delete category (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get user's cart |
| POST | /api/cart/items | Add item to cart |
| PATCH | /api/cart/items | Update item quantity |
| DELETE | /api/cart/items/:productId | Remove item |
| DELETE | /api/cart | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | List user's orders |
| GET | /api/orders/:orderId | Get order details |
| POST | /api/orders | Create order |
| PATCH | /api/orders/:orderId/cancel | Cancel order |
| PATCH | /api/orders/:orderId/status | Update status (Admin) |

## 🚀 Deploy on Render

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## 📝 License

MIT License

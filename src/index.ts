import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import bcrypt from 'bcryptjs';

import { config } from './config/index.js';
import { swaggerSpec } from './config/swagger.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import prisma from './utils/db.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

async function seedDatabase() {
  try {
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const userPassword = await bcrypt.hash('User123!', 12);

    await prisma.user.upsert({
      where: { email: 'admin@ecommerce.com' },
      update: {},
      create: {
        email: 'admin@ecommerce.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });

    await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        password: userPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      },
    });

    const electronics = await prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices',
      },
    });

    const clothing = await prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
      },
    });

    const accessories = await prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Complementary items and accessories',
      },
    });

    console.log('🌱 Seeding database...');
    
    await prisma.product.deleteMany({ where: { sku: { in: ['WHP-001', 'SWX-001', 'PLJ-001', 'DSG-001', 'BTS-001'] } } });
    
    const products = [
        { name: 'Wireless Headphones Pro', description: 'Premium noise-canceling wireless headphones with 30-hour battery life.', price: 299.99, comparePrice: 349.99, sku: 'WHP-001', stock: 50, images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']), categoryId: electronics.id, featured: true },
        { name: 'Smart Watch Series X', description: 'Advanced smartwatch with health monitoring and GPS.', price: 449.99, sku: 'SWX-001', stock: 30, images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']), categoryId: electronics.id, featured: true },
        { name: 'Premium Leather Jacket', description: 'Genuine leather jacket with modern styling.', price: 399.99, comparePrice: 499.99, sku: 'PLJ-001', stock: 25, images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500']), categoryId: clothing.id, featured: true },
        { name: 'Designer Sunglasses', description: 'UV protection with polarized lenses.', price: 149.99, sku: 'DSG-001', stock: 100, images: JSON.stringify(['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500']), categoryId: accessories.id, featured: false },
        { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with 360° sound.', price: 79.99, comparePrice: 99.99, sku: 'BTS-001', stock: 80, images: JSON.stringify(['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500']), categoryId: electronics.id, featured: false },
      ];

      for (const p of products) {
        const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        await prisma.product.create({
          data: { ...p, slug: `${slug}-${Date.now().toString(36)}` },
        });
      }
      
      console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
}

seedDatabase();

seedDatabase();

app.listen(config.port, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║                                            ║
  ║   🚀 E-commerce API is running!            ║
  ║                                            ║
  ║   📍 Server: http://localhost:${config.port}          ║
  ║   📖 Docs:   http://localhost:${config.port}/api-docs   ║
  ║   🔧 Env:    ${config.env.padEnd(32)}║
  ║                                            ║
  ╚════════════════════════════════════════════╝
  `);
});

export default app;

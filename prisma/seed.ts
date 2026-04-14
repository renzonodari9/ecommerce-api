import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const userPassword = await bcrypt.hash('User123!', 12);

  const admin = await prisma.user.upsert({
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

  const user = await prisma.user.upsert({
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

  console.log('✅ Users created');

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Complementary items and accessories',
      },
    }),
  ]);

  console.log('✅ Categories created');

  const products = [
    {
      name: 'Wireless Headphones Pro',
      description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
      price: 299.99,
      comparePrice: 349.99,
      sku: 'WHP-001',
      stock: 50,
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']),
      categoryId: categories[0].id,
      featured: true,
    },
    {
      name: 'Smart Watch Series X',
      description: 'Advanced smartwatch with health monitoring and GPS.',
      price: 449.99,
      sku: 'SWX-001',
      stock: 30,
      images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']),
      categoryId: categories[0].id,
      featured: true,
    },
    {
      name: 'Premium Leather Jacket',
      description: 'Genuine leather jacket with modern styling.',
      price: 399.99,
      comparePrice: 499.99,
      sku: 'PLJ-001',
      stock: 25,
      images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500']),
      categoryId: categories[1].id,
      featured: true,
    },
    {
      name: 'Designer Sunglasses',
      description: 'UV protection with polarized lenses.',
      price: 149.99,
      sku: 'DSG-001',
      stock: 100,
      images: JSON.stringify(['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500']),
      categoryId: categories[2].id,
      featured: false,
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with 360° sound.',
      price: 79.99,
      comparePrice: 99.99,
      sku: 'BTS-001',
      stock: 80,
      images: JSON.stringify(['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500']),
      categoryId: categories[0].id,
      featured: false,
    },
  ];

  for (const product of products) {
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        ...product,
        slug: `${slug}-${Date.now().toString(36)}`,
      },
    });
  }

  console.log('✅ Products created');
  console.log('');
  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('📧 Admin credentials:');
  console.log('   Email: admin@ecommerce.com');
  console.log('   Password: Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

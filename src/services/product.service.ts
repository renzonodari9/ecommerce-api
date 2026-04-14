import prisma from '../utils/db.js';
import { AppError } from '../middleware/error.js';
import { HttpStatusCode, ErrorMessages } from '../config/constants.js';

interface ProductFilter {
  categoryId?: string;
  featured?: boolean;
  active?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductService {
  async create(data: {
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    sku: string;
    stock: number;
    images: string[];
    categoryId: string;
    featured?: boolean;
  }): Promise<unknown> {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError(ErrorMessages.CATEGORY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const slug = this.generateSlug(data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice || null,
        sku: data.sku,
        stock: data.stock,
        images: JSON.stringify(data.images || []),
        categoryId: data.categoryId,
        featured: data.featured || false,
        slug,
      },
      include: { category: true },
    });

    return {
      ...product,
      images: JSON.parse(product.images || '[]'),
    };
  }

  async findAll(
    filters: ProductFilter,
    pagination: { page: number; limit: number; sortBy: string; sortOrder: 'asc' | 'desc' }
  ): Promise<{ data: unknown[]; pagination: unknown }> {
    const where: any = {
      active: filters.active ?? true,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy: { [pagination.sortBy]: pagination.sortOrder },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.product.count({ where }),
    ]);

    const parsedProducts = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
    }));

    return {
      data: parsedProducts,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNextPage: pagination.page < Math.ceil(total / pagination.limit),
        hasPrevPage: pagination.page > 1,
      },
    };
  }

  async findBySlug(slug: string): Promise<unknown> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      throw new AppError(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    return {
      ...product,
      images: JSON.parse(product.images || '[]'),
    };
  }

  async findById(id: string): Promise<unknown> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new AppError(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    return {
      ...product,
      images: JSON.parse(product.images || '[]'),
    };
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      comparePrice: number;
      sku: string;
      stock: number;
      images: string[];
      categoryId: string;
      featured: boolean;
      active: boolean;
    }>
  ): Promise<unknown> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const updateData: any = { ...data };

    if (data.images !== undefined) {
      updateData.images = JSON.stringify(data.images);
    }

    if (data.name) {
      updateData.slug = this.generateSlug(data.name);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    return {
      ...updated,
      images: JSON.parse(updated.images || '[]'),
    };
  }

  async delete(id: string): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    await prisma.product.delete({
      where: { id },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .concat('-', Date.now().toString(36));
  }
}

export const productService = new ProductService();

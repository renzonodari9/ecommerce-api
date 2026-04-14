import prisma from '../utils/db.js';
import { AppError } from '../middleware/error.js';
import { HttpStatusCode, ErrorMessages } from '../config/constants.js';

export class CategoryService {
  async create(data: { name: string; description?: string; image?: string }): Promise<unknown> {
    const slug = this.generateSlug(data.name);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
      },
    });

    return category;
  }

  async findAll(): Promise<unknown[]> {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: { where: { active: true } } },
        },
      },
    });

    return categories.map((cat) => ({
      ...cat,
      productCount: cat._count.products,
      _count: undefined,
    }));
  }

  async findBySlug(slug: string): Promise<unknown> {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { active: true },
          take: 20,
        },
      },
    });

    if (!category) {
      throw new AppError(ErrorMessages.CATEGORY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    return category;
  }

  async findById(id: string): Promise<unknown> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new AppError(ErrorMessages.CATEGORY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    return category;
  }

  async update(
    id: string,
    data: Partial<{ name: string; description: string; image: string }>
  ): Promise<unknown> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError(ErrorMessages.CATEGORY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const updateData: { name?: string; slug?: string; description?: string; image?: string } = {
      ...data,
    };

    if (data.name) {
      updateData.slug = this.generateSlug(data.name);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new AppError(ErrorMessages.CATEGORY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (category.products.length > 0) {
      throw new AppError(
        'Cannot delete category with existing products',
        HttpStatusCode.CONFLICT
      );
    }

    await prisma.category.delete({
      where: { id },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const categoryService = new CategoryService();

import type { Brand } from '@generated/prisma';

import { db } from '@/modules/core';
import { AppError } from '@/modules/core';

import {
  brandInputSchema,
  brandUpdateSchema,
  type BrandInput,
  type BrandUpdateInput,
} from './schemas';
import { mapUniqueConstraint } from './prisma-errors';

/** Brands are generic from day one — nothing here mentions cars, or any other category. */

export async function createBrand(input: BrandInput): Promise<Brand> {
  const parsed = brandInputSchema.parse(input);
  try {
    return await db.brand.create({ data: parsed });
  } catch (error) {
    throw mapUniqueConstraint(error, 'slug');
  }
}

export async function updateBrand(id: string, input: BrandUpdateInput): Promise<Brand> {
  const parsed = brandUpdateSchema.parse(input);
  await getBrandOrThrow(id);
  try {
    return await db.brand.update({ where: { id }, data: parsed });
  } catch (error) {
    throw mapUniqueConstraint(error, 'slug');
  }
}

export async function getBrand(id: string): Promise<Brand | null> {
  return db.brand.findUnique({ where: { id } });
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  return db.brand.findUnique({ where: { slug } });
}

export async function listBrands(): Promise<Brand[]> {
  return db.brand.findMany({ orderBy: { nameEn: 'asc' } });
}

async function getBrandOrThrow(id: string): Promise<Brand> {
  const brand = await getBrand(id);
  if (!brand) throw new AppError('NOT_FOUND', { details: { entity: 'Brand', id } });
  return brand;
}

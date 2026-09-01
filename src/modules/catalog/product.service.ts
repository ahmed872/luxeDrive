import type { Prisma, Product, ProductStatus, Variant } from '@generated/prisma';

import { db } from '@/modules/core';
import { AppError } from '@/modules/core';

import { validateProductAttributes } from './attribute.service';
import { matchVariantsToCombinations } from './variant-combinations';
import {
  createProductInputSchema,
  productUpdateSchema,
  type CreateProductInput,
  type ProductUpdateInput,
} from './schemas';
import { mapUniqueConstraint } from './prisma-errors';

/**
 * Products, generically — nothing in this file, or anywhere in `catalog`,
 * branches on what kind of product it is. A car and a pair of shoes go
 * through the exact same `createProduct` call; what makes them different is
 * entirely in their category's `AttributeDefinition` rows, not in code.
 */

export interface ProductWithVariants extends Product {
  variants: Variant[];
}

/**
 * Creates a product with its option matrix and every variant that matrix
 * requires (or, with no options, the one default variant) in a single
 * transaction. Every product created this way already satisfies "at least
 * one variant" — there is no code path that produces a variant-less product.
 */
export async function createProduct(input: CreateProductInput): Promise<ProductWithVariants> {
  const parsed = createProductInputSchema.parse(input);
  const { product: productInput, options = [], variants } = parsed;

  const category = await db.category.findUnique({ where: { id: productInput.categoryId } });
  if (!category) {
    throw new AppError('NOT_FOUND', {
      details: { entity: 'Category', id: productInput.categoryId },
    });
  }
  if (productInput.brandId) {
    const brand = await db.brand.findUnique({ where: { id: productInput.brandId } });
    if (!brand)
      throw new AppError('NOT_FOUND', { details: { entity: 'Brand', id: productInput.brandId } });
  }

  const attributes = await validateProductAttributes(
    productInput.categoryId,
    productInput.attributes,
  );
  const matched = matchVariantsToCombinations(options, variants);
  const status = productInput.status ?? 'DRAFT';
  if (status === 'PUBLISHED') assertPublishable({ ...productInput, attributes }, variants.length);

  try {
    return await db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...productInput,
          attributes: attributes as unknown as Prisma.InputJsonValue,
          status,
        },
      });

      // option name -> { id, values: valueEn -> id }
      const optionIndex = new Map<string, { id: string; values: Map<string, string> }>();
      for (const option of options) {
        const created = await tx.productOption.create({
          data: {
            productId: product.id,
            nameAr: option.nameAr,
            nameEn: option.nameEn,
            values: { create: option.values },
          },
          include: { values: true },
        });
        optionIndex.set(option.nameEn, {
          id: created.id,
          values: new Map(created.values.map((v) => [v.valueEn, v.id])),
        });
      }

      const createdVariants = [];
      for (const { variant, combination } of matched) {
        const optionValueIds = combination.map((ref) => {
          const optionValueId = optionIndex.get(ref.optionNameEn)?.values.get(ref.valueEn);
          // matchVariantsToCombinations only returns combinations built from
          // `options`, so every ref here was just created above.
          if (!optionValueId) {
            throw new AppError('INTERNAL', {
              internalMessage: `Unresolved option value: ${ref.valueEn}`,
            });
          }
          return optionValueId;
        });

        const created = await tx.variant.create({
          data: {
            productId: product.id,
            sku: variant.sku,
            labelAr: variant.labelAr,
            labelEn: variant.labelEn,
            priceMinor: variant.priceMinor,
            compareAtMinor: variant.compareAtMinor,
            salePriceMinor: variant.salePriceMinor,
            saleStartsAt: variant.saleStartsAt,
            saleEndsAt: variant.saleEndsAt,
            stockQuantity: variant.stockQuantity,
            lowStockThreshold: variant.lowStockThreshold,
            trackInventory: variant.trackInventory,
            weightGrams: variant.weightGrams,
            position: variant.position,
            optionValues: { create: optionValueIds.map((optionValueId) => ({ optionValueId })) },
          },
        });
        createdVariants.push(created);
      }

      return { ...product, variants: createdVariants };
    });
  } catch (error) {
    throw mapUniqueConstraint(error, isSkuConflict(error) ? 'sku' : 'slug');
  }
}

export async function updateProduct(id: string, input: ProductUpdateInput): Promise<Product> {
  const parsed = productUpdateSchema.parse(input);
  const existing = await getProductOrThrow(id);

  const categoryId = parsed.categoryId ?? existing.categoryId;
  if (parsed.categoryId) {
    const category = await db.category.findUnique({ where: { id: parsed.categoryId } });
    if (!category)
      throw new AppError('NOT_FOUND', { details: { entity: 'Category', id: parsed.categoryId } });
  }
  if (parsed.brandId) {
    const brand = await db.brand.findUnique({ where: { id: parsed.brandId } });
    if (!brand)
      throw new AppError('NOT_FOUND', { details: { entity: 'Brand', id: parsed.brandId } });
  }

  // Re-validate whenever the category changes, even if `attributes` itself
  // wasn't part of this call: the product's existing attributes were valid
  // for its *old* category and are not guaranteed to mean anything for the
  // new one (a car's `fuel_type` has no definition at all under "Shoes").
  const categoryChanged =
    parsed.categoryId !== undefined && parsed.categoryId !== existing.categoryId;
  const attributes =
    parsed.attributes !== undefined || categoryChanged
      ? await validateProductAttributes(categoryId, parsed.attributes ?? existing.attributes)
      : undefined;

  if (parsed.status === 'PUBLISHED') {
    const variantCount = await db.variant.count({ where: { productId: id } });
    assertPublishable(
      { ...existing, ...parsed, attributes: attributes ?? existing.attributes },
      variantCount,
    );
  }

  // `attributes` is destructured out and re-attached separately: Zod types it
  // as `Record<string, unknown>`, which isn't assignable to Prisma's JSON
  // input type, so leaving it in the spread contaminates `data`'s inferred
  // type even when the conditional below overrides it.
  const { attributes: _rawAttributes, ...restParsed } = parsed;
  const data: Prisma.ProductUncheckedUpdateInput = {
    ...restParsed,
    ...(attributes !== undefined
      ? { attributes: attributes as unknown as Prisma.InputJsonValue }
      : {}),
  };

  try {
    return await db.product.update({ where: { id }, data });
  } catch (error) {
    throw mapUniqueConstraint(error, 'slug');
  }
}

/** The one gate a product must pass to become PUBLISHED — called from both
 * `createProduct` and `updateProduct` rather than trusted to have been
 * checked already, since a later phase (P07's admin UI) will call this from
 * a third place too. */
function assertPublishable(
  product: { nameAr: string; nameEn: string; categoryId: string; attributes?: unknown },
  variantCount: number,
): void {
  const problems: string[] = [];
  if (variantCount < 1) problems.push('A product needs at least one variant to be published');
  if (!product.nameAr?.trim() || !product.nameEn?.trim())
    problems.push('Name (Arabic and English) is required');
  if (!product.categoryId) problems.push('A category is required');

  if (problems.length > 0) {
    throw new AppError('INVALID_STATE_TRANSITION', {
      details: { reason: 'Product is not publishable', problems },
    });
  }
}

export async function publishProduct(id: string): Promise<Product> {
  return updateProduct(id, { status: 'PUBLISHED' as ProductStatus });
}

export async function getProduct(id: string): Promise<Product | null> {
  return db.product.findUnique({ where: { id } });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return db.product.findUnique({ where: { slug } });
}

async function getProductOrThrow(id: string): Promise<Product> {
  const product = await getProduct(id);
  if (!product) throw new AppError('NOT_FOUND', { details: { entity: 'Product', id } });
  return product;
}

function isSkuConflict(error: unknown): boolean {
  const meta = (error as { meta?: { target?: string[] } } | undefined)?.meta;
  return Array.isArray(meta?.target) && meta.target.includes('sku');
}

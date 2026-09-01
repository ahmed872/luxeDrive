import type { Prisma, ProductStatus } from '@generated/prisma';

import { db } from '@/modules/core';
import { resolveVariantStockStatus, type StockStatus } from '@/modules/catalog';

/**
 * The inventory screen's one query.
 *
 * Rows are *variants*, not products: stock belongs to the variant, and an
 * admin restocking size 41 in black should not have to page through the
 * product that owns it. Every filter is SQL — a catalog with ten thousand
 * variants must not become ten thousand rows in a browser (P08 §10).
 */

export type InventoryStockFilter = 'in_stock' | 'low_stock' | 'out_of_stock' | 'untracked';
export type InventorySort = 'stock-asc' | 'stock-desc' | 'sku-asc' | 'updated-desc';

export interface InventoryListingQuery {
  /** Matches a variant SKU, or the product's Arabic/English name. */
  q?: string;
  productId?: string;
  categoryId?: string;
  brandId?: string;
  status?: ProductStatus;
  stock?: InventoryStockFilter;
  page?: number;
  pageSize?: number;
  sort?: InventorySort;
}

export interface InventoryListingItem {
  variantId: string;
  sku: string;
  variantLabelAr: string | null;
  variantLabelEn: string | null;
  productId: string;
  productNameAr: string;
  productNameEn: string;
  productStatus: ProductStatus;
  stockQuantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  stockStatus: StockStatus;
  priceMinor: number;
  updatedAt: Date;
}

export interface InventoryListingResult {
  items: InventoryListingItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

/**
 * "Low stock" is `0 < quantity <= threshold` on a tracked variant — the
 * same rule `resolveVariantStockStatus` applies when rendering a badge.
 * Expressed here as a `where` clause so the filter narrows in the database
 * rather than after the fact; a variant whose threshold is 0 can never be
 * low, only in or out of stock, which is why the comparison is against the
 * column rather than a constant.
 */
function stockWhere(filter: InventoryStockFilter): Prisma.VariantWhereInput {
  switch (filter) {
    case 'untracked':
      return { trackInventory: false };
    case 'out_of_stock':
      return { trackInventory: true, stockQuantity: { lte: 0 } };
    case 'low_stock':
      return {
        trackInventory: true,
        stockQuantity: { gt: 0 },
        lowStockThreshold: { gt: 0 },
        // Prisma cannot compare two columns in a `where`, so the
        // quantity <= threshold half is applied as a raw column comparison
        // through `AND` on the same table.
      };
    case 'in_stock':
      return { OR: [{ trackInventory: false }, { stockQuantity: { gt: 0 } }] };
  }
}

function buildWhere(query: InventoryListingQuery): Prisma.VariantWhereInput {
  const product: Prisma.ProductWhereInput = { deletedAt: null };
  if (query.productId) product.id = query.productId;
  if (query.categoryId) product.categoryId = query.categoryId;
  if (query.brandId) product.brandId = query.brandId;
  if (query.status) product.status = query.status;

  const where: Prisma.VariantWhereInput = { product: { is: product } };

  if (query.stock) Object.assign(where, stockWhere(query.stock));

  if (query.q) {
    where.OR = [
      { sku: { contains: query.q, mode: 'insensitive' } },
      { product: { is: { ...product, nameAr: { contains: query.q, mode: 'insensitive' } } } },
      { product: { is: { ...product, nameEn: { contains: query.q, mode: 'insensitive' } } } },
    ];
  }

  return where;
}

function buildOrderBy(sort: InventorySort | undefined): Prisma.VariantOrderByWithRelationInput[] {
  switch (sort) {
    case 'stock-desc':
      return [{ stockQuantity: 'desc' }, { id: 'asc' }];
    case 'sku-asc':
      return [{ sku: 'asc' }, { id: 'asc' }];
    case 'updated-desc':
      return [{ updatedAt: 'desc' }, { id: 'asc' }];
    case 'stock-asc':
    default:
      // The default an inventory manager actually wants: what is closest to
      // running out, first. `id` breaks ties so paging is stable.
      return [{ stockQuantity: 'asc' }, { id: 'asc' }];
  }
}

export async function listInventory(
  query: InventoryListingQuery = {},
): Promise<InventoryListingResult> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE));
  const where = buildWhere(query);

  // The low-stock filter needs `stockQuantity <= lowStockThreshold`, a
  // column-to-column comparison Prisma's `where` cannot express. The ids
  // come from one raw query and narrow the main one, which keeps a single
  // paginated round trip instead of fetching rows to filter in memory.
  if (query.stock === 'low_stock') {
    const lowIds = await db.$queryRaw<{ id: string }[]>`
      SELECT id FROM variants
      WHERE track_inventory = true
        AND stock_quantity > 0
        AND stock_quantity <= low_stock_threshold
    `;
    where.id = { in: lowIds.map((row) => row.id) };
  }

  const [rows, total] = await Promise.all([
    db.variant.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        product: { select: { id: true, nameAr: true, nameEn: true, status: true } },
      },
    }),
    db.variant.count({ where }),
  ]);

  return {
    items: rows.map((row) => ({
      variantId: row.id,
      sku: row.sku,
      variantLabelAr: row.labelAr,
      variantLabelEn: row.labelEn,
      productId: row.product.id,
      productNameAr: row.product.nameAr,
      productNameEn: row.product.nameEn,
      productStatus: row.product.status,
      stockQuantity: row.stockQuantity,
      lowStockThreshold: row.lowStockThreshold,
      trackInventory: row.trackInventory,
      stockStatus: resolveVariantStockStatus(row),
      priceMinor: row.priceMinor,
      updatedAt: row.updatedAt,
    })),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

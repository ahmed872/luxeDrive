'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { DataTable, type DataTableColumn } from '@/components/admin/data-table';
import { StatusBadge, type StatusTone } from '@/components/admin/status-badge';
import { Pagination } from '@/components/ui/pagination';
import type { Locale } from '@/lib/i18n/locales';

export type ProductRowStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ProductRowStock = 'in-stock' | 'low-stock' | 'out-of-stock' | null;

export interface ProductTableRow {
  id: string;
  name: string;
  skuSummary: string;
  variantCount: number;
  categoryName: string | null;
  brandName: string | null;
  /** Pre-formatted server-side: money formatting needs the store's currency
   * and exponent, which live in the domain, not in a table cell. */
  price: string | null;
  compareAtPrice: string | null;
  stockStatus: ProductRowStock;
  status: ProductRowStatus;
  updatedAt: string;
}

export interface ProductsTableLabels {
  colProduct: string;
  colSku: string;
  colCategory: string;
  colBrand: string;
  colPrice: string;
  colStock: string;
  status: string;
  updatedAt: string;
  actions: string;
  emptyTitle: string;
  emptyDescription: string;
  statusDraft: string;
  statusPublished: string;
  statusArchived: string;
  stockIn: string;
  stockLow: string;
  stockOut: string;
  variantCount: string;
  previousPage: string;
  nextPage: string;
  pageLabel: string;
}

const STATUS_TONE: Record<ProductRowStatus, StatusTone> = {
  DRAFT: 'neutral',
  PUBLISHED: 'success',
  ARCHIVED: 'warning',
};

const STOCK_TONE: Record<Exclude<ProductRowStock, null>, StatusTone> = {
  'in-stock': 'success',
  'low-stock': 'warning',
  'out-of-stock': 'error',
};

export function ProductsTable({
  rows,
  page,
  pageCount,
  labels,
}: {
  rows: ProductTableRow[];
  page: number;
  pageCount: number;
  /** Kept in the props even though every displayed string arrives
   * pre-resolved: the row link target is locale-independent, but future
   * per-locale formatting in this table would need it. */
  locale?: Locale;
  labels: ProductsTableLabels;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusLabel: Record<ProductRowStatus, string> = {
    DRAFT: labels.statusDraft,
    PUBLISHED: labels.statusPublished,
    ARCHIVED: labels.statusArchived,
  };
  const stockLabel: Record<Exclude<ProductRowStock, null>, string> = {
    'in-stock': labels.stockIn,
    'low-stock': labels.stockLow,
    'out-of-stock': labels.stockOut,
  };

  const columns: DataTableColumn<ProductTableRow>[] = [
    {
      key: 'product',
      header: labels.colProduct,
      cell: (row) => (
        <Link
          href={`/admin/products/${row.id}`}
          className="font-medium text-(--color-text) hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'sku',
      header: labels.colSku,
      cell: (row) => (
        <span className="text-(--color-text-muted) tabular-nums">{row.skuSummary}</span>
      ),
    },
    {
      key: 'category',
      header: labels.colCategory,
      cell: (row) => row.categoryName ?? '—',
    },
    {
      key: 'brand',
      header: labels.colBrand,
      cell: (row) => row.brandName ?? '—',
    },
    {
      key: 'price',
      header: labels.colPrice,
      align: 'end',
      cell: (row) =>
        row.price ? (
          <span className="inline-flex items-center gap-2 tabular-nums">
            <span>{row.price}</span>
            {row.compareAtPrice ? (
              <s className="text-(--color-text-subtle)">{row.compareAtPrice}</s>
            ) : null}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'stock',
      header: labels.colStock,
      cell: (row) =>
        row.stockStatus ? (
          <StatusBadge label={stockLabel[row.stockStatus]} tone={STOCK_TONE[row.stockStatus]} />
        ) : (
          '—'
        ),
    },
    {
      key: 'status',
      header: labels.status,
      cell: (row) => <StatusBadge label={statusLabel[row.status]} tone={STATUS_TONE[row.status]} />,
    },
    {
      key: 'updatedAt',
      header: labels.updatedAt,
      align: 'end',
      cell: (row) => (
        <span className="text-(--color-text-muted) tabular-nums">{row.updatedAt}</span>
      ),
    },
  ];

  function goToPage(next: number): void {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) params.delete('page');
    else params.set('page', String(next));
    const search = params.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        emptyTitle={labels.emptyTitle}
        emptyDescription={labels.emptyDescription}
        selectAllLabel={labels.actions}
        selectRowLabel={labels.actions}
      />

      {pageCount > 1 ? (
        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={goToPage}
          className="justify-end"
          labels={{
            previous: labels.previousPage,
            next: labels.nextPage,
            page: (n) => labels.pageLabel.replace('{n}', String(n)),
          }}
        />
      ) : null}
    </div>
  );
}

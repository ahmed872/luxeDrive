import { AppError } from '@/modules/core';

/**
 * Prisma's unique-violation code (P2002), turned into the platform's one
 * error type, so a caller never needs to know a database driver is involved.
 * Shared across every catalog service that has a unique column (slug, SKU,
 * category+key, …).
 */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

export function mapUniqueConstraint(error: unknown, field: string): AppError {
  if (isUniqueConstraintError(error)) {
    return new AppError('CONFLICT', {
      cause: error,
      details: { field },
      internalMessage: `${field} already exists`,
    });
  }
  return error instanceof AppError ? error : new AppError('INTERNAL', { cause: error });
}

import { AppError } from '@/modules/core';

/** Same pattern as `catalog/prisma-errors.ts` — Prisma's unique-violation
 * code, turned into the platform's one error type. */
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

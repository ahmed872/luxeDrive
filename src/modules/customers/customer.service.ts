import 'server-only';

import type { Customer } from '@generated/prisma';

import { db } from '@/modules/core';

/**
 * The `Customer` row behind a signed-in `User`.
 *
 * P09 needs this much of `customers` and no more: a cart owned by a
 * customer references `Customer`, not `User`, so signing in has to be able
 * to find — or open — that row. Everything else this module will own
 * (addresses, wishlist, reviews) is still P10's.
 *
 * Created on demand rather than at registration: a `User` who never shops
 * has no reason to have a customer record, and creating one lazily means
 * accounts that predate this phase work without a backfill.
 */
export async function resolveCustomerForUser(userId: string): Promise<Customer> {
  const existing = await db.customer.findUnique({ where: { userId } });
  if (existing) return existing;

  // `upsert` rather than `create`: two requests from the same person can
  // arrive together (a page load and its own cart fetch), and the unique
  // index on `user_id` would turn the loser into a 500.
  return db.customer.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function findCustomerForUser(userId: string): Promise<Customer | null> {
  return db.customer.findUnique({ where: { userId } });
}

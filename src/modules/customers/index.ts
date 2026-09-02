/**
 * `customers` — customer accounts, addresses, wishlist, reviews.
 *
 * May depend on: core, identity, catalog
 * Must not depend on: orders, payments
 *
 * P09 implements only the piece the cart needs: resolving the `Customer`
 * row behind a signed-in `User`, because a customer-owned cart references
 * `Customer`. Addresses, wishlist and reviews remain P10's.
 *
 * Other modules import `@/modules/customers`, never a file inside it.
 */

export { resolveCustomerForUser, findCustomerForUser } from './customer.service';

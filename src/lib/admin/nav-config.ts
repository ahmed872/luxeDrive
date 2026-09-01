import type { Role } from '@generated/prisma';
import type { Permission } from '@/modules/identity';
import { roleHasPermission } from '@/modules/identity';

import type { Locale } from '@/lib/i18n/locales';
import { getAdminDictionary } from '@/lib/i18n/admin-dictionary';

/**
 * Every eventual admin area (P07+), each named by the one `Permission` that
 * gates it — this is the "permission-aware navigation" P06 asks for, built
 * against the full permission set from day one so P07 only has to build the
 * pages, never re-derive who may see them. None of these `href`s point at
 * real management UI yet (P06 explicitly excludes that): each renders the
 * shared "coming soon" placeholder at `/admin/[section]`, which itself
 * calls `requirePermission` — the same server check this nav list encodes,
 * so a role that can't see a link server-side can't reach it by typing the
 * URL either (P06 §7/§17).
 */
export interface AdminSection {
  slug: string;
  permission: Permission;
  group: 'catalog' | 'sales' | 'store' | 'administration';
}

export const ADMIN_SECTIONS: readonly AdminSection[] = [
  { slug: 'products', permission: 'products.read', group: 'catalog' },
  { slug: 'categories', permission: 'categories.manage', group: 'catalog' },
  { slug: 'brands', permission: 'brands.manage', group: 'catalog' },
  { slug: 'inventory', permission: 'inventory.read', group: 'catalog' },
  // P08. `products.update`, not `inventory.*`: changing what something costs
  // is a catalog write, which is why STAFF can count stock but not reprice.
  { slug: 'pricing', permission: 'products.update', group: 'catalog' },
  { slug: 'orders', permission: 'orders.read', group: 'sales' },
  { slug: 'customers', permission: 'customers.read', group: 'sales' },
  { slug: 'discounts', permission: 'discounts.manage', group: 'sales' },
  { slug: 'content', permission: 'content.manage', group: 'store' },
  { slug: 'analytics', permission: 'analytics.read', group: 'store' },
  { slug: 'settings', permission: 'settings.manage', group: 'store' },
  { slug: 'users', permission: 'users.manage', group: 'administration' },
];

export function getAdminSection(slug: string): AdminSection | undefined {
  return ADMIN_SECTIONS.find((section) => section.slug === slug);
}

export interface AdminNavItemConfig {
  key: string;
  label: string;
  href: string;
}

export interface AdminNavSectionConfig {
  key: string;
  label?: string;
  items: AdminNavItemConfig[];
}

/**
 * The sidebar's data, filtered to exactly what `role` may use — never
 * rendered-then-hidden. `Sidebar` (P02) only draws what it's given, so a
 * permission this role lacks never becomes a link at all, in either
 * language.
 */
export function buildAdminNavSections(role: Role, locale: Locale): AdminNavSectionConfig[] {
  const t = getAdminDictionary(locale);

  const dashboard: AdminNavSectionConfig = {
    key: 'overview',
    items: [{ key: 'dashboard', label: t.shell.dashboard, href: '/admin' }],
  };

  const groupOrder = ['catalog', 'sales', 'store', 'administration'] as const;
  const groups = groupOrder.map((group) => ({
    key: group,
    label: t.navGroups[group],
    items: ADMIN_SECTIONS.filter(
      (section) => section.group === group && roleHasPermission(role, section.permission),
    ).map((section) => ({
      key: section.slug,
      label: t.sections[section.slug as keyof typeof t.sections],
      href: `/admin/${section.slug}`,
    })),
  }));

  return [dashboard, ...groups.filter((group) => group.items.length > 0)];
}

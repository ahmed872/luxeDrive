'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Boxes, ClipboardList, Users2, Percent, FileText, BarChart3, Settings, ShieldCheck, type LucideIcon } from 'lucide-react';

import { Sidebar, type SidebarSection } from '@/components/admin/sidebar';
import type { AdminNavSectionConfig } from '@/lib/admin/nav-config';

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  products: Package,
  categories: Tag,
  brands: Tag,
  inventory: Boxes,
  orders: ClipboardList,
  customers: Users2,
  discounts: Percent,
  content: FileText,
  analytics: BarChart3,
  settings: Settings,
  users: ShieldCheck,
};

export interface AdminSidebarNavProps {
  sections: AdminNavSectionConfig[];
  navLabel: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * The only client piece of the admin shell's navigation: which link is
 * "current" depends on the pathname, and there is no server API for that
 * inside a layout — everything else (which sections/items exist at all,
 * per the caller's role) is decided server-side in `nav-config.ts` and
 * passed down as plain data.
 */
export function AdminSidebarNav({ sections, navLabel, header, footer }: AdminSidebarNavProps) {
  const pathname = usePathname();

  const sidebarSections: SidebarSection[] = sections.map((section) => ({
    key: section.key,
    label: section.label,
    items: section.items.map((item) => ({
      key: item.key,
      label: item.label,
      href: item.href,
      icon: ICONS[item.key] ?? LayoutDashboard,
      active: item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href),
    })),
  }));

  return <Sidebar sections={sidebarSections} navLabel={navLabel} header={header} footer={footer} />;
}

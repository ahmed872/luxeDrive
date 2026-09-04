import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Construction } from 'lucide-react';

import { getAdminSection } from '@/lib/admin/nav-config';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isLocale } from '@/lib/i18n/locales';
import { getAdminDictionary } from '@/lib/i18n/admin-dictionary';
import { requireAdminPermission } from '@/lib/admin/require-admin';
import { AdminBreadcrumbs } from '@/components/admin/admin-breadcrumbs';
import { PageHeader } from '@/components/admin/page-header';

interface PageParams {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { section } = await params;
  const config = getAdminSection(section);
  if (!config) return {};
  const t = getAdminDictionary(DEFAULT_LOCALE);
  return { title: t.sections[config.slug as keyof typeof t.sections] };
}

/**
 * The shared placeholder for the nav items that have no screen of their
 * own. A concrete route always wins over this catch-all, so a section
 * lands here only while it genuinely has nothing built — as of P14 that is
 * `customers`, `content`, `analytics` and `settings`, each a whole domain
 * (customer administration, homepage/CMS authoring, reporting, store
 * configuration) rather than a missing button, and none of them in any
 * phase's scope so far. It says so plainly instead of showing an empty
 * table that looks broken, or a fake one that lies.
 *
 * What this route proves for real: `requirePermission` runs here on every
 * render, regardless of whether the sidebar ever showed a link to this URL
 * — a role without the section's permission gets a server-thrown
 * `FORBIDDEN` before any protected content renders (Next's default error
 * handling takes it from there), exactly like every other admin boundary
 * (P06 §7/§8/§17's "hidden UI is not authorization"). The security test
 * matrix calls this exact path directly to verify the throw, not just that
 * the link is hidden.
 */
export default async function AdminSectionPlaceholderPage({ params }: PageParams) {
  const { section } = await params;
  const config = getAdminSection(section);
  if (!config) notFound();

  await requireAdminPermission(config.permission);

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const t = getAdminDictionary(locale);
  const sectionLabel = t.sections[config.slug as keyof typeof t.sections];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={sectionLabel}
        breadcrumb={
          <AdminBreadcrumbs dashboardLabel={t.shell.dashboard} trail={[{ label: sectionLabel }]} />
        }
      />

      <div className="flex flex-col items-center gap-3 rounded-(--radius-container) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-16 text-center">
        <Construction className="size-8 text-(--color-text-subtle)" aria-hidden="true" />
        <p className="text-h6 font-semibold text-(--color-text)">{t.shell.comingSoonTitle}</p>
        <p className="max-w-sm text-small text-(--color-text-muted)">{t.shell.comingSoonBody}</p>
      </div>
    </div>
  );
}

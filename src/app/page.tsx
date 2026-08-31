import { formatMoney } from '@/modules/core/money';

/**
 * Foundation status page.
 *
 * Deliberately not a storefront: P01 builds no commerce surface. This page
 * exists so the production build renders something real, and so the money
 * formatter and the token layer are exercised end to end.
 */

const FOUNDATION = [
  { key: 'framework', label: 'Next.js App Router + TypeScript strict' },
  { key: 'styling', label: 'Tailwind v4 + design tokens' },
  { key: 'database', label: 'PostgreSQL + Prisma migrations' },
  { key: 'modules', label: '15 module boundaries, no cycles' },
  { key: 'quality', label: 'typecheck · lint · tests · build in CI' },
] as const;

export default function FoundationPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <p className="text-sm tracking-widest text-(--color-text-muted) uppercase">Phase 01</p>
        <h1 className="text-3xl font-bold text-(--color-text)">LuxeDrive — الأساس التقني</h1>
        <p className="text-(--color-text-muted)">
          لا توجد واجهة متجر بعد. هذه الصفحة تثبت أن الأساس يبني ويعمل فقط.
        </p>
      </header>

      <ul className="flex flex-col gap-px overflow-hidden rounded-(--radius-surface) border border-(--color-border) bg-(--color-border)">
        {FOUNDATION.map((item) => (
          <li key={item.key} className="bg-(--color-surface) px-4 py-3 text-sm text-(--color-text)">
            {item.label}
          </li>
        ))}
      </ul>

      <footer className="text-sm text-(--color-text-muted)">
        تنسيق العملة الافتراضي: <span className="font-medium">{formatMoney(125_000_00)}</span>
      </footer>
    </main>
  );
}

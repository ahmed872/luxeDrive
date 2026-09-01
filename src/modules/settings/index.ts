/**
 * `settings` — store settings, branding, shipping and notification configuration.
 *
 * May depend on: core, media
 * Must not depend on: every domain module
 *
 * P05: the read side — `getStoreSettings()`, the single source of truth for
 * store name, currency, branding and SEO defaults across the storefront.
 * Admin-authored writes (a settings form) land later; nothing here builds one.
 *
 * Other modules import `@/modules/settings`, never a file inside it.
 */

export { getStoreSettings, type StoreSettingsView } from './store-settings.service';

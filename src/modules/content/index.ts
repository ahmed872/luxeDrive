/**
 * `content` — homepage sections, banners, navigation. A typed section registry, not a page builder.
 *
 * May depend on: core, media, catalog
 * Must not depend on: orders, cart, payments
 *
 * P05: the storefront read side — `getPublishedHomepageSections()` renders
 * only published, enabled sections (`HomepageSection.config`, never
 * `draftConfig`), with every referenced category/product/media id already
 * resolved. Admin CMS editing (writing sections, draft/publish workflow)
 * lands in a later phase; nothing here builds one.
 *
 * Other modules import `@/modules/content`, never a file inside it.
 */

export {
  getPublishedHomepageSections,
  TRUST_BLOCK_ICONS,
  type HomepageSectionView,
  type HeroSectionView,
  type BannerSectionView,
  type FeaturedCategoriesSectionView,
  type ProductRailSectionView,
  type TestimonialsSectionView,
  type TrustBlocksSectionView,
  type TrustBlockIcon,
  type CustomPromoSectionView,
} from './homepage.service';

export { sectionConfigSchemas, type SectionConfig } from './section-schemas';

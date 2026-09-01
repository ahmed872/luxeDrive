/**
 * `catalog` — products, categories, brands, attribute definitions, variants.
 *
 * May depend on: core, media
 * Must not depend on: cart, orders, pricing, payments — the catalog knows nothing about selling
 *
 * P03: full domain implementation. Product is generic — nothing here or in
 * the schema is specific to any one kind of product; a category's
 * AttributeDefinition rows are what make "cars" different from "shoes".
 * P05 adds the read side the storefront needs: `listProducts` (the one
 * query every browse surface goes through — category pages, and, wrapped by
 * `@/modules/search`, the search page), `getProductDetailBySlug`, and the
 * pure display-pricing/stock-status helpers.
 *
 * Other modules import `@/modules/catalog`, never a file inside it.
 */

export {
  createCategory,
  updateCategory,
  reorderCategories,
  getCategory,
  getCategoryBySlug,
  getAncestorChain,
  getCategoryTree,
  getDescendantCategoryIds,
  type CategoryNode,
} from './category.service';

export { createBrand, updateBrand, getBrand, getBrandBySlug, listBrands } from './brand.service';

export {
  createAttributeDefinition,
  updateAttributeDefinition,
  listAttributeDefinitions,
  getEffectiveAttributeDefinitions,
  buildAttributesSchema,
  validateProductAttributes,
} from './attribute.service';

export {
  createProduct,
  updateProduct,
  publishProduct,
  getProduct,
  getProductBySlug,
  type ProductWithVariants,
} from './product.service';

export {
  attachProductImage,
  detachProductImage,
  setPrimaryProductImage,
  reorderProductImages,
  listProductImages,
} from './product-image.service';

export {
  listProducts,
  getFilterableAttributes,
  getRelatedProducts,
  type ProductListingQuery,
  type ProductListingSort,
  type ProductListingItem,
  type ProductListingResult,
  type FilterableAttribute,
} from './product-listing.service';

export {
  getProductDetailBySlug,
  getProductReviews,
  type ProductDetail,
  type ProductDetailVariant,
  type ProductDetailOption,
  type ProductDetailAttribute,
  type ProductReview,
} from './product-detail.service';

export { resolveEffectivePrice, resolveListingPrice, type EffectivePrice } from './variant-pricing';

export { resolveVariantStockStatus, type StockStatus } from './stock-status';

export {
  cartesianProduct,
  matchVariantsToCombinations,
  generateSku,
  type OptionValueRef,
} from './variant-combinations';

export { slugify, ensureUniqueSlug, slugSchema } from './slug';

export {
  categoryInputSchema,
  categoryUpdateSchema,
  brandInputSchema,
  brandUpdateSchema,
  attributeTypeSchema,
  attributeDefinitionInputSchema,
  attributeDefinitionUpdateSchema,
  productStatusSchema,
  productCoreInputSchema,
  productUpdateSchema,
  productOptionInputSchema,
  variantInputSchema,
  createProductInputSchema,
  type CategoryInput,
  type CategoryUpdateInput,
  type BrandInput,
  type BrandUpdateInput,
  type AttributeTypeInput,
  type AttributeDefinitionInput,
  type AttributeDefinitionUpdateInput,
  type ProductCoreInput,
  type ProductUpdateInput,
  type ProductOptionInput,
  type VariantInput,
  type CreateProductInput,
} from './schemas';

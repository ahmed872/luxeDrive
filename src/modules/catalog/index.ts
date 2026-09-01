/**
 * `catalog` — products, categories, brands, attribute definitions, variants.
 *
 * May depend on: core, media
 * Must not depend on: cart, orders, pricing, payments — the catalog knows nothing about selling
 *
 * P03: full domain implementation. Product is generic — nothing here or in
 * the schema is specific to any one kind of product; a category's
 * AttributeDefinition rows are what make "cars" different from "shoes".
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

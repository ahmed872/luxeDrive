import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import {
  getProduct,
  getCategoryTree,
  listBrands,
  getEffectiveAttributeDefinitions,
  listProductImages,
  type CategoryNode,
} from '@/modules/catalog';
import { getMediaAsset, getMediaPublicUrl } from '@/modules/media';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isLocale, type Locale } from '@/lib/i18n/locales';
import { getAdminDictionary } from '@/lib/i18n/admin-dictionary';
import { requireAdminPermission } from '@/lib/admin/require-admin';
import { AdminBreadcrumbs } from '@/components/admin/admin-breadcrumbs';
import { PageHeader } from '@/components/admin/page-header';
import { FormSection } from '@/components/admin/form-section';
import { ProductForm, type ProductOption } from '@/components/admin/product-form';
import {
  ProductImagesManager,
  type ProductImageRow,
} from '@/components/admin/product-images-manager';
import type { AttributeFieldDefinition } from '@/lib/admin/product-actions';

export const metadata: Metadata = { title: 'Edit product' };

function flattenCategories(nodes: CategoryNode[], locale: Locale, depth = 0): ProductOption[] {
  return nodes.flatMap((node) => [
    {
      value: node.id,
      label: `${'— '.repeat(depth)}${locale === 'ar' ? node.nameAr : node.nameEn}`,
    },
    ...flattenCategories(node.children, locale, depth + 1),
  ]);
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('products.update');
  const { id } = await params;

  const product = await getProduct(id);
  if (!product || product.deletedAt) notFound();

  const [tree, brands, definitions, images] = await Promise.all([
    getCategoryTree(),
    listBrands(),
    getEffectiveAttributeDefinitions(product.categoryId),
    listProductImages(product.id),
  ]);

  const imageRows: ProductImageRow[] = [];
  for (const image of images) {
    const asset = await getMediaAsset(image.mediaId);
    if (!asset) continue;
    imageRows.push({
      id: image.id,
      mediaId: image.mediaId,
      src: getMediaPublicUrl(asset),
      alt: '',
      isPrimary: image.isPrimary,
    });
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const t = getAdminDictionary(locale);
  const productLabel = locale === 'ar' ? product.nameAr : product.nameEn;

  const initialAttributeDefinitions: AttributeFieldDefinition[] = definitions.map((definition) => ({
    id: definition.id,
    key: definition.key,
    labelAr: definition.labelAr,
    labelEn: definition.labelEn,
    type: definition.type,
    unit: definition.unit,
    allowedValues: (definition.allowedValues as string[] | null) ?? null,
    required: definition.required,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t.products.editProduct}
        description={productLabel}
        breadcrumb={
          <AdminBreadcrumbs
            dashboardLabel={t.shell.dashboard}
            trail={[{ label: t.products.title, href: '/admin/products' }, { label: productLabel }]}
          />
        }
      />

      <ProductForm
        locale={locale}
        categoryOptions={flattenCategories(tree, locale)}
        brandOptions={brands.map((brand) => ({
          value: brand.id,
          label: locale === 'ar' ? brand.nameAr : brand.nameEn,
        }))}
        initialAttributeDefinitions={initialAttributeDefinitions}
        product={{
          id: product.id,
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          slug: product.slug,
          descriptionAr: product.descriptionAr,
          descriptionEn: product.descriptionEn,
          categoryId: product.categoryId,
          brandId: product.brandId,
          featured: product.featured,
          attributes: (product.attributes as Record<string, unknown> | null) ?? {},
          seoTitleAr: product.seoTitleAr,
          seoTitleEn: product.seoTitleEn,
          seoDescriptionAr: product.seoDescriptionAr,
          seoDescriptionEn: product.seoDescriptionEn,
          updatedAt: product.updatedAt.toISOString(),
        }}
        labels={{
          sectionBasic: t.products.sectionBasic,
          sectionBasicDescription: t.products.sectionBasicDescription,
          sectionAttributes: t.products.sectionAttributes,
          sectionAttributesDescription: t.products.sectionAttributesDescription,
          sectionPricing: t.products.sectionPricing,
          sectionPricingDescription: t.products.sectionPricingDescription,
          sectionSeo: t.products.sectionSeo,
          sectionSeoDescription: t.products.sectionSeoDescription,
          nameAr: t.common.nameAr,
          nameEn: t.common.nameEn,
          slug: t.common.slug,
          slugHelp: t.common.slugHelp,
          descriptionAr: t.products.descriptionAr,
          descriptionEn: t.products.descriptionEn,
          category: t.products.category,
          brand: t.products.brand,
          noneOption: t.common.noneOption,
          featured: t.products.featured,
          sku: t.products.sku,
          skuHelp: t.products.skuHelp,
          price: t.products.price,
          priceHelp: t.products.priceHelp,
          attributesEmpty: t.products.attributesEmpty,
          selectCategoryFirst: t.products.selectCategoryFirst,
          seoTitleAr: t.products.seoTitleAr,
          seoTitleEn: t.products.seoTitleEn,
          seoDescriptionAr: t.products.seoDescriptionAr,
          seoDescriptionEn: t.products.seoDescriptionEn,
          save: t.common.save,
          saveDraft: t.common.saveDraft,
          saving: t.common.saving,
          cancel: t.common.cancel,
          requiredField: t.common.requiredField,
          createdSuccess: t.products.createdSuccess,
          updatedSuccess: t.products.updatedSuccess,
        }}
      />

      <div className="border-t border-(--color-border)">
        <FormSection
          title={t.products.sectionMedia}
          description={t.products.sectionMediaDescription}
        >
          <ProductImagesManager
            productId={product.id}
            locale={locale}
            images={imageRows}
            labels={{
              chooseFile: t.common.chooseFile,
              uploading: t.common.uploading,
              uploadError: t.common.uploadError,
              primaryImage: t.products.primaryImage,
              setPrimary: t.products.setPrimary,
              removeImage: t.products.removeImage,
              moveUp: t.products.moveUp,
              moveDown: t.products.moveDown,
              imagesEmpty: t.products.imagesEmpty,
              savedSuccessfully: t.common.savedSuccessfully,
              deletedSuccessfully: t.common.deletedSuccessfully,
            }}
          />
        </FormSection>
      </div>
    </div>
  );
}

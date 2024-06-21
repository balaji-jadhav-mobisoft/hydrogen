import {Suspense, useEffect, useState} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
  Video,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/lib/variants';
import NextIcon from '~/assets/right-arrow.png';
import PrevIcon from '~/assets/left-arrow.png';
import {BLOGS_QUERY} from './_index';
import GrasssRootMeets from '~/components/home-page/GrasssRootMeets';
import {PRODUCT_RECOMMENDATION} from '~/graphql/products-query/ProductRecommendationQuery';
import BestSellerReusable from '~/components/home-page/BestSellerReusable';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request, context}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions: getSelectedProductOptions(request)},
  });
  const blogs = await storefront.query(BLOGS_QUERY, {
    variables: {handle: 'grass-roots-meat'},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const recommendedProducts = await storefront.query(PRODUCT_RECOMMENDATION, {
    variables: {productId: product?.id},
  });

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variants, blogs, recommendedProducts});
}

/**
 * @param {{
 *   product: ProductFragment;
 *   request: Request;
 * }}
 */
function redirectToFirstVariant({product, request}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, variants, blogs, recommendedProducts} = useLoaderData();
  const {selectedVariant} = product;
  const [quantities, setQuantities] = useState([1]);

  useEffect(() => {
    variants &&
      setQuantities(
        new Array(variants?.product?.variants?.nodes.length).fill(1),
      );
  }, [variants]);

  const incrementQuantity = (index) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] += 1;
      return newQuantities;
    });
  };

  const decrementQuantity = (index) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = Math.max(1, newQuantities[index] - 1);
      return newQuantities;
    });
  };

  const handleQuantityChange = (index, value) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = value > 0 ? value : 1;
      return newQuantities;
    });
  };

  return (
    <>
      <div className="product">
        <ProductImage
          image={selectedVariant?.image}
          selectedVariant={selectedVariant}
        />
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
          quantities={quantities}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          handleQuantityChange={handleQuantityChange}
        />
      </div>
      <GrasssRootMeets blogs={blogs} isItWorkAvailable={true} />
      <div>
        <BestSellerReusable
          bestSellerCollection={recommendedProducts}
          title={'You may also like'}
        />
      </div>
    </>
  );
}

/**
 * @param {{image: ProductVariantFragment['image']}}
 */
function ProductImage({image, selectedVariant}) {
  if (!image) {
    return <div className="product-image" />;
  }

  if (!selectedVariant?.product.media) return null;

  const video = selectedVariant?.product.media.nodes[1]?.sources;
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = [
    {
      type: 'image',
      component: (
        <Image
          alt={image.altText || 'Product Image'}
          aspectRatio="1/1"
          data={image}
          key={image.id}
          sizes="(min-width: 15em) 50vw, 100vw"
          className="product-img"
        />
      ),
    },
    video && {
      type: 'video',
      component: <Video data={{sources: video}} className="product-video" />,
    },
  ].filter(Boolean);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1,
    );
  };

  return (
    <>
      {video ? (
        <div className="product-carousel">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`product-card ${
                index === currentIndex ? 'active-slide' : ''
              }`}
            >
              {item.component}
            </div>
          ))}

          <img
            onClick={prevSlide}
            src={PrevIcon}
            height={25}
            width={25}
            className="product-carousel-btn prev-btn"
          />
          <img
            onClick={nextSlide}
            src={NextIcon}
            height={25}
            width={25}
            className="product-carousel-btn next-btn"
          />
        </div>
      ) : (
        <div className="product-image">
          {video && <Video data={{sources: video}} className="product-video" />}
          <Image
            alt={image.altText || 'Product Image'}
            aspectRatio="1/1"
            data={image}
            key={image.id}
            sizes="(min-width: 15em) 50vw, 100vw"
          />
        </div>
      )}
    </>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Promise<ProductVariantsQuery>;
 * }}
 */
function ProductMain({
  selectedVariant,
  product,
  variants,
  quantities,
  incrementQuantity,
  decrementQuantity,
  handleQuantityChange,
}) {
  const {title, descriptionHtml} = product;

  return (
    <div className="product-main">
      <h1 style={{color: '#607556'}}>{title}</h1>
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
            quantities={quantities}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            handleQuantityChange={handleQuantityChange}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
              quantities={quantities}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              handleQuantityChange={handleQuantityChange}
            />
          )}
        </Await>
      </Suspense>
      <br />
      <br />
      <p>
        <strong>Description</strong>
      </p>
      <br />
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <br />
    </div>
  );
}

/**
 * @param {{
 *   selectedVariant: ProductFragment['selectedVariant'];
 * }}
 */
function ProductPrice({selectedVariant}) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
function ProductForm({
  product,
  selectedVariant,
  variants,
  quantities,
  incrementQuantity,
  decrementQuantity,
  handleQuantityChange,
}) {
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      {/* <div className="add-to-cart-section"> */}
      <div className="product-quantity-controls-section">
        <div className="product-quantity-controls">
          <button
            className="product-quantity-btn"
            onClick={() => decrementQuantity(0)}
          >
            -
          </button>
          <input
            type="text"
            className="product-quantity-input"
            value={quantities[0]}
            onChange={(e) =>
              handleQuantityChange(0, parseInt(e.target.value, 10))
            }
          />
          <button
            className="product-quantity-btn"
            onClick={() => incrementQuantity(0)}
          >
            +
          </button>
        </div>
        <div className="product-add-to-cart-section">
          <AddToCartButton
            className={'product-add-to-cart-section1'}
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              window.location.href =
                window.location.href +
                `${
                  window.location.href.includes('#')
                    ? 'cart-aside'
                    : '#cart-aside'
                }`;
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: quantities[0],
                    },
                  ]
                : []
            }
            quantity={quantities[0]}
          >
            {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
          </AddToCartButton>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

/**
 * @param {{option: VariantOption}}
 */
function ProductOptions({option}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: CartLineInput[];
 *   onClick?: () => void;
 * }}
 */
function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  quantity,
  className,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <div className={className}>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <input name="quantity" type="hidden" value={quantity} />
          <button
            type="submit"
            className="product-add-to-cart-btn"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </div>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
      media(first: 10) {
      nodes {
        ... on Video {
          sources {
            url
            mimeType
            format
          }
        }
      }
    }
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantsQuery} ProductVariantsQuery */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineInput} CartLineInput */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

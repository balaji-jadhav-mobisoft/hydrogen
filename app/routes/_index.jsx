import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import BackInStockCollectionData from '~/components/BackInStockCollection';
import CollectionCard from '~/components/CollectionCard';
import ShopSelectCuts from '~/components/home-page/ShopSelectCuts';
import GrasssRootMeets from '~/components/home-page/GrasssRootMeets';
import BestSellerCollection from '~/components/home-page/BestSellerCollection';
import PowerOfCoOpBlog from '~/components/home-page/PowerOfCoOpBlog';
import CoOpBlog from '~/components/home-page/CoOpBlog';
import ChefSpecialCollection from '~/components/home-page/ChefSpecialCollection';
import SeeOnSection from '~/components/home-page/SeeOnSection';
import NewRecipesBlog from '~/components/home-page/NewRecipesBlog';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const handle = 'back-in-stock';
  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle},
  });
  const allCollectionsResult = await storefront.query(ALL_COLLECTIONS_QUERY, {
    variables: {first: 4, reverse: true},
  });
  const blogs = await storefront.query(BLOGS_QUERY, {
    variables: {handle: 'grass-roots-meat'},
  });
  const chefSpecialCollection = await storefront.query(
    BEST_SELLER_COLLECTION_QUERY,
    {
      variables: {handle: 'chef-specials'},
    },
  );
  const thePowerOfCoOpBlog = await storefront.query(BLOGS_QUERY, {
    variables: {handle: 'the-power-of-co-op'},
  });
  const newRecipesBlog = await storefront.query(BLOGS_QUERY, {
    variables: {handle: 'our-newest-recipes'},
  });
  const coOpBlog = await storefront.query(BLOGS_QUERY, {
    variables: {handle: 'the-co-op'},
  });
  const allCollections = allCollectionsResult.collections;

  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const bestSellerCollection = await storefront.query(
    BEST_SELLER_COLLECTION_QUERY,
    {variables: {handle: 'bestsellers'}},
  );
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({
    featuredCollection,
    recommendedProducts,
    collection,
    allCollections,
    blogs,
    bestSellerCollection,
    thePowerOfCoOpBlog,
    coOpBlog,
    chefSpecialCollection,
    newRecipesBlog,
  });
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <BackInStockCollection collection={data.collection} />
      <ShopSelectCuts allCollections={data.allCollections} />
      <GrasssRootMeets blogs={data.blogs} />
      <BestSellerCollection bestSellerCollection={data.bestSellerCollection} />
      <PowerOfCoOpBlog thePowerOfCoOpBlog={data.thePowerOfCoOpBlog} />
      <ChefSpecialCollection
        chefSpecialCollection={data.chefSpecialCollection}
      />
      <SeeOnSection />
      <CoOpBlog coOpBlog={data.coOpBlog} />
      <NewRecipesBlog
        newRecipesBlog={data.newRecipesBlog}
        showReadMoreButton={true}
      />
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
// function FeaturedCollection({collection}) {
//   if (!collection) return null;
//   const image = collection?.image;
//   return (
//     <Link
//       className="featured-collection"
//       to={`/collections/${collection.handle}`}
//     >
//       {image && (
//         <div className="featured-collection-image">
//           <Image data={image} sizes="100vw" />
//         </div>
//       )}
//       <h1>{collection.title}</h1>
//     </Link>
//   );
// }
function BackInStockCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <div className="featured-collection">
      {image && (
        <div className="featured-collection-image">
          <Image
            aria-label="Featured Collection Image"
            data={image}
            src={image.url}
            sizes="100vw"
          />
        </div>
      )}
      <div className="back-in-stock-desktop">
        <CollectionCard collection={collection} />
      </div>
      <div className="back-in-stock-mobile">
        <BackInStockCollectionData collection={collection} />
      </div>
    </div>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  aria-label={`Shop ${product.title}`}
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    alt="recommended product image"
                    aria-label="Recommended Product Image"
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    descriptionHtml
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image {
      id
      url
      src
    }
    }
  }
`;
const BEST_SELLER_COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: 10) {
      nodes {
        title
        handle
        images(first: 10) {
          nodes {
            url
          }
        }
        priceRange {
          maxVariantPrice {
            amount
          }
        }
        variants(first: 10) {
          nodes {
            availableForSale
            weight
            weightUnit
            id
          }
        }
        options(first: 10) {
          values
          id
          name
        }
      }
    }
    }
  }
`;

const ALL_COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $first: Int
    $language: LanguageCode
    $reverse:Boolean!
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      reverse:$reverse
    ) {
      nodes {
        ...Collection
      }
    }
  }
`;

export const BLOGS_QUERY = `#graphql
  query Blogs(
    $language: LanguageCode
    $handle: String!
  ) @inContext(language: $language) {
    blog(handle: $handle) {
          title
          handle
          articles(first: 10) {
            edges {
              node {
                id
                contentHtml
                title
                handle
                image {
                  height
                  url
                }
              }
            }
          }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

import {useLoaderData, Link, useFetcher, useNavigate} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useEffect, useMemo, useRef, useState} from 'react';
import Breadcrumb from '~/components/common/Breadcrumb';
import CollectionHandleProducts from '~/components/collection-handle-products/CollectionHandleProducts';
import LoaderIcon from '~/assets/loader.gif';
import NewRecipesBlog from '~/components/home-page/NewRecipesBlog';
import {json, redirect} from '@shopify/remix-oxygen';
import {getPaginationVariables} from '@shopify/hydrogen';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {handle} = params;
  const {storefront} = context;

  const url = new URL(request.url);
  const sort_by = url.searchParams.get('sort_by');
  const reverse = getReverseFromQuery(sort_by);

  const sortKey = getSortKeyFromQuery(sort_by);

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      ...paginationVariables,
      sortKey: sortKey,
      reverse: reverse,
    },
  });

  const newRecipesBlog = await storefront.query(BLOGS_QUERY, {
    variables: {handle: 'our-newest-recipes'},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return json({collection, newRecipesBlog});
}

function getSortKeyFromQuery(sort_by) {
  switch (sort_by) {
    case 'DATE_NEW_TO_OLD':
      return 'CREATED';
    case 'DATE_OLD_TO_NEW':
      return 'CREATED';
    case 'PRICE_HIGH_TO_LOW':
      return 'PRICE';
    case 'PRICE_LOW_TO_HIGH':
      return 'PRICE';
    default:
      return 'BEST_SELLING';
  }
}

function getReverseFromQuery(sort_by) {
  switch (sort_by) {
    case 'DATE_NEW_TO_OLD':
    case 'PRICE_LOW_TO_HIGH':
      return false;
    case 'DATE_OLD_TO_NEW':
    case 'PRICE_HIGH_TO_LOW':
      return true;
    default:
      return false;
  }
}
export default function Collection() {
  const {collection, newRecipesBlog} = useLoaderData();
  const [products, setProducts] = useState(collection.products.nodes);
  const [pageInfo, setPageInfo] = useState(collection.products.pageInfo);
  const [loading, setLoading] = useState(false);
  const fetcher = useFetcher();
  const loadMoreRef = useRef(null);
  const [sortBy, setSortBy] = useState('BEST_SELLING');
  const [reverse, setReverse] = useState(false);

  const navigate = useNavigate();

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    let newReverse = false;

    if (newSortBy === 'PRICE_LOW_TO_HIGH' || newSortBy === 'DATE_NEW_TO_OLD') {
      newReverse = false;
    } else if (
      newSortBy === 'PRICE_HIGH_TO_LOW' ||
      newSortBy === 'DATE_OLD_TO_NEW'
    ) {
      newReverse = true;
    }

    setReverse(newReverse);
    navigate(
      `/collections/${collection.handle}?sort_by=${newSortBy}&reverse=${newReverse}`,
    );
  };

  // Function to load more products based on pagination
  const loadMoreProducts = () => {
    if (!pageInfo.hasNextPage || loading || fetcher.state !== 'idle') return;

    setLoading(true);

    const url = `/collections/${collection.handle}/pagination?cursor=${pageInfo.endCursor}&sort_by=${sortBy}&reverse=${reverse}`;

    fetcher.load(url, {
      method: 'GET',
    });
  };

  // Update products state when fetcher data changes
  useEffect(() => {
    if (fetcher.data) {
      setTimeout(() => {
        const newProducts = fetcher.data.collection.products.nodes.filter(
          (newProduct) =>
            !products.some(
              (existingProduct) => existingProduct.id === newProduct.id,
            ),
        );
        setProducts((prev) => [...prev, ...newProducts]);
        setPageInfo(fetcher.data.collection.products.pageInfo);
        setLoading(false);
      }, 2000); // 2-second delay (optional)
    }
  }, [fetcher.data]);

  // Intersection Observer to load more products when scrolled to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      },
    );

    const target = loadMoreRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loadMoreRef, pageInfo, fetcher.state, loading]);

  const breadcrumbItems = [
    {title: 'Home', path: '/'},
    {title: 'Collections', path: '/collections'},
    {title: collection.title, path: `/collections/${collection.handle}`},
  ];

  useEffect(() => {
    setProducts(collection.products.nodes);
  }, [collection.products.nodes]);

  const image = collection?.image;

  return (
    <div className="collection">
      <div className="collection-image-section">
        {image && (
          <div className="collection-detail-image">
            <Image
              aria-label="Collection Image"
              data={image}
              src={image.url}
              sizes="100vw"
            />
          </div>
        )}
        <h1 className="collection-details-title">{collection.title}</h1>
      </div>
      <main
        dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
        className="collection-details-description"
      ></main>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Breadcrumb items={breadcrumbItems} />
        <div className="sorting-controls">
          <select value={sortBy} onChange={handleSortChange}>
            <option value="BEST_SELLING">Best Selling</option>
            <option value="PRICE_LOW_TO_HIGH">Price, low to high</option>
            <option value="PRICE_HIGH_TO_LOW">Price, high to low</option>
            <option value="DATE_NEW_TO_OLD">Date, new to old</option>
            <option value="DATE_OLD_TO_NEW">Date, old to new</option>
          </select>
        </div>
      </div>
      <ProductsGrid products={products} />
      {loading && (
        <div className="loader">
          <img src={LoaderIcon} alt="Loading..." />
        </div>
      )}
      <div ref={loadMoreRef} style={{height: '20px'}}></div>
      <div>
        <NewRecipesBlog
          newRecipesBlog={newRecipesBlog}
          showReadMoreButton={false}
        />
      </div>
    </div>
  );
}

function ProductsGrid({products}) {
  return (
    <div className="products-grid">
      <CollectionHandleProducts products={products} />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    createdAt
    variants(first: 1) {
      nodes {
        availableForSale
        weight
        weightUnit
        id
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $first: Int
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image {
        url
      }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const BLOGS_QUERY = `#graphql
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

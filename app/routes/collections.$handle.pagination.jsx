import {json} from '@shopify/remix-oxygen';

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
    variants(first: 1) {
      nodes {
        availableForSale
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
  query Collection($handle: String!, $first: Int, $after: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
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

export async function loader({request, params, context}) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const sort_by = url.searchParams.get('sort_by');
  const reverse = getReverseFromQuery(sort_by);
  const sortKey = getSortKeyFromQuery(sort_by);

  const paginationVariables = {
    handle,
    first: 8,
    after: cursor,
  };

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {...paginationVariables, sortKey: sortKey, reverse: reverse},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  return json({collection});
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

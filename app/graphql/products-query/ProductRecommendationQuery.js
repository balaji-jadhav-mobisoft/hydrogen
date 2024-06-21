export const PRODUCT_RECOMMENDATION = `#graphql
fragment RecommendedProductFields on Product {
    title
    availableForSale
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
    nodes {
      availableForSale
      id
      weightUnit
      weight
    }
  }
    images(first: 1) {
      nodes {
        url
        id
        altText
      }
    }
  }
  
  query MyQuery($country: CountryCode, $language: LanguageCode, $productId: ID!) @inContext(country: $country, language: $language) {
    productRecommendations(
      intent: RELATED
      productId: $productId
    ) {
      ...RecommendedProductFields
      handle
    }
  }
  `;

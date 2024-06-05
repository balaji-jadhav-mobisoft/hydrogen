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
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
    ) {
      nodes {
        ...Collection
      }
    }
  }
`;

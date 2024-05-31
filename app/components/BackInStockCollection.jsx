import {Link} from '@remix-run/react';
import React from 'react';

const BackInStockCollectionData = ({collection}) => {
  return (
    <>
      <p
        className="back-in-stock-collection-mobile"
        dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
      ></p>
      <Link to={`/collections/${collection.handle}`}>
        <button className="back-in-stock-collection-button">
          Shop Back In Stock
        </button>
      </Link>
    </>
  );
};

export default BackInStockCollectionData;

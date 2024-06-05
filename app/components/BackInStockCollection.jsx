import {Link} from '@remix-run/react';
import React, {useEffect, useState} from 'react';

const BackInStockCollectionData = ({collection}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <p
        className="back-in-stock-collection-mobile"
        dangerouslySetInnerHTML={{
          __html: isClient ? collection?.descriptionHtml : '',
        }}
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

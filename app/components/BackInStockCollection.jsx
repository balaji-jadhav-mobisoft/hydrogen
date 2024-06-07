import {Link} from '@remix-run/react';
import React, {useEffect, useState} from 'react';
import AppButton from './common/AppButton';

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
        <AppButton title={'Shop Back In Stock'} />
      </Link>
    </>
  );
};

export default BackInStockCollectionData;

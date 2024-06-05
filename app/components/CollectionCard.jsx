import React from 'react';
import './collectionCard.css';
import BackInStockCollectionData from './BackInStockCollection';

const CollectionCard = ({collection}) => {
  return (
    <div className="collection-card-section">
      <div className="collection-card">
        <BackInStockCollectionData collection={collection} />
      </div>
    </div>
  );
};

export default CollectionCard;

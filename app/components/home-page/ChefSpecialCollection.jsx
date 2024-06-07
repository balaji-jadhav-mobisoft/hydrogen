import React from 'react';
import BestSellerReusable from './BestSellerReusable';

const ChefSpecialCollection = ({chefSpecialCollection}) => {
  if (!chefSpecialCollection) return null;
  return (
    <BestSellerReusable
      title={'Chef Specials (up to 20% off!)'}
      bestSellerCollection={chefSpecialCollection}
    />
  );
};

export default ChefSpecialCollection;

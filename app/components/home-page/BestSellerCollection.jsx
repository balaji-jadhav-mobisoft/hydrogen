import BestSellerReusable from './BestSellerReusable';

const BestSellerCollection = ({bestSellerCollection}) => {
  if (!bestSellerCollection) return null;
  return (
    <BestSellerReusable
      title={'Shop Our Bestsellers'}
      bestSellerCollection={bestSellerCollection}
    />
  );
};

export default BestSellerCollection;

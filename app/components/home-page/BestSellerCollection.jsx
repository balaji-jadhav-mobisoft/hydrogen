import {Link} from '@remix-run/react';
import './bestSellerCollection.css';

const BestSellerCollection = ({bestSellerCollection}) => {
  if (!bestSellerCollection) return null;
  const {collection} = bestSellerCollection;
  console.log(collection, '=========');
  return (
    <div className="best-seller-main-section">
      <header className="home-page-title">
        <h3 className="h2">Shop Our Bestsellers</h3>
        <Link key={collection.id} to={`/collections/${collection.handle}`}>
          <h5 className="view-all-section">View All</h5>
        </Link>
      </header>
      <div>
        {collection?.products?.nodes.map((val) => {
          return <div key={val.title}></div>;
        })}
      </div>
    </div>
  );
};

export default BestSellerCollection;

import React, {Suspense} from 'react';
import './shopSelectCuts.css';
import {Image} from '@shopify/hydrogen';
import {Await, Link} from '@remix-run/react';

const ShopSelectCuts = ({allCollections}) => {
  if (!allCollections) return null;

  return (
    <div className="shop-select-section">
      <h1 className="shop-select-cuts-heading h2">Shop Select Cuts</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={allCollections}>
          {(resolvedCollections) => {
            return (
              <div className="shop-select-image-section">
                {resolvedCollections?.nodes.map((allCollection) => {
                  return (
                    <Link
                      aria-label={`Shop ${allCollection.title}`}
                      key={allCollection.id}
                      className="shop-select-image-link-section"
                      to={`/collections/${allCollection.handle}`}
                    >
                      <Image
                        aria-label="Shop Select Image"
                        alt="shop select image"
                        src={allCollection?.image?.url}
                        data={allCollection?.image?.url}
                        className="small-image"
                        sizes="(max-width: 600px) 100vw, 50vw"
                      />
                      <h4 className="collection-title ">
                        {allCollection.title}
                      </h4>
                    </Link>
                  );
                })}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export default ShopSelectCuts;

import React, {useEffect, useState} from 'react';
import './grassRootMeet.css';
import {Image} from '@shopify/hydrogen';

const GrasssRootMeets = ({blogs}) => {
  if (!blogs) return null;
  const {blog} = blogs;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <div className="grass-root-main-section ">
        <header className="section-header">
          <h3 className="section-header__title h2">
            Why Grass Roots Meat is Better
          </h3>
        </header>
        <div className="grass-root-image-section">
          {blog?.articles?.edges?.map((article, index) => {
            const {node} = article;
            return (
              <div key={index} className="grass-root-inner-section">
                <Image
                  className="grass-root-image"
                  src={node.image.url}
                  data={node.image.url}
                  sizes="(max-width: 600px) 100vw, 50vw"
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: isClient ? node.contentHtml : '',
                  }}
                ></p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="farming-done-section">
        <header className="farming-header-section">
          <h3 className="farming-header-title h2">Farming Done Right</h3>
        </header>
        <div className="farming-para-section">
          <p className="farming-para1">
            <em>
              <strong>
                Grass-fed and finished. Fair wage. Regeneratively farmed in the
                U.S.A.
              </strong>
            </em>
            <br />
            All our animals are raised on non-GMO pasture where they roam and
            feed—no antibiotics, no hormones. Living right results in meat
            that's richer in flavor and mountains more nutritious than
            conventionally raised meat.
          </p>
          <p className="farming-para1">
            As a co-op, we partner with farmers who practice regenerative
            farming which is better for the animals, the soil, the environment,
            and your health. Take a bite of Grass Roots' meat knowing that it is
            the most nutritious and best-tasting meat out there.
          </p>
        </div>
      </div>
    </>
  );
};

export default GrasssRootMeets;

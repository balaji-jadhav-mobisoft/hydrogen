import {Link} from '@remix-run/react';
import './bestSellerReusable.css';
import {CartForm, Image} from '@shopify/hydrogen';
import {useState} from 'react';

function AddToCartButton({
  analytics,
  children,
  quantity,
  disabled,
  lines,
  onClick,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <input name="quantity" type="hidden" value={quantity} />
          <button
            className="add-to-cart-btn"
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function BestSellerCard({val, index}) {
  const imageUrl = val?.images?.nodes[0]?.url;
  const sizeOption = val?.options?.find((option) => option.name === 'Size')
    ?.values[0];
  const price = val?.priceRange?.maxVariantPrice?.amount;
  const selectedVariant = val?.variants?.nodes[0];
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };
  return (
    <div key={index} className="best-seller-inner-section">
      <div className="best-seller-image-container">
        <Image
          alt="best seller image"
          aria-label="Best Seller Image"
          className="best-seller-image"
          src={imageUrl}
          data={imageUrl}
          sizes="(max-width: 600px) 100vw, 50vw"
        />
      </div>
      <div className="best-seller-size-section">
        <h5 className="best-seller-title">{val.title}</h5>
        <span>{sizeOption}</span>
      </div>
      <div className="best-seller-price">
        <Link
          key={val.id}
          to={`/products/${val.handle}`}
          aria-label={`Shop ${val.title}`}
        >
          ₹{price}
        </Link>
      </div>
      <div className="quantity-controls-section">
        <div className="quantity-controls">
          <button className="quantity-btn" onClick={decrementQuantity}>
            -
          </button>
          <input
            type="text"
            className="quantity-input"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <button className="quantity-btn" onClick={incrementQuantity}>
            +
          </button>
        </div>
        <div className="add-to-cart-section">
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              window.location.href =
                window.location.href +
                `${
                  window.location.href.includes('#')
                    ? 'cart-aside'
                    : '#cart-aside'
                }`;
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: quantity,
                    },
                  ]
                : []
            }
            quantity={quantity}
          >
            {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}

const BestSellerReusable = ({bestSellerCollection, title}) => {
  if (!bestSellerCollection) return null;
  const {collection} = bestSellerCollection;
  const {productRecommendations} = bestSellerCollection;
  return (
    <div className="best-seller-main-section">
      <header className="home-page-title">
        <h3 className="h2">{title}</h3>
        {collection && (
          <Link
            key={collection?.id}
            to={`/collections/${collection?.handle}`}
            aria-label={`Shop View All`}
          >
            <h5 className="view-all-section">View All</h5>
          </Link>
        )}
      </header>
      <div className="best-seller-section">
        {collection &&
          collection?.products?.nodes.map((val, index) => {
            return (
              <>
                <BestSellerCard val={val} index={index} />
              </>
            );
          })}
        {productRecommendations &&
          productRecommendations?.slice(0, 4).map((val, index) => {
            return (
              <>
                <BestSellerCard val={val} index={index} />
              </>
            );
          })}
      </div>
    </div>
  );
};

export default BestSellerReusable;

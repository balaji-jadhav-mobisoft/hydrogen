import {Link} from '@remix-run/react';
import './collectionHandleProducts.css';
import {CartForm, Image} from '@shopify/hydrogen';
import {useState, useEffect} from 'react';

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

const CollectionHandleProducts = ({products, loading}) => {
  if (!products) return null;

  const [quantities, setQuantities] = useState([]);

  useEffect(() => {
    setQuantities(products.map(() => 1));
  }, [products]);

  const incrementQuantity = (index) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] += 1;
      return newQuantities;
    });
  };

  const decrementQuantity = (index) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = Math.max(1, newQuantities[index] - 1);
      return newQuantities;
    });
  };

  const handleQuantityChange = (index, value) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = value > 0 ? value : 1;
      return newQuantities;
    });
  };

  return (
    <div className="collection-handle-main-section">
      <div className="collection-handle-section">
        {products?.map((val, index) => {
          const imageUrl = val?.featuredImage.url;
          const sizeOption = val?.options?.find(
            (option) => option.name === 'Size',
          )?.values[0];
          const price = val?.priceRange?.minVariantPrice?.amount;
          const selectedVariant = val?.variants?.nodes[0];
          const quantity = quantities[index];

          return (
            <div className="collection-handle-inner-section">
              <Link
                className="collection-product-details"
                key={val.id}
                to={`/products/${val.handle}`}
                aria-label={`Shop ${val.title}`}
              >
                <div className="collection-handle-image-container">
                  <Image
                    loading={index < 8 ? 'eager' : undefined}
                    alt="best seller image"
                    aria-label="Best Seller Image"
                    className="collection-handle-image"
                    src={imageUrl}
                    data={imageUrl}
                    sizes="(max-width: 600px) 100vw, 50vw"
                  />
                </div>
                <div className="collection-handle-size-section">
                  <h5 className="collection-handle-title">{val.title}</h5>
                  <span>{sizeOption}</span>
                </div>
                <div className="collection-handle-price">₹{price}</div>
              </Link>
              <div className="quantity-controls-section">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => decrementQuantity(index)}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="quantity-input"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value, 10))
                    }
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => incrementQuantity(index)}
                  >
                    +
                  </button>
                </div>
                <div className="collection-handle-add-to-cart-section">
                  <AddToCartButton
                    disabled={
                      !selectedVariant || !selectedVariant.availableForSale
                    }
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
                    {selectedVariant?.availableForSale
                      ? 'Add to cart'
                      : 'Sold out'}
                  </AddToCartButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionHandleProducts;

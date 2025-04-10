import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from 'graphql-request';

const GET_CART_ITEMS = `
  query GetCartItems {
    cart {
      id
      quantity
      product {
        id
        name
        price
        image
        attributes {
          name
          value
        }
      }
    }
  }
`;

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await request('http://localhost:8000/graphql', GET_CART_ITEMS);
        setItems(data.cart);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const UPDATE_CART_ITEM = `
        mutation UpdateCartItem($itemId: ID!, $quantity: Int!) {
          updateCartItem(itemId: $itemId, quantity: $quantity) {
            id
            quantity
          }
        }
      `;

      await request('http://localhost:8000/graphql', UPDATE_CART_ITEM, {
        itemId,
        quantity: newQuantity,
      });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const REMOVE_CART_ITEM = `
        mutation RemoveCartItem($itemId: ID!) {
          removeCartItem(itemId: $itemId)
        }
      `;

      await request('http://localhost:8000/graphql', REMOVE_CART_ITEM, {
        itemId,
      });

      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading cart: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Your cart is empty</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex space-x-8"
              data-testid={`cart-item-${item.id}`}
            >
              <div className="w-32 h-32 bg-gray-100 rounded">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-gray-400 mt-2">
                  ${item.product.price.toFixed(2)}
                </p>

                {item.product.attributes.map((attr) => (
                  <div
                    key={attr.name}
                    className="mt-2"
                    data-testid={`cart-item-attribute-${attr.name}`}
                  >
                    <span className="text-sm text-gray-400">{attr.name}:</span>{' '}
                    <span className="text-sm">{attr.value}</span>
                  </div>
                ))}

                <div className="flex items-center space-x-4 mt-4">
                  <button
                    className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    data-testid="decrease-quantity"
                  >
                    -
                  </button>
                  <span data-testid="item-quantity">{item.quantity}</span>
                  <button
                    className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    data-testid="increase-quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => handleRemoveItem(item.id)}
                data-testid="remove-item"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}

          <div className="border-t pt-8">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-medium" data-testid="cart-total">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              className="btn btn-primary w-full"
              data-testid="checkout-button"
            >
              Check Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart; 
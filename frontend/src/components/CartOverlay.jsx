import { useState } from 'react';
import { Link } from 'react-router-dom';

function CartOverlay({ onClose }) {
  const [items, setItems] = useState([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">My Bag</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-dark">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-400">${item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center"
                        onClick={() => {
                          setItems(items.map((i) =>
                            i.id === item.id
                              ? { ...i, quantity: Math.max(1, i.quantity - 1) }
                              : i
                          ));
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center"
                        onClick={() => {
                          setItems(items.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                          ));
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/cart"
                className="btn btn-secondary flex-1 text-center"
                onClick={onClose}
              >
                View Bag
              </Link>
              <button
                className="btn btn-primary flex-1"
                disabled={items.length === 0}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartOverlay; 
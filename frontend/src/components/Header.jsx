import { Link } from 'react-router-dom';
import { useState } from 'react';
import CartOverlay from './CartOverlay';

function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-8">
            <Link to="/" className="font-medium text-gray-400 hover:text-dark">
              All
            </Link>
            <Link to="/?category=tech" className="font-medium text-gray-400 hover:text-dark">
              Tech
            </Link>
            <Link to="/?category=clothes" className="font-medium text-gray-400 hover:text-dark">
              Clothes
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-full"
              data-testid="cart-btn"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {isCartOpen && <CartOverlay onClose={() => setIsCartOpen(false)} />}
    </header>
  );
}

export default Header; 
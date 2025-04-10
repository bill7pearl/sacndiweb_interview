import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from 'graphql-request';

const GET_PRODUCTS = `
  query GetProducts {
    products {
      id
      name
      price
      image
      inStock
      attributes {
        name
        value
      }
    }
  }
`;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await request('http://localhost:8000/graphql', GET_PRODUCTS);
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className={`card ${!product.inStock ? 'opacity-50' : ''}`}
          data-testid={`product-card-${product.id}`}
        >
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white font-medium">OUT OF STOCK</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-gray-400 mt-2">
              ${product.price.toFixed(2)}
            </p>
            {product.attributes.map((attr) => (
              <div
                key={attr.name}
                className="mt-2"
                data-testid={`product-attribute-${attr.name}`}
              >
                <span className="text-sm text-gray-400">{attr.name}:</span>{' '}
                <span className="text-sm">{attr.value}</span>
              </div>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductList; 
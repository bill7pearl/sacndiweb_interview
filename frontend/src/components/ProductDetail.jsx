import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { request } from 'graphql-request';

const GET_PRODUCT = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
      description
      image
      inStock
      attributes {
        name
        value
        type
        items {
          id
          value
          displayValue
        }
      }
    }
  }
`;

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await request('http://localhost:8000/graphql', GET_PRODUCT, { id });
        setProduct(data.product);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAttributeSelect = (attributeName, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

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
        <p className="text-red-500">Error loading product: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
          data-testid="product-gallery"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <span className="text-white font-medium">OUT OF STOCK</span>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-medium mb-4">{product.name}</h1>
        <p className="text-gray-400 mb-4">${product.price.toFixed(2)}</p>

        {product.attributes.map((attribute) => (
          <div key={attribute.name} className="mb-4">
            <h3 className="font-medium mb-2">{attribute.name}:</h3>
            <div className="flex flex-wrap gap-2">
              {attribute.items.map((item) => (
                <button
                  key={item.id}
                  className={`px-4 py-2 border rounded ${
                    selectedAttributes[attribute.name] === item.value
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                  onClick={() => handleAttributeSelect(attribute.name, item.value)}
                  data-testid={`product-attribute-${attribute.name}-${item.value}`}
                >
                  {item.displayValue}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8">
          <button
            className="btn btn-primary w-full"
            disabled={!product.inStock}
            data-testid="add-to-cart"
          >
            Add to Cart
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">Description</h2>
          <div className="prose max-w-none">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 
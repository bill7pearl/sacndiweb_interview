function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium mb-4">About Us</h3>
            <p className="text-gray-400">
              We are a leading eCommerce platform offering high-quality products
              with exceptional customer service.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-dark">
                  Home
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-400 hover:text-dark">
                  Cart
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-dark">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: info@scandiweb.com</li>
              <li className="text-gray-400">Phone: +1 (555) 123-4567</li>
              <li className="text-gray-400">
                Address: 123 Main St, New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Scandiweb. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 
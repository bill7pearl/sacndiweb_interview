CREATE DATABASE IF NOT EXISTS scandiweb;
USE scandiweb;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    type ENUM('book', 'furniture', 'dvd') NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS product_attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    attribute_name VARCHAR(50) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample data
INSERT INTO products (sku, name, price, type, in_stock) VALUES
('BOOK001', 'The Great Gatsby', 19.99, 'book', 1),
('FURN001', 'Wooden Chair', 99.99, 'furniture', 1),
('DVD001', 'Inception', 14.99, 'dvd', 1);

INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES
(1, 'weight', '0.5'),
(2, 'dimensions', '80x50x50'),
(3, 'size', '700'); 
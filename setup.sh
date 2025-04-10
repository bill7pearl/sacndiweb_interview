#!/bin/bash

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "PHP is not installed. Please install PHP 7.4 or higher."
    echo "Download from: https://windows.php.net/download/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed. Please install MySQL."
    echo "Download from: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "Composer is not installed. Please install Composer."
    echo "Download from: https://getcomposer.org/download/"
    exit 1
fi

echo "All required software is installed. Proceeding with setup..."

# Install PHP dependencies
echo "Installing PHP dependencies..."
cd backend
composer install
cd ..

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd frontend
npm install
cd ..

# Setup database
echo "Setting up database..."
read -p "Enter MySQL root password (leave empty if no password): " mysql_password
mysql -u root ${mysql_password:+-p$mysql_password} < database/setup.sql

echo "Setup complete!"
echo "To start the development servers:"
echo "1. Start PHP server: cd backend && php -S localhost:8000 -t public"
echo "2. Start React server: cd frontend && npm run dev"
echo "3. Access the website at: http://localhost:5173" 
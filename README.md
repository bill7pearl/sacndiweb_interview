# Scandiweb eCommerce Project

A modern eCommerce website built with PHP (backend) and React (frontend).

## Project Structure

```
├── backend/           # PHP backend
│   ├── src/          # Source code
│   ├── public/       # Public files
│   └── tests/        # PHPUnit tests
├── frontend/         # React frontend
│   ├── src/          # Source code
│   ├── public/       # Static files
│   └── tests/        # React testing
└── database/         # Database scripts and data
```

## Backend Requirements
- PHP 7.4+ or 8.1+
- MySQL 5.6+
- Composer for dependency management
- GraphQL for API

## Frontend Requirements
- React with Vite
- Functional Components
- Tailwind CSS for styling

## Getting Started

### Backend Setup
1. Install PHP dependencies:
```bash
cd backend
composer install
```

2. Configure database:
- Create MySQL database
- Import database schema
- Update database credentials in config

3. Start PHP development server:
```bash
php -S localhost:8000 -t public
```

### Frontend Setup
1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

## Testing
- Backend: PHPUnit
- Frontend: React Testing Library
- Auto QA Tool for validation

## Deployment
- Backend: 000webhost or similar
- Frontend: Static file hosting

## License
MIT 
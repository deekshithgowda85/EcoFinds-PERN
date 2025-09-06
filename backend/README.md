# EcoFinds Backend - Neon PostgreSQL Setup

## Prerequisites

- Node.js (v14 or higher)
- Neon PostgreSQL account

## Neon PostgreSQL Setup

### 1. Create a Neon Account

1. Go to [Neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 2. Get Your Database Connection String

1. In your Neon dashboard, go to the "Connection Details" section
2. Copy the connection string (it looks like this):
   ```
   postgresql://username:password@host/database?sslmode=require
   ```

### 3. Environment Configuration

1. Create a `.env` file in the backend directory:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Neon database URL:
   ```env
   DATABASE_URL=postgresql://your_username:your_password@your_host/your_database?sslmode=require
   JWT_SECRET=your_super_secret_jwt_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Initialize Database

```bash
npm run db:init
```

This will:

- Test the database connection
- Create all necessary tables
- Set up sample data (admin user, sample products)

### 6. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Database Schema

The application uses the following models:

- **Users**: Authentication and user management
- **Products**: Eco-friendly products
- **Electronics**: Sustainable electronic devices
- **Orders**: Customer orders
- **OrderItems**: Individual items in orders
- **DeliveryAddresses**: Customer delivery addresses

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products/products` - Get all products
- `GET /api/products/electronics` - Get all electronics
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders

## Default Admin Credentials

- Username: `admin`
- Email: `admin@ecofinds.com`
- Password: `admin123`

**⚠️ Remember to change the default admin password in production!**

## Troubleshooting

### Connection Issues

- Ensure your Neon database is running
- Check that the DATABASE_URL is correct
- Verify SSL settings in the connection string

### Migration Issues

If you encounter migration issues, you can force sync the database:

```bash
npm run db:sync
```

**Note**: This will recreate all tables and may cause data loss in development.

# B2B Marketplace Platform

A comprehensive B2B marketplace application with separate portals for Admin, Suppliers, and Sellers.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies

## Documentation

- **[QUICK_START.md](./QUICK_START.md)** - ⚡ Quick 5-minute setup guide
- **[WORKFLOW.md](./WORKFLOW.md)** - Complete product approval workflow documentation
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - API endpoints reference guide

## Quick Workflow Overview

```
Supplier → Adds Product → Admin Reviews → Admin Approves + Margin → Seller Sees Product
```

1. **Supplier** adds a product (status: pending)
2. **Admin** reviews in Product Management portal
3. **Admin** approves product and sets platform margin
4. **Product** becomes available to sellers with final price (base + margin)

See [WORKFLOW.md](./WORKFLOW.md) for detailed step-by-step process.

## Features

### Admin Portal
- User Management (Approve/Reject sellers and suppliers)
- Product Management (Approve/Reject products with margin setting)
- KYC Compliance Management
- Order Management
- Platform Margins Configuration
- Finance & Wallet Management
- Support & Helpdesk

### Supplier Portal
- Product Management (Add, Edit, Delete products)
- Order Management
- Wallet & Payments
- Notifications
- Profile Settings

### Seller Portal
- Browse Approved Products
- Order Management
- My Stores
- Delivery Management
- Payments & Wallet
- Account Settings

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd project
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Set up MongoDB

#### Option A: Local MongoDB Installation

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Windows:**
Download and install from: https://www.mongodb.com/try/download/community

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env` file with your MongoDB Atlas connection string

### 5. Environment Configuration

The `.env` file in the root directory contains all necessary environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d
NODE_ENV=development
PORT=5000

VITE_API_URL=http://localhost:5000/api
```

**Important:** Change the `JWT_SECRET` to a secure random string in production!

If using MongoDB Atlas, update the `MONGODB_URI` to your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/marketplace?retryWrites=true&w=majority
```

## Running the Application

### 1. Start MongoDB

If using local MongoDB:
```bash
# On Linux/Mac
sudo systemctl start mongod

# On Mac with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default Admin Account

After starting the application for the first time, you'll need to create an admin account through the signup page by selecting "Admin" as the role.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Admin Routes (Protected)
- `GET /api/admin/products` - Get all products
- `PUT /api/admin/products/:id/approve` - Approve product with margin
- `PUT /api/admin/products/:id/reject` - Reject product with reason

### Supplier Routes (Protected)
- `POST /api/supplier/products` - Create new product
- `GET /api/supplier/products` - Get supplier's products
- `PUT /api/supplier/products/:id` - Update product
- `DELETE /api/supplier/products/:id` - Delete product

### Seller Routes (Protected)
- `GET /api/seller/products` - Get approved products for sellers

## Project Structure

```
project/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   │   ├── admin/   # Admin portal pages
│   │   │   ├── seller/  # Seller portal pages
│   │   │   └── supplier/# Supplier portal pages
│   │   ├── App.jsx      # Main app component
│   │   └── main.tsx     # Entry point
│   └── index.html
├── .env                 # Environment variables
└── README.md           # This file
```

## Troubleshooting

### MongoDB Connection Issues

If you see "Error: connect ECONNREFUSED 127.0.0.1:27017":
- Make sure MongoDB is running: `sudo systemctl status mongod`
- Check MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`
- Verify MongoDB port: MongoDB default port is 27017

### Backend Not Starting

- Ensure all environment variables are set in `.env`
- Check if port 5000 is already in use: `lsof -i :5000`
- Verify Node.js version: `node --version` (should be v16+)

### Frontend Not Loading

- Clear browser cache and cookies
- Check browser console for errors
- Verify backend is running on http://localhost:5000
- Make sure `VITE_API_URL` in `.env` matches your backend URL

### Authentication Issues

- Clear browser cookies
- Check JWT_SECRET is set in `.env`
- Verify token is being sent in cookies (check Network tab in browser DevTools)

## Product Workflow

1. **Supplier adds a product** → Product status: `pending`
2. **Admin reviews product in Product Management**
3. **Admin approves with margin** → Product status: `approved`, Product available to sellers
4. **OR Admin rejects with reason** → Product status: `rejected`, Reason visible to supplier
5. **Sellers can browse and order approved products**

## Development

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Running in Production

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start backend/server.js --name marketplace-backend
```

## License

ISC

## Support

For issues and questions, please create an issue in the repository.

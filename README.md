# KYZEN APP

A comprehensive e-commerce platform connecting suppliers, sellers, and administrators with real-time features and multi-role management.

## 🚀 Project Overview

KYZEN APP is a full-stack e-commerce platform that facilitates business-to-business transactions with role-based access control, real-time notifications, and comprehensive order management.

### Key Features

- **Multi-Role System**: Suppliers, Sellers, Admins, and Super Admins
- **Real-time Communication**: Socket.IO integration for live updates
- **KYC Compliance**: Document verification system
- **Order Management**: Complete order lifecycle tracking
- **Wallet System**: Integrated payment and transaction management
- **Product Management**: Comprehensive catalog system
- **Dashboard Analytics**: Role-specific insights and reporting

## 🏗️ Architecture

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **UI Components**: Lucide React icons
- **Charts**: Recharts
- **Notifications**: React Toastify, SweetAlert2

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer
- **Real-time**: Socket.IO
- **CORS**: Enabled for cross-origin requests

## 📁 Project Structure

```
drop-central/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── socket/          # Socket.IO handlers
│   ├── uploads/         # File storage
│   └── utils/           # Helper functions
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route components
│   │   ├── store/       # Redux store & slices
│   │   └── utils/       # Helper functions
│   └── public/          # Static assets
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.local .env
```

4. Configure environment variables in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/drop-central
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

5. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
touch .env
```

4. Configure environment variables in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

5. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

```bash
npm run build
```

2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Update API endpoints for production

## 🧪 Testing

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm run test
```

## 📝 API Documentation

The backend provides a health check endpoint:

- `GET /api/health` - Server status check

For detailed API documentation, refer to the route files in `/backend/routes/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

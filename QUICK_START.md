# Quick Start Guide

## Product Approval Workflow - Visual Flow

```
┌─────────────┐
│  SUPPLIER   │
└──────┬──────┘
       │
       │ 1. Creates Product
       │    POST /api/supplier/products
       │    { name, price, gst, stock }
       │
       ▼
┌─────────────────────────┐
│  PRODUCT CREATED        │
│  Status: PENDING        │
│  adminApproved: false   │
└──────────┬──────────────┘
           │
           │ 2. Admin Reviews
           │    GET /api/admin/products
           │
           ▼
      ┌────────┐
      │ ADMIN  │
      └────┬───┘
           │
           ├─────────────┬──────────────┐
           │             │              │
           ▼             ▼              ▼
       APPROVE        REJECT       SKIP
           │             │
           │             │ PUT /api/admin/products/:id/reject
           │             │ { reason: "..." }
           │             │
           │             ▼
           │      ┌──────────────┐
           │      │   REJECTED   │
           │      │ NOT visible  │
           │      │ to sellers   │
           │      └──────────────┘
           │
           │ 3. PUT /api/admin/products/:id/approve
           │    { margin: 200 }
           │
           ▼
┌──────────────────────────────┐
│  PRODUCT APPROVED            │
│  Status: APPROVED            │
│  adminApproved: true         │
│  margin: 200                 │
│  finalPrice: base + margin   │
└──────────┬───────────────────┘
           │
           │ 4. NOW VISIBLE TO SELLERS
           │    GET /api/seller/products
           │
           ▼
      ┌────────┐
      │ SELLER │
      └────────┘
   Can browse & order
```

## Price Flow

```
Supplier Sets Base Price
         │
         ▼
    ₹1000 (Base)
         │
         │ Admin Adds Margin
         ▼
   ₹1000 + ₹200 (Margin)
         │
         ▼
    ₹1200 (Final Price)
         │
         │ Add GST (18%)
         ▼
   ₹1200 + ₹216 (GST)
         │
         ▼
    ₹1416 (Total)
```

## Quick Setup (5 Minutes)

### Step 1: Start MongoDB
```bash
# Option A: Local MongoDB
sudo systemctl start mongod

# Option B: Use MongoDB Atlas (update .env with your connection string)
```

### Step 2: Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Step 4: Create Accounts

**1. Create Admin Account**
- Go to: `http://localhost:5173`
- Click "Sign Up"
- Select role: "Admin"
- Fill details and register

**2. Create Supplier Account**
- Sign up with role: "Supplier"
- Add business details

**3. Create Seller Account**
- Sign up with role: "Seller"
- Add business details

## Testing the Workflow

### Test 1: Supplier Adds Product

1. Login as **Supplier**
2. Go to "Product Management"
3. Click "Add Product"
4. Fill in:
   - Name: "Test Laptop"
   - Description: "High-performance laptop"
   - Price: 50000
   - GST: 18%
   - Stock: 100
5. Click "Create Product"

**Result:** Product created with status "Pending Approval"

---

### Test 2: Admin Reviews Product

1. Logout and login as **Admin**
2. Go to "Product Management"
3. You should see the product with status "Pending Approval"
4. Click "Approve"
5. Enter margin: 5000
6. Click "Confirm Approve"

**Result:** Product approved with:
- Base Price: ₹50,000
- Margin: ₹5,000
- Final Price: ₹55,000

---

### Test 3: Seller Views Product

1. Logout and login as **Seller**
2. Go to "Browse Products" or "Dashboard"
3. You should see the approved product
4. Product shows Final Price: ₹55,000

**Result:** Seller can now order this product

---

## API Testing with cURL

### 1. Supplier Creates Product
```bash
curl -X POST http://localhost:5000/api/supplier/products \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 50000,
    "gstPercentage": 18,
    "stock": 100,
    "category": "Electronics"
  }'
```

### 2. Admin Views Pending Products
```bash
curl -X GET "http://localhost:5000/api/admin/products?approvalStatus=pending" \
  -H "Cookie: token=ADMIN_TOKEN"
```

### 3. Admin Approves Product
```bash
curl -X PUT http://localhost:5000/api/admin/products/PRODUCT_ID/approve \
  -H "Content-Type: application/json" \
  -H "Cookie: token=ADMIN_TOKEN" \
  -d '{"margin": 5000}'
```

### 4. Seller Views Approved Products
```bash
curl -X GET http://localhost:5000/api/seller/products \
  -H "Cookie: token=SELLER_TOKEN"
```

---

## Common Issues & Solutions

### ❌ "Product not showing in Admin portal"

**Check:**
1. Is product created? Check supplier's product list
2. Is MongoDB running? `sudo systemctl status mongod`
3. Check browser console for API errors
4. Verify API URL in `.env`: `VITE_API_URL=http://localhost:5000/api`

**Solution:**
```bash
# Restart backend
cd backend
npm run dev
```

---

### ❌ "Product not showing in Seller portal"

**Check:**
1. Is product approved by admin?
2. Is `adminApproved` set to `true`?
3. Is `approvalStatus` set to "approved"?

**Solution:**
- Admin must approve the product first
- Check in Admin Product Management → Product should show as "Approved"

---

### ❌ "Authentication error"

**Check:**
1. Are cookies enabled in browser?
2. Is backend URL correct?
3. Is user logged in?

**Solution:**
```bash
# Clear cookies and login again
# Or check backend .env for JWT_SECRET
```

---

### ❌ "MongoDB connection error"

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Check status
sudo systemctl status mongod

# Or use MongoDB Atlas
# Update .env:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/marketplace
```

---

## File Structure

```
project/
├── backend/
│   ├── controllers/
│   │   └── product.controller.js    # Product logic
│   ├── routes/
│   │   ├── supplier.routes.js       # /api/supplier/*
│   │   ├── admin.routes.js          # /api/admin/*
│   │   └── seller.routes.js         # /api/seller/*
│   ├── models/
│   │   └── product.model.js         # Product schema
│   └── server.js                    # Entry point
├── frontend/
│   └── src/
│       └── pages/
│           └── admin/
│               └── ProductManagement.jsx
├── .env                             # Environment variables
├── README.md                        # Full documentation
├── WORKFLOW.md                      # Detailed workflow
├── API_ENDPOINTS.md                 # API reference
└── QUICK_START.md                   # This file
```

---

## Key Endpoints

| Route | Method | Description | Who Can Access |
|-------|--------|-------------|----------------|
| `/api/supplier/products` | POST | Create product | Supplier |
| `/api/supplier/products` | GET | Get supplier's products | Supplier |
| `/api/admin/products` | GET | Get all products | Admin |
| `/api/admin/products/:id/approve` | PUT | Approve + set margin | Admin |
| `/api/admin/products/:id/reject` | PUT | Reject product | Admin |
| `/api/seller/products` | GET | Get approved products | Seller |

---

## Product States

| State | approvalStatus | adminApproved | Visible To |
|-------|----------------|---------------|------------|
| **Pending** | pending | false | Supplier, Admin |
| **Approved** | approved | true | Supplier, Admin, Seller |
| **Rejected** | rejected | false | Supplier, Admin |

---

## Next Steps

1. ✅ Complete the Quick Setup above
2. ✅ Test the workflow with sample data
3. 📖 Read [WORKFLOW.md](./WORKFLOW.md) for detailed process
4. 📖 Read [API_ENDPOINTS.md](./API_ENDPOINTS.md) for API details
5. 🚀 Start building your marketplace!

---

## Need Help?

- Check the [README.md](./README.md) for installation issues
- Check the [WORKFLOW.md](./WORKFLOW.md) for workflow questions
- Check the [API_ENDPOINTS.md](./API_ENDPOINTS.md) for API details
- Check browser console for frontend errors
- Check terminal for backend errors

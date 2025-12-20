# Product Approval Workflow

This document explains the complete product approval workflow from supplier to admin to seller.

## Complete Workflow

```
Supplier → Adds Product → Admin Reviews → Admin Approves + Margin → Seller Sees Product
```

## Step-by-Step Process

### Step 1: Supplier Adds Product

**Endpoint:** `POST /api/supplier/products`

**Request:**
```javascript
// Headers
{
  "Content-Type": "application/json",
  "Cookie": "token=..." // Authentication cookie
}

// Body
{
  "name": "Product Name",
  "description": "Product Description",
  "category": "Electronics",
  "price": 1000,
  "gstPercentage": 18,
  "stock": 100,
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "price": 1000,
    "approvalStatus": "pending",
    "adminApproved": false,
    "supplier": {
      "_id": "supplier_id",
      "name": "Supplier Name",
      "email": "supplier@example.com"
    }
  }
}
```

**Product Status After Creation:**
- `approvalStatus`: "pending"
- `adminApproved`: false
- `status`: "active"

---

### Step 2: Admin Views All Products

**Endpoint:** `GET /api/admin/products`

**Request:**
```javascript
// Headers
{
  "Content-Type": "application/json",
  "Cookie": "token=..." // Admin authentication cookie
}

// Optional Query Parameters
?approvalStatus=pending  // Filter by approval status
?category=Electronics    // Filter by category
?supplier=supplier_id    // Filter by supplier
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product Description",
      "price": 1000,
      "gstPercentage": 18,
      "stock": 100,
      "approvalStatus": "pending",
      "adminApproved": false,
      "supplier": {
        "_id": "supplier_id",
        "name": "Supplier Name",
        "email": "supplier@example.com",
        "businessName": "Supplier Business",
        "phoneNumber": "1234567890"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Admin Can See:**
- All products regardless of status
- Products filtered by: pending, approved, rejected
- Supplier details for each product

---

### Step 3: Admin Approves Product with Margin

**Endpoint:** `PUT /api/admin/products/:id/approve`

**Request:**
```javascript
// Headers
{
  "Content-Type": "application/json",
  "Cookie": "token=..." // Admin authentication cookie
}

// Body
{
  "margin": 200  // Platform margin amount
}
```

**What Happens:**
1. Validates admin authorization
2. Validates margin amount (must be >= 0)
3. Updates product:
   - `approvalStatus` = "approved"
   - `adminApproved` = true
   - `approvedBy` = admin user ID
   - `approvedAt` = current timestamp
   - `margin` = provided margin amount
   - `finalPrice` = base price + margin

**Response:**
```json
{
  "success": true,
  "message": "Product approved successfully",
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "price": 1000,
    "margin": 200,
    "finalPrice": 1200,
    "approvalStatus": "approved",
    "adminApproved": true,
    "approvedBy": "admin_id",
    "approvedAt": "2024-01-01T00:00:00.000Z",
    "supplier": {
      "_id": "supplier_id",
      "name": "Supplier Name",
      "email": "supplier@example.com"
    }
  }
}
```

**Product Status After Approval:**
- `approvalStatus`: "approved"
- `adminApproved`: true
- `margin`: 200
- `finalPrice`: 1200 (1000 + 200)
- Now visible to sellers

---

### Step 4: Seller Views Approved Products

**Endpoint:** `GET /api/seller/products`

**Request:**
```javascript
// Headers
{
  "Content-Type": "application/json",
  "Cookie": "token=..." // Seller authentication cookie
}

// Optional Query Parameters
?category=Electronics    // Filter by category
?search=laptop          // Search in name/description
?notified=true          // Filter by notification status
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product Description",
      "price": 1000,
      "margin": 200,
      "finalPrice": 1200,
      "gstPercentage": 18,
      "stock": 100,
      "approvalStatus": "approved",
      "adminApproved": true,
      "supplier": {
        "_id": "supplier_id",
        "name": "Supplier Name",
        "email": "supplier@example.com",
        "businessName": "Supplier Business",
        "phoneNumber": "1234567890"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Seller Only Sees Products Where:**
- `status`: "active"
- `approvalStatus`: "approved"
- `adminApproved`: true

---

## Alternative: Admin Rejects Product

**Endpoint:** `PUT /api/admin/products/:id/reject`

**Request:**
```javascript
// Headers
{
  "Content-Type": "application/json",
  "Cookie": "token=..." // Admin authentication cookie
}

// Body
{
  "reason": "Product does not meet quality standards"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product rejected successfully",
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "approvalStatus": "rejected",
    "adminApproved": false,
    "rejectionReason": "Product does not meet quality standards",
    "approvedBy": "admin_id",
    "approvedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Product Status After Rejection:**
- `approvalStatus`: "rejected"
- `adminApproved`: false
- `rejectionReason`: "Product does not meet quality standards"
- NOT visible to sellers

---

## Summary of Product States

### State 1: Pending (Initial State)
- Created by supplier
- Awaiting admin review
- Visible to: Supplier, Admin
- NOT visible to: Sellers

### State 2: Approved
- Approved by admin with margin
- Ready for sellers to purchase
- Visible to: Supplier, Admin, Sellers
- Has `finalPrice` = `price` + `margin`

### State 3: Rejected
- Rejected by admin with reason
- Cannot be purchased
- Visible to: Supplier, Admin
- NOT visible to: Sellers
- Supplier can see rejection reason

---

## Database Schema

### Product Model Fields

```javascript
{
  name: String,              // Product name
  description: String,       // Product description
  category: String,          // Product category
  price: Number,            // Base price (supplier price)
  margin: Number,           // Platform margin (set by admin)
  finalPrice: Number,       // Final price (price + margin)
  gstPercentage: Number,    // GST percentage
  stock: Number,            // Available stock
  images: [String],         // Product images

  // Supplier Reference
  supplier: ObjectId,       // Reference to User (supplier)

  // Status Fields
  status: String,           // 'active', 'inactive', 'out_of_stock'
  approvalStatus: String,   // 'pending', 'approved', 'rejected'
  adminApproved: Boolean,   // true/false

  // Approval Details
  approvedBy: ObjectId,     // Admin who approved/rejected
  approvedAt: Date,         // When approved/rejected
  rejectionReason: String,  // Reason if rejected

  // Seller Notification
  isNotifiedToSellers: Boolean,  // Notified to sellers?
  notifiedAt: Date,              // When notified

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Routes Summary

### Supplier Routes (`/api/supplier/`)
```
POST   /products              - Create new product
GET    /products              - Get supplier's products
GET    /products/:id          - Get single product
PUT    /products/:id          - Update product
DELETE /products/:id          - Delete product
PUT    /products/:id/notify   - Notify product to sellers
```

### Admin Routes (`/api/admin/`)
```
GET    /products              - Get all products (with filters)
PUT    /products/:id/approve  - Approve product + set margin
PUT    /products/:id/reject   - Reject product + reason
```

### Seller Routes (`/api/seller/`)
```
GET    /products              - Get approved products only
GET    /products/:id          - Get single product details
```

---

## Authentication

All endpoints require authentication via HTTP-only cookies:

```javascript
// Cookie set on login
{
  name: "token",
  value: "JWT_TOKEN",
  httpOnly: true,
  secure: true (in production),
  sameSite: "strict"
}
```

All API requests must include:
```javascript
{
  credentials: 'include'  // Send cookies with request
}
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Only admins can approve products"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Please provide a valid margin amount"
}
```

---

## Testing the Workflow

### 1. Create Supplier Account
```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Test Supplier",
  "email": "supplier@test.com",
  "password": "password123",
  "role": "supplier"
}
```

### 2. Supplier Adds Product
```bash
POST http://localhost:5000/api/supplier/products
Cookie: token=...
{
  "name": "Test Product",
  "description": "Test Description",
  "price": 1000,
  "gstPercentage": 18,
  "stock": 100
}
```

### 3. Admin Views Products
```bash
GET http://localhost:5000/api/admin/products?approvalStatus=pending
Cookie: token=...
```

### 4. Admin Approves with Margin
```bash
PUT http://localhost:5000/api/admin/products/{product_id}/approve
Cookie: token=...
{
  "margin": 200
}
```

### 5. Seller Views Approved Products
```bash
GET http://localhost:5000/api/seller/products
Cookie: token=...
```

---

## Price Calculation

**Example:**
- Supplier Price (Base): ₹1000
- Platform Margin: ₹200
- **Final Price to Seller: ₹1200**
- GST (18%): ₹216
- **Total Price: ₹1416**

**Formula:**
```
Final Price = Base Price + Platform Margin
Total Price = Final Price + (Final Price × GST%)
```

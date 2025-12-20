# API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require authentication via HTTP-only cookies. Include `credentials: 'include'` in fetch requests.

---

## Supplier Endpoints

### Create Product
**POST** `/supplier/products`

Creates a new product that goes into "pending" approval status.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "category": "Electronics",
  "price": 1000,
  "gstPercentage": 18,
  "stock": 100
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
    "approvalStatus": "pending",
    "adminApproved": false
  }
}
```

---

### Get Supplier's Products
**GET** `/supplier/products`

Gets all products created by the logged-in supplier.

**Query Parameters:**
- `status` - Filter by status (active, inactive, out_of_stock)
- `search` - Search in name and description

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

---

### Get Product by ID
**GET** `/supplier/products/:id`

Gets a single product by ID.

---

### Update Product
**PUT** `/supplier/products/:id`

Updates a product. Only the product owner (supplier) can update.

**Request Body:**
```json
{
  "name": "Updated Name",
  "price": 1200,
  "stock": 150
}
```

---

### Delete Product
**DELETE** `/supplier/products/:id`

Deletes a product. Only the product owner (supplier) can delete.

---

### Notify Product to Sellers
**PUT** `/supplier/products/:id/notify`

Marks a product as notified to sellers.

---

## Admin Endpoints

### Get All Products
**GET** `/admin/products`

Gets all products in the system with filters.

**Query Parameters:**
- `approvalStatus` - Filter by approval status (pending, approved, rejected)
- `category` - Filter by category
- `supplier` - Filter by supplier ID
- `status` - Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 1000,
      "approvalStatus": "pending",
      "supplier": {
        "_id": "supplier_id",
        "name": "Supplier Name",
        "businessName": "Business Name"
      }
    }
  ]
}
```

---

### Approve Product
**PUT** `/admin/products/:id/approve`

Approves a product and sets the platform margin.

**Request Body:**
```json
{
  "margin": 200
}
```

**What Happens:**
- Sets `approvalStatus` to "approved"
- Sets `adminApproved` to true
- Sets `margin` to provided amount
- Calculates `finalPrice` = base price + margin
- Product becomes visible to sellers

**Response:**
```json
{
  "success": true,
  "message": "Product approved successfully",
  "data": {
    "_id": "product_id",
    "approvalStatus": "approved",
    "adminApproved": true,
    "margin": 200,
    "finalPrice": 1200
  }
}
```

---

### Reject Product
**PUT** `/admin/products/:id/reject`

Rejects a product with a reason.

**Request Body:**
```json
{
  "reason": "Does not meet quality standards"
}
```

**What Happens:**
- Sets `approvalStatus` to "rejected"
- Sets `adminApproved` to false
- Stores rejection reason
- Product NOT visible to sellers

**Response:**
```json
{
  "success": true,
  "message": "Product rejected successfully",
  "data": {
    "_id": "product_id",
    "approvalStatus": "rejected",
    "rejectionReason": "Does not meet quality standards"
  }
}
```

---

## Seller Endpoints

### Get Approved Products
**GET** `/seller/products`

Gets only approved products that sellers can purchase.

**Filter Applied Automatically:**
- `status`: "active"
- `approvalStatus`: "approved"
- `adminApproved`: true

**Query Parameters:**
- `category` - Filter by category
- `search` - Search in name and description
- `notified` - Filter by notification status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 1000,
      "margin": 200,
      "finalPrice": 1200,
      "approvalStatus": "approved",
      "supplier": {
        "_id": "supplier_id",
        "name": "Supplier Name",
        "businessName": "Business Name",
        "phoneNumber": "1234567890"
      }
    }
  ]
}
```

---

### Get Product by ID
**GET** `/seller/products/:id`

Gets detailed information about a specific product.

---

## Complete Workflow Example

### 1. Supplier Creates Product
```javascript
const response = await fetch('http://localhost:5000/api/supplier/products', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Laptop',
    description: 'High-performance laptop',
    category: 'Electronics',
    price: 50000,
    gstPercentage: 18,
    stock: 50
  })
});

// Product created with:
// - approvalStatus: "pending"
// - adminApproved: false
```

---

### 2. Admin Views Pending Products
```javascript
const response = await fetch('http://localhost:5000/api/admin/products?approvalStatus=pending', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Admin sees all pending products
```

---

### 3. Admin Approves with Margin
```javascript
const response = await fetch(`http://localhost:5000/api/admin/products/${productId}/approve`, {
  method: 'PUT',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    margin: 5000  // ₹5000 platform margin
  })
});

// Product updated with:
// - approvalStatus: "approved"
// - adminApproved: true
// - margin: 5000
// - finalPrice: 55000 (50000 + 5000)
```

---

### 4. Seller Views Approved Products
```javascript
const response = await fetch('http://localhost:5000/api/seller/products', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Seller sees only approved products
// Product shows with finalPrice: ₹55000
```

---

## Error Codes

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only admins can approve products"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide a valid margin amount"
}
```

---

## Frontend Integration Example

### Admin Product Management Component

```javascript
const API_URL = import.meta.env.VITE_API_URL;

// Fetch all products
const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/admin/products`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  if (data.success) {
    setProducts(data.data);
  }
};

// Approve product with margin
const approveProduct = async (productId, margin) => {
  const response = await fetch(`${API_URL}/admin/products/${productId}/approve`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ margin: parseFloat(margin) })
  });
  const data = await response.json();
  if (data.success) {
    alert('Product approved successfully!');
    fetchProducts(); // Refresh list
  }
};

// Reject product with reason
const rejectProduct = async (productId, reason) => {
  const response = await fetch(`${API_URL}/admin/products/${productId}/reject`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reason })
  });
  const data = await response.json();
  if (data.success) {
    alert('Product rejected successfully!');
    fetchProducts(); // Refresh list
  }
};
```

---

## Testing with cURL

### Approve Product
```bash
curl -X PUT http://localhost:5000/api/admin/products/PRODUCT_ID/approve \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN" \
  -d '{"margin": 200}'
```

### Get Approved Products (Seller)
```bash
curl -X GET http://localhost:5000/api/seller/products \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN"
```

### Get All Products (Admin)
```bash
curl -X GET "http://localhost:5000/api/admin/products?approvalStatus=pending" \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN"
```

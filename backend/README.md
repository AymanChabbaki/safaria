# 🚀 SAFARIA Backend API - Phase 3 Complete Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Response Examples](#response-examples)

---

## 🎯 Overview

The SAFARIA Backend API is a RESTful API built with **Node.js**, **Express**, and **MySQL2**. It provides complete CRUD operations for managing artisan experiences, accommodations, desert caravans, reservations, and 360° virtual tour images.

### Key Features
✅ RESTful API architecture  
✅ JWT-based authentication  
✅ File upload with Multer  
✅ MySQL database with connection pooling  
✅ Input validation and error handling  
✅ CORS enabled for frontend integration  
✅ Prepared statements for SQL injection prevention  

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MySQL connection pool
│   ├── controllers/
│   │   ├── artisanController.js     # Artisan CRUD logic
│   │   ├── sejourController.js      # Sejour CRUD logic
│   │   ├── caravaneController.js    # Caravane CRUD logic
│   │   ├── reservationController.js # Reservation management
│   │   ├── image360Controller.js    # 360° image uploads
│   │   └── authController.js        # Authentication logic
│   ├── routes/
│   │   ├── artisanRoutes.js         # Artisan endpoints
│   │   ├── sejourRoutes.js          # Sejour endpoints
│   │   ├── caravaneRoutes.js        # Caravane endpoints
│   │   ├── reservationRoutes.js     # Reservation endpoints
│   │   ├── image360Routes.js        # 360° image endpoints
│   │   └── authRoutes.js            # Authentication endpoints
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── upload.js                # Multer file upload
│   ├── utils/
│   │   └── responseHelper.js        # Response utilities
│   ├── uploads/                     # Uploaded images
│   │   ├── artisans/
│   │   ├── sejours/
│   │   ├── caravanes/
│   │   └── 360/
│   ├── app.js                       # Express app configuration
│   └── server.js                    # Server entry point
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## ⚙️ Installation

### Prerequisites
- Node.js 16+ installed
- MySQL 8.0+ installed and running
- Database created (see Phase 2 documentation)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
```bash
# Copy the example file
Copy-Item .env.example .env

# Edit .env with your configuration
```

### Step 3: Start the Server
```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

The server will start at: **http://localhost:5000**

---

## 🔐 Environment Configuration

Edit your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=safaria_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

⚠️ **Important**: Change `JWT_SECRET` to a strong random string in production!

---

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000
```

### 📊 Health Check
```
GET /
```

---

## 🎨 ARTISANS API

### 1. Create Artisan
```http
POST /api/artisans
Content-Type: multipart/form-data
```

**Body (form-data):**
- `name` (string, required)
- `description` (text, required)
- `latitude` (decimal, required)
- `longitude` (decimal, required)
- `price` (decimal, required)
- `main_image` (file, optional)

### 2. Get All Artisans
```http
GET /api/artisans
```

### 3. Get Single Artisan
```http
GET /api/artisans/:id
```

### 4. Update Artisan
```http
PUT /api/artisans/:id
Content-Type: multipart/form-data
```

**Body (form-data):** Same as Create (all optional)

### 5. Delete Artisan
```http
DELETE /api/artisans/:id
```

---

## 🏠 SEJOURS API

Same structure as Artisans:

```http
POST   /api/sejours
GET    /api/sejours
GET    /api/sejours/:id
PUT    /api/sejours/:id
DELETE /api/sejours/:id
```

---

## 🐪 CARAVANES API

Same structure as Artisans:

```http
POST   /api/caravanes
GET    /api/caravanes
GET    /api/caravanes/:id
PUT    /api/caravanes/:id
DELETE /api/caravanes/:id
```

---

## 📅 RESERVATIONS API

### 1. Create Reservation
```http
POST /api/reservations
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "user_name": "Ahmed Benali",
  "user_phone": "+212-661-234567",
  "itemType": "artisanat",
  "itemId": 1,
  "reservation_date": "2025-12-15"
}
```

**Valid itemType values:**
- `artisanat`
- `sejour`
- `caravane`

### 2. Get All Reservations (Auth Required)
```http
GET /api/reservations
Authorization: Bearer <token>
```

**Query Parameters (optional):**
- `status` - Filter by status (pending, confirmed, cancelled)
- `itemType` - Filter by type (artisanat, sejour, caravane)

### 3. Get Single Reservation (Auth Required)
```http
GET /api/reservations/:id
Authorization: Bearer <token>
```

### 4. Update Reservation Status (Auth Required)
```http
PUT /api/reservations/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "confirmed"
}
```

**Valid status values:**
- `pending`
- `confirmed`
- `cancelled`

### 5. Delete Reservation (Auth Required)
```http
DELETE /api/reservations/:id
Authorization: Bearer <token>
```

---

## 🌀 360° IMAGES API

### 1. Upload 360° Image (Auth Required)
```http
POST /api/360
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `itemType` (string, required) - artisanat, sejour, or caravane
- `itemId` (integer, required)
- `image` (file, required)

### 2. Get 360° Images for Item
```http
GET /api/360/:itemType/:itemId
```

**Example:**
```http
GET /api/360/artisanat/1
```

### 3. Delete 360° Image (Auth Required)
```http
DELETE /api/360/:id
Authorization: Bearer <token>
```

---

## 🔒 AUTHENTICATION API

### 1. Login
```http
POST /api/auth/login
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### 2. Register (Create Admin User)
```http
POST /api/auth/register
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "newadmin",
  "password": "securepassword123"
}
```

### 3. Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

---

## 🧪 Testing with Postman/Thunder Client

### Setup

1. **Import Environment Variables**

Create a new environment in Postman:

```json
{
  "base_url": "http://localhost:5000",
  "token": ""
}
```

2. **Authentication Flow**

First, login to get a token:

**Request:**
```http
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Copy the token from response** and save it in your environment variable `token`.

3. **Use Token in Protected Routes**

For authenticated requests, add header:
```
Authorization: Bearer {{token}}
```

---

## 📝 Response Examples

### ✅ Success Response

```json
{
  "success": true,
  "message": "Artisan created successfully",
  "data": {
    "id": 1,
    "name": "Atelier de Poterie",
    "description": "Découvrez l'art de la poterie...",
    "category": "artisanat",
    "latitude": 34.0631438,
    "longitude": -4.9972857,
    "price": 350.00,
    "main_image": "/uploads/artisans/poterie-1234567890.jpg",
    "created_at": "2025-11-23T10:30:00.000Z"
  }
}
```

### ❌ Error Response

```json
{
  "success": false,
  "message": "All fields are required: name, description, latitude, longitude, price"
}
```

### 🔒 Authentication Error

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 🚫 Not Found Error

```json
{
  "success": false,
  "message": "Artisan not found"
}
```

---

## 🔬 Complete Testing Checklist

### Test Artisans API

1. ✅ Create artisan with image
```bash
POST /api/artisans
Form Data:
- name: Test Artisan
- description: Test Description
- latitude: 31.6295
- longitude: -7.9811
- price: 100
- main_image: (upload file)
```

2. ✅ Get all artisans
```bash
GET /api/artisans
```

3. ✅ Get single artisan
```bash
GET /api/artisans/1
```

4. ✅ Update artisan
```bash
PUT /api/artisans/1
Form Data:
- name: Updated Name
- price: 150
```

5. ✅ Delete artisan
```bash
DELETE /api/artisans/1
```

### Test Authentication

1. ✅ Login
```bash
POST /api/auth/login
JSON:
{
  "username": "admin",
  "password": "admin123"
}
```

2. ✅ Verify token
```bash
GET /api/auth/verify
Headers:
Authorization: Bearer <your_token>
```

### Test Reservations

1. ✅ Create reservation (no auth)
```bash
POST /api/reservations
JSON:
{
  "user_name": "Test User",
  "user_phone": "+212-600-000000",
  "itemType": "artisanat",
  "itemId": 1,
  "reservation_date": "2025-12-25"
}
```

2. ✅ Get all reservations (with auth)
```bash
GET /api/reservations
Headers:
Authorization: Bearer <your_token>
```

3. ✅ Update reservation status (with auth)
```bash
PUT /api/reservations/1
Headers:
Authorization: Bearer <your_token>
JSON:
{
  "status": "confirmed"
}
```

### Test 360° Images

1. ✅ Upload 360 image (with auth)
```bash
POST /api/360
Headers:
Authorization: Bearer <your_token>
Form Data:
- itemType: artisanat
- itemId: 1
- image: (upload file)
```

2. ✅ Get 360 images
```bash
GET /api/360/artisanat/1
```

---

## 🛡️ Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: Bcrypt with 10 salt rounds
3. **SQL Injection Prevention**: Prepared statements
4. **File Upload Validation**: Type and size restrictions
5. **CORS Configuration**: Controlled cross-origin access
6. **Input Validation**: Server-side validation for all inputs

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
- Check MySQL is running: `net start MySQL80`
- Verify `.env` credentials

### Error: "Cannot find module"
- Run: `npm install`

### Error: "Port already in use"
- Change PORT in `.env` or stop other process

### Error: "Invalid token"
- Login again to get a new token
- Check Authorization header format: `Bearer <token>`

### File upload not working
- Check `uploads/` directory exists
- Verify file size < 5MB
- Only JPG, PNG, GIF allowed

---

## 🎓 API Usage Examples

### Example 1: Create Complete Artisan Experience

```javascript
// Using Axios in Frontend
const createArtisan = async () => {
  const formData = new FormData();
  formData.append('name', 'Atelier Poterie Fès');
  formData.append('description', 'Découvrez l\'art de la poterie...');
  formData.append('latitude', '34.0631438');
  formData.append('longitude', '-4.9972857');
  formData.append('price', '350');
  formData.append('main_image', fileInput.files[0]);

  const response = await axios.post(
    'http://localhost:5000/api/artisans',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  
  console.log(response.data);
};
```

### Example 2: Make Reservation

```javascript
// Using Fetch API
const makeReservation = async () => {
  const response = await fetch('http://localhost:5000/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_name: 'Ahmed Benali',
      user_phone: '+212-661-234567',
      itemType: 'artisanat',
      itemId: 1,
      reservation_date: '2025-12-15'
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Example 3: Authenticated Request

```javascript
// Get all reservations with authentication
const getReservations = async (token) => {
  const response = await fetch('http://localhost:5000/api/reservations', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data);
};
```

---

## 📈 Performance Tips

1. **Connection Pooling**: Already configured (max 10 connections)
2. **Image Optimization**: Compress images before upload
3. **Database Indexes**: Already created on key fields
4. **Pagination**: Add limit/offset for large datasets (future enhancement)

---

## 🔄 Next Steps

1. ✅ Backend API Complete
2. ⏭️ Connect Frontend to Backend
3. ⏭️ Implement admin dashboard
4. ⏭️ Add email notifications for reservations
5. ⏭️ Implement search and filtering
6. ⏭️ Add pagination for large datasets
7. ⏭️ Deploy to production server

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Package](https://www.npmjs.com/package/mysql2)
- [Multer Documentation](https://www.npmjs.com/package/multer)
- [JWT.io](https://jwt.io/)
- [Postman Learning Center](https://learning.postman.com/)

---

**Phase 3 Status**: ✅ Complete  
**API Version**: 1.0.0  
**Last Updated**: November 23, 2025  
**Developed by**: SAFARIA Team

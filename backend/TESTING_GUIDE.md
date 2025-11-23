# 🧪 SAFARIA API - Quick Testing Guide

## 🚀 Getting Started

### 1. Start the Server
```bash
cd backend
npm start
```

Server should be running at: `http://localhost:5000`

### 2. Import Postman Collection

Import the file: `SAFARIA_API.postman_collection.json` into Postman

---

## 📋 Testing Workflow

### STEP 1: Test Health Check ✅

```http
GET http://localhost:5000/
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SAFARIA API is running",
  "version": "1.0.0"
}
```

---

### STEP 2: Login to Get Token 🔐

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response:**
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

**⚠️ IMPORTANT: Copy the token value for protected endpoints!**

---

### STEP 3: Test Artisans CRUD 🎨

#### 3.1 Get All Artisans
```http
GET http://localhost:5000/api/artisans
```

#### 3.2 Get Single Artisan
```http
GET http://localhost:5000/api/artisans/1
```

#### 3.3 Create New Artisan (with Image)
```http
POST http://localhost:5000/api/artisans
Content-Type: multipart/form-data

Form Fields:
- name: Atelier Test
- description: Test description
- latitude: 31.6295
- longitude: -7.9811
- price: 400
- main_image: [SELECT IMAGE FILE]
```

---

### STEP 4: Test Reservations 📅

#### 4.1 Create Reservation (No Auth Required)
```http
POST http://localhost:5000/api/reservations
Content-Type: application/json

{
  "user_name": "Mohamed Test",
  "user_phone": "+212-661-111111",
  "itemType": "artisanat",
  "itemId": 1,
  "reservation_date": "2025-12-25"
}
```

#### 4.2 Get All Reservations (Auth Required)
```http
GET http://localhost:5000/api/reservations
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 4.3 Update Reservation Status (Auth Required)
```http
PUT http://localhost:5000/api/reservations/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "confirmed"
}
```

---

### STEP 5: Test 360° Images 🌀

#### 5.1 Upload 360 Image (Auth Required)
```http
POST http://localhost:5000/api/360
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Form Fields:
- itemType: artisanat
- itemId: 1
- image: [SELECT IMAGE FILE]
```

#### 5.2 Get 360 Images
```http
GET http://localhost:5000/api/360/artisanat/1
```

---

## 📊 Test Results Checklist

Mark each test as complete:

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Verify token works

### Artisans
- [ ] Get all artisans
- [ ] Get single artisan
- [ ] Create artisan with image
- [ ] Create artisan without image
- [ ] Update artisan
- [ ] Delete artisan

### Sejours
- [ ] Get all sejours
- [ ] Create sejour
- [ ] Update sejour
- [ ] Delete sejour

### Caravanes
- [ ] Get all caravanes
- [ ] Create caravane
- [ ] Update caravane
- [ ] Delete caravane

### Reservations
- [ ] Create reservation without auth
- [ ] Get all reservations with auth
- [ ] Get single reservation
- [ ] Update reservation status
- [ ] Filter by status
- [ ] Filter by itemType

### 360° Images
- [ ] Upload 360 image with auth
- [ ] Get 360 images for item
- [ ] Delete 360 image

---

## 🐛 Common Issues

### Issue 1: "Database connection failed"
**Solution:**
```bash
# Check MySQL is running
net start MySQL80

# Verify .env settings
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=safaria_db
```

### Issue 2: "Invalid token"
**Solution:**
- Login again to get fresh token
- Check Authorization header: `Bearer <token>`
- Ensure no extra spaces in header

### Issue 3: "Cannot POST /api/..."
**Solution:**
- Check server is running
- Verify URL is correct
- Check request method (GET/POST/PUT/DELETE)

### Issue 4: File upload fails
**Solution:**
- File must be < 5MB
- Only JPG, PNG, GIF allowed
- Use `multipart/form-data` content type
- Check `uploads/` directory exists

---

## ✅ Expected Test Results

### All Endpoints Should Return:

**Success Response:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔍 Advanced Testing

### Test with cURL

```bash
# Health check
curl http://localhost:5000/

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get artisans
curl http://localhost:5000/api/artisans

# Create reservation
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Test","user_phone":"+212-600-000000","itemType":"artisanat","itemId":1,"reservation_date":"2025-12-25"}'
```

---

## 📈 Performance Testing

### Test Response Times

All endpoints should respond in:
- GET requests: < 100ms
- POST/PUT requests: < 200ms
- File uploads: < 1000ms

### Load Testing (Optional)

Use tools like Apache Bench:
```bash
ab -n 100 -c 10 http://localhost:5000/api/artisans
```

---

## 🎯 Next Steps After Testing

1. ✅ All tests pass
2. ⏭️ Integrate with frontend
3. ⏭️ Add more seed data
4. ⏭️ Test error scenarios
5. ⏭️ Performance optimization
6. ⏭️ Deploy to production

---

**Testing Completed**: _____ / 25 tests  
**Date**: _______________  
**Tester**: _______________

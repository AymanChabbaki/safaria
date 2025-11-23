# 🚀 SAFARIA Backend - Quick Start Guide

## ⚡ 3-Minute Setup

### Step 1: Configure Database (30 seconds)
```bash
cd backend
Copy-Item .env.example .env
```

Edit `.env` file:
```env
DB_PASSWORD=yourpassword  # ← Change this!
JWT_SECRET=your_secret_key_here  # ← Change this!
```

### Step 2: Start Server (10 seconds)
```bash
npm start
```

You should see:
```
✅ Database connected successfully!
🚀 SAFARIA API Server Started
📍 Server: http://localhost:5000
```

### Step 3: Test API (30 seconds)
Open browser: http://localhost:5000

You should see:
```json
{
  "success": true,
  "message": "SAFARIA API is running"
}
```

---

## 🧪 Quick Test

### Test 1: Get Artisans
```bash
curl http://localhost:5000/api/artisans
```

### Test 2: Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Test 3: Create Reservation
```bash
curl -X POST http://localhost:5000/api/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"user_name\":\"Test\",\"user_phone\":\"+212-600-000000\",\"itemType\":\"artisanat\",\"itemId\":1,\"reservation_date\":\"2025-12-25\"}"
```

---

## 📚 Full Documentation

- **API Reference**: `README.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **Postman Collection**: `SAFARIA_API.postman_collection.json`

---

## 🆘 Troubleshooting

**Database error?**
```bash
net start MySQL80
# Then restart: npm start
```

**Port already in use?**
```env
# Change in .env:
PORT=5001
```

**Module not found?**
```bash
npm install
```

---

## ✅ What's Working

- [x] MySQL Connection
- [x] 25 API Endpoints
- [x] JWT Authentication
- [x] File Upload
- [x] CRUD Operations
- [x] Error Handling
- [x] CORS Enabled

---

**Ready to code!** 🎉

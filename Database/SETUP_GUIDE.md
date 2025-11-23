# 🚀 SAFARIA Platform - Quick Start Guide

## Database Setup (Phase 2 & Phase 1.4)

### Prerequisites
- MySQL Server 8.0+ installed
- Node.js 16+ installed
- MySQL running on port 3306

---

## ⚡ Quick Setup (5 Steps)

### 1️⃣ Install Dependencies
```bash
cd backend
npm install mysql2 dotenv
```

### 2️⃣ Configure Environment
```bash
# Copy environment template
Copy-Item .env.example .env

# Edit .env and set your MySQL password
```

### 3️⃣ Create Database
```bash
# From project root
mysql -u root -p < Database/schema.sql
```

### 4️⃣ Load Sample Data
```bash
mysql -u root -p safaria_db < Database/seed_data.sql
```

### 5️⃣ Test Connection
```bash
cd backend
node test-db.js
```

---

## 📁 Files Created

```
safaria/
├── Database/
│   ├── schema.sql           ← Database structure + triggers
│   ├── seed_data.sql        ← Sample data (3 of each type)
│   ├── README.md            ← Full documentation
│   └── SETUP_GUIDE.md       ← This file
│
└── backend/
    ├── db.js                ← MySQL connection pool
    ├── test-db.js           ← Connection test script
    └── .env.example         ← Environment template
```

---

## 🗃️ Database Tables

| Table | Records | Description |
|-------|---------|-------------|
| `artisans` | 3 | Artisan workshops (Fès, Marrakech, Essaouira) |
| `sejours` | 3 | Accommodations (Riad, Kasbah, Mountain house) |
| `caravanes` | 3 | Desert caravans (Merzouga, Zagora, M'Hamid) |
| `images_360` | 6 | 360° virtual tour images |
| `reservations` | 3 | Sample bookings |
| `users` | 1 | Admin user (username: `admin`, password: `admin123`) |

---

## 🔗 Database Relationships

```
artisans ──┐
sejours ───┼──► images_360 (polymorphic via itemType + itemId)
caravanes ─┘

artisans ──┐
sejours ───┼──► reservations (polymorphic via itemType + itemId)
caravanes ─┘
```

**Cascade Delete**: When you delete an artisan/sejour/caravane, all related images_360 and reservations are automatically deleted via triggers.

---

## ✅ Verification Checklist

After setup, verify:

```sql
USE safaria_db;

-- Check tables exist
SHOW TABLES;

-- Check data is loaded
SELECT COUNT(*) FROM artisans;    -- Should return 3
SELECT COUNT(*) FROM sejours;     -- Should return 3
SELECT COUNT(*) FROM caravanes;   -- Should return 3

-- Test relationship
SELECT a.name, i.imageUrl 
FROM artisans a
JOIN images_360 i ON i.itemType = 'artisanat' AND i.itemId = a.id
WHERE a.id = 1;
```

---

## 🔧 Troubleshooting

**Problem**: Cannot connect to MySQL  
**Solution**: 
```bash
# Start MySQL service
net start MySQL80
```

**Problem**: "Access denied"  
**Solution**: Check password in `.env` file

**Problem**: "Unknown database"  
**Solution**: Run `schema.sql` first

**Problem**: Module not found  
**Solution**: Run `npm install mysql2 dotenv`

---

## 📚 Next Steps

1. ✅ Database setup complete
2. ⏭️ Create Express API routes
3. ⏭️ Build controllers for CRUD operations
4. ⏭️ Add authentication middleware
5. ⏭️ Connect React frontend

---

## 📖 Full Documentation

For detailed information, see: `Database/README.md`

---

**Status**: ✅ Phase 2 & Phase 1.4 Complete  
**Date**: November 23, 2025

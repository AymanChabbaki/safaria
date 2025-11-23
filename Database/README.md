# 📊 SAFARIA Database Documentation

## Phase 2: Database Design & Phase 1.4: MySQL Setup

---

## ✔️ SECTION 1: Database Schema Overview

The SAFARIA database (`safaria_db`) is designed to support a tourism platform featuring artisan experiences, accommodations, and desert caravan tours in Morocco.

### Database Structure

```
safaria_db
├── artisans          (Artisan workshops and experiences)
├── sejours           (Accommodations and stays)
├── caravanes         (Desert caravan experiences)
├── users             (Admin authentication)
├── images_360        (360° virtual tour images)
└── reservations      (Booking management)
```

### Character Set
- **Charset**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Supports**: Arabic, French, and all international characters

---

## ✔️ SECTION 2: Table Relationships

### Relationship Diagram

```
┌─────────────┐
│  artisans   │◄─────┐
└─────────────┘      │
                     │
┌─────────────┐      │      ┌──────────────┐
│   sejours   │◄─────┼──────│  images_360  │
└─────────────┘      │      └──────────────┘
                     │      (itemType + itemId)
┌─────────────┐      │
│  caravanes  │◄─────┘
└─────────────┘      
      ▲              
      │              
      │      ┌──────────────────┐
      └──────│   reservations   │
             └──────────────────┘
             (itemType + itemId)
```

### Polymorphic Relationships

The database uses a **polymorphic relationship** pattern where:

1. **images_360** can belong to any experience type:
   - `itemType = 'artisanat'` → links to `artisans.id`
   - `itemType = 'sejour'` → links to `sejours.id`
   - `itemType = 'caravane'` → links to `caravanes.id`

2. **reservations** can book any experience type:
   - Same polymorphic pattern using `itemType` and `itemId`

### Cascade Deletion

Database triggers ensure data integrity:
- When an **artisan** is deleted → related images_360 and reservations are automatically deleted
- When a **sejour** is deleted → related images_360 and reservations are automatically deleted
- When a **caravane** is deleted → related images_360 and reservations are automatically deleted

### Indexes for Performance

Optimized indexes on:
- `itemType + itemId` for fast polymorphic queries
- `latitude + longitude` for location-based searches
- `category`, `status`, `reservation_date` for filtering

---

## ✔️ SECTION 3: Environment Configuration

### Step 1: Install Required Dependencies

```bash
cd backend
npm install mysql2 dotenv
```

### Step 2: Create `.env` File

Copy the `.env.example` file to `.env` in your backend directory:

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

### Step 3: Configure `.env` File

Edit the `.env` file with your MySQL credentials:

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

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

⚠️ **Important**: 
- Replace `yourpassword` with your actual MySQL root password
- Never commit `.env` to version control
- Change `JWT_SECRET` to a strong random string in production

---

## ✔️ SECTION 4: Database Connection File

The `db.js` file is located at: `backend/db.js`

### Features:
- ✅ Connection pooling for better performance
- ✅ Promise-based API for async/await syntax
- ✅ Automatic connection testing on startup
- ✅ Environment variable configuration
- ✅ Error handling and logging

### Usage Example:

```javascript
const { pool } = require('./db');

// Example query
async function getAllArtisans() {
    try {
        const [rows] = await pool.query('SELECT * FROM artisans');
        return rows;
    } catch (error) {
        console.error('Error fetching artisans:', error);
        throw error;
    }
}
```

---

## ✔️ SECTION 5: Testing Instructions

### Step 1: Install MySQL

Ensure MySQL is installed on your system:
- **Windows**: Download from [MySQL Website](https://dev.mysql.com/downloads/installer/)
- **Mac**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

### Step 2: Start MySQL Service

```powershell
# Windows - Start MySQL service
net start MySQL80

# Or use MySQL Workbench / XAMPP / WAMP
```

### Step 3: Run Database Schema

Open MySQL command line or MySQL Workbench and execute:

```bash
# Method 1: MySQL Command Line
mysql -u root -p < Database/schema.sql

# Method 2: From MySQL shell
mysql -u root -p
source C:/Users/HP/Desktop/safaria/Database/schema.sql;
```

### Step 4: Load Seed Data

```bash
# Method 1: MySQL Command Line
mysql -u root -p safaria_db < Database/seed_data.sql

# Method 2: From MySQL shell
mysql -u root -p
use safaria_db;
source C:/Users/HP/Desktop/safaria/Database/seed_data.sql;
```

### Step 5: Verify Database Creation

```sql
-- Connect to MySQL
mysql -u root -p

-- Check database
SHOW DATABASES LIKE 'safaria_db';

-- Use database
USE safaria_db;

-- List all tables
SHOW TABLES;

-- Verify data
SELECT COUNT(*) FROM artisans;
SELECT COUNT(*) FROM sejours;
SELECT COUNT(*) FROM caravanes;
SELECT COUNT(*) FROM reservations;
SELECT COUNT(*) FROM images_360;
SELECT COUNT(*) FROM users;

-- Test a query
SELECT * FROM artisans;
```

Expected output:
```
+------------------------+
| Tables_in_safaria_db   |
+------------------------+
| artisans               |
| caravanes              |
| images_360             |
| reservations           |
| sejours                |
| users                  |
+------------------------+
```

### Step 6: Test Node.js Connection

Create a test file `backend/test-db.js`:

```javascript
const { pool } = require('./db');

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        // Test query
        const [artisans] = await pool.query('SELECT * FROM artisans');
        console.log(`✅ Found ${artisans.length} artisans`);
        
        const [sejours] = await pool.query('SELECT * FROM sejours');
        console.log(`✅ Found ${sejours.length} sejours`);
        
        const [caravanes] = await pool.query('SELECT * FROM caravanes');
        console.log(`✅ Found ${caravanes.length} caravanes`);
        
        console.log('\n🎉 Database is working perfectly!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        process.exit(1);
    }
}

testDatabase();
```

Run the test:

```bash
cd backend
node test-db.js
```

Expected output:
```
✅ Database connected successfully!
📊 Connected to database: safaria_db
Testing database connection...
✅ Found 3 artisans
✅ Found 3 sejours
✅ Found 3 caravanes

🎉 Database is working perfectly!
```

### Step 7: Verify Relationships

Test polymorphic relationships:

```sql
-- Get all 360 images for artisan #1
SELECT a.name, i.imageUrl 
FROM artisans a
JOIN images_360 i ON i.itemType = 'artisanat' AND i.itemId = a.id
WHERE a.id = 1;

-- Get all reservations with item details
SELECT 
    r.id,
    r.user_name,
    r.itemType,
    r.reservation_date,
    CASE 
        WHEN r.itemType = 'artisanat' THEN (SELECT name FROM artisans WHERE id = r.itemId)
        WHEN r.itemType = 'sejour' THEN (SELECT name FROM sejours WHERE id = r.itemId)
        WHEN r.itemType = 'caravane' THEN (SELECT name FROM caravanes WHERE id = r.itemId)
    END as item_name
FROM reservations r;
```

---

## 🔒 Security Notes

1. **Password Hashing**: The seed data includes a hashed password. In production:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hashedPassword = await bcrypt.hash('admin123', 10);
   ```

2. **Environment Variables**: Never commit `.env` file to Git
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   ```

3. **Database User**: Create a dedicated MySQL user for the application (don't use root in production)
   ```sql
   CREATE USER 'safaria_user'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT ALL PRIVILEGES ON safaria_db.* TO 'safaria_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

## 📝 Next Steps

1. ✅ Database schema created
2. ✅ Sample data loaded
3. ✅ Connection configured
4. ⏭️ Create API endpoints (routes/controllers)
5. ⏭️ Implement authentication middleware
6. ⏭️ Connect frontend to backend

---

## 🆘 Troubleshooting

### Error: "Access denied for user"
- Check your MySQL username and password in `.env`
- Verify MySQL service is running

### Error: "Unknown database 'safaria_db'"
- Run `schema.sql` first to create the database

### Error: "Cannot find module 'mysql2'"
- Run `npm install mysql2 dotenv` in backend directory

### Connection timeout
- Check if MySQL is running: `net start MySQL80`
- Verify firewall settings allow port 3306

---

## 📚 Additional Resources

- [MySQL2 Documentation](https://www.npmjs.com/package/mysql2)
- [MySQL Best Practices](https://dev.mysql.com/doc/)
- [Node.js Database Guide](https://nodejs.org/en/docs/guides/)

---

**Database Version**: 1.0  
**Last Updated**: November 23, 2025  
**Maintained by**: SAFARIA Development Team

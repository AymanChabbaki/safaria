# 🚀 Safaria Platform - Vercel Deployment Guide

## 📋 Table of Contents
1. [Frontend Deployment (Vercel)](#frontend-deployment)
2. [Backend Deployment (Vercel)](#backend-deployment)
3. [Image Storage Solution (Cloudinary - Free)](#image-storage-solution)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Steps](#post-deployment-steps)

---

## 🎨 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier)
- GitHub repository connected to Vercel

### Steps

1. **Install Vercel CLI (Optional)**
```bash
npm install -g vercel
```

2. **Create `vercel.json` in Frontend Root**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

3. **Update `package.json` Scripts**
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

4. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `Frontend/safaria` folder as root directory
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variables (see below)
   - Click "Deploy"

---

## 🔧 Backend Deployment (Vercel)

### Steps

1. **Create `vercel.json` in Backend Root**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. **Update `package.json`**
```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

3. **Deploy Backend**
   - Import backend folder separately in Vercel
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

---

## 🖼️ Image Storage Solution (Cloudinary - Free Tier)

### Why Cloudinary?
- ✅ **Free Tier**: 25GB storage, 25GB bandwidth/month
- ✅ **CDN Delivery**: Fast image loading worldwide
- ✅ **Image Transformation**: Automatic optimization, resizing
- ✅ **Easy Integration**: Simple Node.js SDK
- ✅ **No Vercel Limitations**: Serverless functions don't store files

### Setup Cloudinary

1. **Create Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for free account
   - Note your credentials:
     - Cloud Name
     - API Key
     - API Secret

2. **Install Cloudinary SDK**
```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

3. **Create Cloudinary Configuration**

Create `backend/src/config/cloudinary.js`:
```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Storage for artisan images
const artisanStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/artisans',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage for sejour images
const sejourStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/sejours',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage for caravane images
const caravaneStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/caravanes',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage for 360 images
const image360Storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/360-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
  },
});

module.exports = {
  cloudinary,
  profileStorage,
  artisanStorage,
  sejourStorage,
  caravaneStorage,
  image360Storage,
};
```

4. **Update Upload Configuration**

Update `backend/src/config/upload.js`:
```javascript
const multer = require('multer');
const path = require('path');
const {
  profileStorage,
  artisanStorage,
  sejourStorage,
  caravaneStorage,
  image360Storage,
} = require('./cloudinary');

// Helper to determine storage based on route
const getStorage = (req) => {
  const route = req.baseUrl || req.url;
  
  if (route.includes('/auth') || route.includes('/profile')) {
    return profileStorage;
  } else if (route.includes('/artisan')) {
    return artisanStorage;
  } else if (route.includes('/sejour')) {
    return sejourStorage;
  } else if (route.includes('/caravane')) {
    return caravaneStorage;
  } else if (route.includes('/360')) {
    return image360Storage;
  }
  
  return artisanStorage; // Default
};

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(), // We'll handle storage in controller
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Create upload middleware that uses Cloudinary
const createCloudinaryUpload = (fieldName, maxCount = 1) => {
  return (req, res, next) => {
    const storage = getStorage(req);
    const cloudinaryUpload = multer({ storage }).array(fieldName, maxCount);
    cloudinaryUpload(req, res, next);
  };
};

module.exports = {
  upload,
  createCloudinaryUpload,
  singleUpload: upload.single('image'),
  multipleUpload: upload.array('images', 10),
  profileUpload: upload.single('photo'),
};
```

5. **Update Controllers to Use Cloudinary**

Update `backend/src/controllers/authController.js`:
```javascript
const { cloudinary } = require('../config/cloudinary');

// Update profile with photo upload
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // Handle Cloudinary upload
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'safaria/profiles',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      });
      
      updateData.photo = result.secure_url;
      
      // Delete old photo from Cloudinary if exists
      const user = await User.findByPk(userId);
      if (user.photo && user.photo.includes('cloudinary')) {
        const publicId = user.photo.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(`safaria/profiles/${publicId}`);
      }
    }

    const [updated] = await User.update(updateData, {
      where: { id: userId },
    });

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

6. **Update Image Upload Middleware**

Create `backend/src/middleware/cloudinaryUpload.js`:
```javascript
const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadToCloudinary = (folder) => {
  return async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `safaria/${folder}`,
          transformation: [{ width: 1200, height: 800, crop: 'limit' }],
        },
        (error, result) => {
          if (error) {
            return next(error);
          }
          req.file.path = result.secure_url;
          req.file.cloudinary_id = result.public_id;
          next();
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
      next(error);
    }
  };
};

const uploadMultipleToCloudinary = (folder) => {
  return async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    try {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `safaria/${folder}`,
              transformation: [{ width: 1200, height: 800, crop: 'limit' }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve({
                path: result.secure_url,
                cloudinary_id: result.public_id,
              });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      const results = await Promise.all(uploadPromises);
      req.files = results;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
};
```

7. **Install Additional Dependencies**
```bash
npm install streamifier
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.vercel.app
VITE_APP_NAME=Safaria
```

### Backend (.env)
```env
# Database
DATABASE_URL=your_database_url
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=safaria
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 📦 Post-Deployment Steps

### 1. Update API URLs

Update `frontend/src/utils/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 2. Update CORS in Backend

Update `backend/src/server.js`:
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
```

### 3. Database Setup
- Use a cloud database (e.g., PlanetScale, Railway, AWS RDS)
- Update connection strings in environment variables

### 4. Test Image Upload
- Upload a profile picture
- Upload artisan/sejour/caravane images
- Verify images appear via Cloudinary URLs

### 5. Migrate Existing Images

Create migration script `backend/scripts/migrateToCloudinary.js`:
```javascript
const { cloudinary } = require('../src/config/cloudinary');
const fs = require('fs');
const path = require('path');
const { Artisan, Sejour, Caravane, User } = require('../src/models');

async function migrateImages() {
  try {
    // Migrate profile photos
    const users = await User.findAll();
    for (const user of users) {
      if (user.photo && !user.photo.includes('cloudinary')) {
        const localPath = path.join(__dirname, '../src/uploads/', user.photo);
        if (fs.existsSync(localPath)) {
          const result = await cloudinary.uploader.upload(localPath, {
            folder: 'safaria/profiles',
          });
          await user.update({ photo: result.secure_url });
          console.log(`Migrated user ${user.id} photo`);
        }
      }
    }

    // Similar migrations for artisans, sejours, caravanes...
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

migrateImages();
```

---

## 🎯 Alternative Free Image Storage Solutions

### 1. **ImgBB** (Free)
- 32MB per image
- Unlimited uploads
- No account required for uploads
- API available

### 2. **ImageKit** (Free Tier)
- 20GB bandwidth/month
- 20GB storage
- Real-time image optimization
- CDN delivery

### 3. **Supabase Storage** (Free)
- 1GB storage
- Integrated with PostgreSQL
- Built-in CDN
- Simple API

### 4. **Firebase Storage** (Free)
- 5GB storage
- 1GB/day downloads
- Google Cloud CDN
- Easy integration

---

## 📝 Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Vercel
- [ ] Cloudinary account created
- [ ] Environment variables configured
- [ ] Database connected
- [ ] CORS configured
- [ ] Image upload tested
- [ ] Existing images migrated
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics setup (optional)

---

## 🔧 Troubleshooting

### Issue: Images not uploading
- Check Cloudinary credentials
- Verify file size limits
- Check network requests in browser DevTools

### Issue: CORS errors
- Verify FRONTEND_URL in backend env
- Check corsOptions configuration
- Ensure credentials: true is set

### Issue: Database connection failed
- Verify DATABASE_URL
- Check database whitelist IPs (add Vercel IPs)
- Test connection locally first

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Multer-Storage-Cloudinary](https://github.com/affanshahid/multer-storage-cloudinary)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🎉 Success!

Your Safaria platform is now deployed with:
- ✅ Fast CDN-delivered images
- ✅ Scalable serverless architecture
- ✅ Free image storage solution
- ✅ Professional deployment setup

**Next Steps:**
1. Share your app URL
2. Monitor usage on Vercel dashboard
3. Track image uploads on Cloudinary
4. Scale as needed!

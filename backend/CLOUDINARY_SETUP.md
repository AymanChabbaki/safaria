# 🎨 Cloudinary Integration - Setup Complete!

## ✅ What's Been Done

1. **Created Cloudinary Configuration** (`src/config/cloudinary.js`)
   - Configured with your credentials
   - Set up separate storage for profiles, artisans, sejours, caravanes, and 360 images
   - Auto-optimization enabled

2. **Updated Upload Middleware** (`src/middleware/upload.js`)
   - Added Cloudinary storage support
   - Created helper functions for single and multiple uploads
   - Maintained backward compatibility

3. **Created Cloudinary Upload Helpers** (`src/middleware/cloudinaryUpload.js`)
   - Stream-based uploads (no temp files needed)
   - Support for single and multiple file uploads
   - Delete function for removing images

4. **Updated Environment Variables** (`.env`)
   - Added your Cloudinary credentials
   - Ready for production use

5. **Installed Dependencies**
   - ✅ cloudinary
   - ✅ multer-storage-cloudinary  
   - ✅ streamifier

---

## 🔄 How to Update Your Routes

### Option 1: Use Cloudinary Storage (Recommended)

**For single image upload (e.g., profile photo):**

```javascript
const { createCloudinaryUpload } = require('../middleware/upload');

// In your route
router.post('/update-profile', 
  authenticate,
  createCloudinaryUpload('photo', 1), // field name, max count
  authController.updateProfile
);
```

**For multiple images (e.g., artisan photos):**

```javascript
const { createCloudinaryUpload } = require('../middleware/upload');

router.post('/artisans',
  authenticate,
  createCloudinaryUpload('images', 10), // up to 10 images
  artisanController.create
);
```

### Option 2: Use Memory + Stream Upload

**Step 1: Update route to use memory storage**

```javascript
const { upload } = require('../middleware/upload');
const { uploadToCloudinary, uploadMultipleToCloudinary } = require('../middleware/cloudinaryUpload');

// Single image
router.post('/update-profile',
  authenticate,
  upload.single('photo'), // Stores in memory
  uploadToCloudinary('profiles'), // Streams to Cloudinary
  authController.updateProfile
);

// Multiple images
router.post('/artisans',
  authenticate,
  upload.array('images', 10),
  uploadMultipleToCloudinary('artisans'),
  artisanController.create
);
```

**Step 2: Update controller to use Cloudinary URLs**

```javascript
// Before (local storage)
const imagePath = req.file.path; // e.g., 'src/uploads/profiles/image-123.jpg'

// After (Cloudinary)
const imageUrl = req.file.url; // e.g., 'https://res.cloudinary.com/dzefefwb2/image/upload/...'
const cloudinaryId = req.file.cloudinary_id; // For deletion later
```

---

## 📝 Example: Update Auth Controller

**Before:**
```javascript
exports.updateProfile = async (req, res) => {
  const updateData = {};
  
  if (req.file) {
    updateData.photo = req.file.filename; // Just filename
  }
  
  // ... update user
};
```

**After:**
```javascript
exports.updateProfile = async (req, res) => {
  const updateData = {};
  
  if (req.file) {
    updateData.photo = req.file.url; // Full Cloudinary URL
    // Optionally delete old photo from Cloudinary
    if (user.photo && user.photo.includes('cloudinary')) {
      const publicId = user.photo.match(/safaria\/[^.]+/)[0];
      await deleteFromCloudinary(publicId);
    }
  }
  
  // ... update user
};
```

---

## 🗑️ Deleting Images from Cloudinary

```javascript
const { deleteFromCloudinary } = require('../middleware/cloudinaryUpload');

// In your controller
if (oldImageUrl && oldImageUrl.includes('cloudinary')) {
  const publicId = oldImageUrl.match(/safaria\/[^.]+/)[0];
  await deleteFromCloudinary(publicId);
}
```

---

## 🚀 For Vercel Deployment

Add these environment variables in Vercel dashboard:

```env
CLOUDINARY_CLOUD_NAME=dzefefwb2
CLOUDINARY_API_KEY=271743144647864
CLOUDINARY_API_SECRET=AW4BMN7m-0IbGvdzvS6CDGggwvE
```

---

## ✨ Benefits

- ✅ **No local storage** - Perfect for Vercel serverless
- ✅ **Auto-optimization** - Images automatically compressed and resized
- ✅ **CDN delivery** - Fast loading worldwide
- ✅ **Free tier** - 25GB storage + 25GB bandwidth/month
- ✅ **Easy management** - View/delete images from Cloudinary dashboard

---

## 🧪 Testing

1. Start your server: `npm run dev`
2. Upload a profile photo through your app
3. Check Cloudinary dashboard: [cloudinary.com/console](https://console.cloudinary.com/console)
4. Verify image appears in `safaria/profiles/` folder
5. Check that the image URL in database is a Cloudinary URL

---

## 📦 Next Steps

1. Update your auth routes to use Cloudinary
2. Update artisan/sejour/caravane routes
3. Test image uploads locally
4. Deploy to Vercel
5. Test again in production

Your images will now be stored in Cloudinary instead of local disk! 🎉

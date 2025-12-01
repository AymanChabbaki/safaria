# Image Gallery & 360° Implementation - Summary

## Problem
The system needed to support:
1. **Multiple regular images** per item (artisan/sejour/caravane) instead of just one main_image
2. **Optional 360° images** that should only be shown when available
3. Display only regular photos in gallery, with 360° viewer as separate feature

## Solution Implemented

### 1. Database Changes ✅
**File**: `Database/add_gallery_images.sql`

- Added `images` JSON column to `artisans`, `sejours`, and `caravanes` tables
- Migrated existing `main_image` data to new `images` array
- Sample data: 
  - Artisan #1: 4 images
  - Sejour #1: 5 images
  - Caravane #1: 6 images

**Database Structure**:
```sql
-- Each table now has:
main_image VARCHAR(255)  -- Legacy field (kept for compatibility)
images JSON              -- New field: ["url1", "url2", "url3", ...]
```

**Existing 360° Images** (separate table):
- `images_360` table remains unchanged
- Links to items via `itemType` and `itemId`
- Current 360° images: artisan #1, sejour #1, caravanes #1 & #2

### 2. Backend API Changes ✅
**Files**: 
- `backend/src/controllers/artisanController.js`
- `backend/src/controllers/sejourController.js`
- `backend/src/controllers/caravaneController.js`

**Changes Made**:

#### `getById` Methods:
- Parse `images` JSON array from database
- Fallback to `main_image` if images array is empty
- Add `has360` boolean flag (true if 360° images exist)

```javascript
// Response structure:
{
  success: true,
  data: {
    id: 1,
    name: "...",
    images: ["/uploads/...", "/uploads/...", ...],  // NEW
    main_image: "/uploads/...",                     // LEGACY
    images_360: [...],                              // 360° images
    has360: true                                     // NEW FLAG
  }
}
```

#### `getAll` Methods:
- Parse `images` JSON array for each item in list
- Fallback to `main_image` array if parsing fails

### 3. Frontend - Experiences Page ✅
**File**: `Frontend/safaria/src/pages/Experiences/ExperiencesPage.jsx`

**Already Implemented** (no changes needed):
- Uses `item.images?.[0]` to display first image
- Works perfectly with new images array

### 4. Frontend - Details Page ✅
**File**: `Frontend/safaria/src/pages/Details/UniversalDetailsPage.jsx`

**Major Changes**:

#### Image Gallery with Swiper:
```jsx
// Parse images array with fallback
const images = item.images && item.images.length > 0 
  ? item.images.map(img => `http://localhost:5000${img}`)
  : item.main_image 
    ? [`http://localhost:5000${item.main_image}`]
    : ['/logoSAFARIA.png'];

// Check if 360° images available
const has360Images = item.has360 || images360.length > 0;
```

#### Main Gallery Features:
- **Swiper carousel** with navigation arrows and pagination dots
- Shows all images in `images` array
- Full-size display (500px height)
- Smooth transitions between images

#### Thumbnail Gallery:
- Only displayed when `images.length > 1`
- 4 thumbnails per row
- Click to navigate main gallery
- 100px height thumbnails

#### 360° Button:
- **Conditionally displayed**: Only shown if `has360Images === true`
- Positioned bottom-right as small button
- Camera icon + "View 360°" text
- Opens fullscreen 360° viewer on click

#### Layout:
```
┌─────────────────────────────────────┐
│  Main Gallery (Swiper)              │
│  - Navigation arrows                │
│  - Pagination dots                  │
│  - Favorite/Share buttons (top-left)│
│  - [360° Button] (bottom-right)     │ <- Only if has360Images
└─────────────────────────────────────┘
┌───┬───┬───┬───┐
│ T │ T │ T │ T │  <- Thumbnail gallery (if > 1 image)
└───┴───┴───┴───┘
```

## User Experience Flow

### Browsing Experiences:
1. User sees experience cards with **first image** from gallery
2. Hover shows "Voir les détails" overlay

### Viewing Details:
1. Opens detail page with **image gallery**
2. Can browse through all images using arrows/dots/thumbnails
3. If item has 360° images:
   - **"View 360°" button** appears (bottom-right)
   - Click opens fullscreen 360° viewer
   - Can close and return to regular gallery

### Places WITHOUT 360° Images:
- No 360° button shown
- Only regular photo gallery displayed
- Clean, uncluttered interface

## API Response Examples

### Item WITH Multiple Images AND 360°:
```json
{
  "id": 1,
  "name": "Atelier de Poterie Fès",
  "images": [
    "/images/artisan-1-main.jpg",
    "/images/artisan-1-workshop.jpg",
    "/images/artisan-1-products.jpg",
    "/images/artisan-1-detail.jpg"
  ],
  "main_image": "/uploads/artisans/poterie-fes-360.jpg",
  "images_360": [{
    "id": 1,
    "imageUrl": "/uploads/360/poterie-fes.jpg"
  }],
  "has360": true
}
```

### Item WITH Only Regular Images (NO 360°):
```json
{
  "id": 2,
  "name": "Tissage Berbère Marrakech",
  "images": [
    "/uploads/artisans/weaving-marrakech.jpg"
  ],
  "main_image": "/uploads/artisans/weaving-marrakech.jpg",
  "images_360": [],
  "has360": false
}
```

## Technical Implementation Details

### Image Parsing (Backend):
```javascript
let parsedImages = [];
try {
  if (item.images) {
    parsedImages = typeof item.images === 'string' 
      ? JSON.parse(item.images) 
      : item.images;
  }
} catch (e) {
  console.warn('Failed to parse images JSON:', e);
  parsedImages = item.main_image ? [item.main_image] : [];
}
```

### Swiper Configuration (Frontend):
```javascript
// Main Gallery
<Swiper
  modules={[Navigation, Pagination, Thumbs]}
  navigation
  pagination={{ clickable: true }}
  thumbs={{ swiper: thumbsSwiper }}
/>

// Thumbnails
<Swiper
  modules={[Thumbs]}
  onSwiper={setThumbsSwiper}
  slidesPerView={4}
  spaceBetween={10}
  watchSlidesProgress
/>
```

### 360° Conditional Rendering:
```javascript
{has360Images && (
  <button onClick={() => setShow360(true)}>
    <Camera />
    View 360°
  </button>
)}
```

## Database Query Examples

### Add Images to Item:
```sql
UPDATE artisans 
SET images = JSON_ARRAY(
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg'
)
WHERE id = 1;
```

### Add Single Image to Existing Array:
```sql
UPDATE artisans 
SET images = JSON_ARRAY_APPEND(images, '$', '/images/new-image.jpg')
WHERE id = 1;
```

### Remove Image by Index:
```sql
UPDATE artisans 
SET images = JSON_REMOVE(images, '$[2]')  -- Remove 3rd image
WHERE id = 1;
```

### Check Which Items Have 360°:
```sql
SELECT 
  a.id, 
  a.name,
  JSON_LENGTH(a.images) as regular_images_count,
  EXISTS(SELECT 1 FROM images_360 WHERE itemType='artisanat' AND itemId=a.id) as has_360
FROM artisans a;
```

## Testing Instructions

1. **Run Database Migration**:
   ```bash
   mysql -u root -p safaria_db < Database/add_gallery_images.sql
   ```

2. **Restart Backend**:
   ```bash
   cd backend
   npm start
   ```

3. **Test Experiences Page**:
   - Navigate to `/experiences`
   - Verify cards show first image from gallery
   - Check all categories work

4. **Test Details Page - With 360°**:
   - Click Artisan #1, Sejour #1, or Caravane #1/#2
   - Should see:
     ✓ Image gallery with multiple photos
     ✓ Thumbnail strip (if multiple images)
     ✓ **"View 360°" button visible**
     ✓ Click 360° button opens fullscreen viewer

5. **Test Details Page - Without 360°**:
   - Click any other item (e.g., Artisan #2)
   - Should see:
     ✓ Image gallery (even if single image)
     ✓ **NO 360° button** (clean interface)
     ✓ Only regular photo viewing

## Benefits

✅ **Flexible**: Support 1 to unlimited images per item
✅ **Backward Compatible**: Falls back to main_image if needed
✅ **Conditional UI**: 360° button only when relevant
✅ **Better UX**: Users can browse multiple photos before booking
✅ **Optional 360°**: Virtual tours are a premium feature, not required
✅ **Performance**: Images lazy-loaded in Swiper
✅ **Responsive**: Gallery adapts to screen size

## Next Steps (Optional Enhancements)

1. **Admin Upload UI**: Create interface to add/remove images
2. **Image Optimization**: Auto-resize and compress uploads
3. **Lightbox**: Full-screen image viewer with zoom
4. **Video Support**: Add video URLs to images array
5. **Image Captions**: Add descriptions to each photo
6. **Image Ordering**: Drag-and-drop reorder in admin panel

# SAFARIA Platform - Frontend Phase 4A Documentation

## 📋 Phase 4A Implementation Summary

This document covers the **Frontend Architecture, Routing, and Layout Components** implementation for the SAFARIA platform.

---

## ✅ Completed Components

### 1. **State Management (Zustand)**

#### **Main Store** (`src/store/useAppStore.js`)
Global application state management including:
- ✅ Loading state management
- ✅ Error handling state
- ✅ Dialog/Modal management
- ✅ Selected item state (for map & details)
- ✅ Map state (center, zoom, markers)
- ✅ Filter state (category, price range, search)
- ✅ User state
- ✅ Items cache (artisans, sejours, caravanes)
- ✅ Reservation data state
- ✅ Mobile menu state
- ✅ Toast notifications system
- ✅ Utility functions (getFilteredItems, getAllItems)

#### **Auth Store** (`src/store/useAuthStore.js`)
Authentication-specific state with persistence:
- ✅ Login/Register/Logout actions
- ✅ Profile update functionality
- ✅ Password change
- ✅ Auth status checking (localStorage sync)
- ✅ Admin role checking
- ✅ Token management
- ✅ localStorage persistence with Zustand middleware

---

### 2. **API Service Layer** (`src/utils/api.js`)
Comprehensive API client with:
- ✅ Axios instance configuration
- ✅ Request interceptors (token injection)
- ✅ Response interceptors (error handling)
- ✅ 34+ API functions covering:
  - Artisans CRUD (6 functions)
  - Sejours CRUD (6 functions)
  - Caravanes CRUD (6 functions)
  - Generic item operations (2 functions)
  - Reservations (5 functions)
  - 360° Images (3 functions)
  - Authentication (6 functions)

---

### 3. **Routing Configuration** (`src/router.jsx`)

#### **Public Routes:**
- ✅ `/` - Home Page
- ✅ `/map` - Interactive Map
- ✅ `/artisanat/:id` - Artisan Details
- ✅ `/sejour/:id` - Sejour Details
- ✅ `/caravane/:id` - Caravane Details

#### **Auth Routes** (redirect if logged in):
- ✅ `/login` - Login Page
- ✅ `/register` - Register Page

#### **Protected Routes** (require authentication):
- ✅ `/reservation` - User Reservations

#### **Admin Routes** (require admin role):
- ✅ `/admin` - Dashboard
- ✅ `/admin/artisans` - Manage Artisans
- ✅ `/admin/sejours` - Manage Sejours
- ✅ `/admin/caravanes` - Manage Caravanes
- ✅ `/admin/reservations` - Manage Reservations

#### **Error Handling:**
- ✅ 404 Not Found Page
- ✅ Error boundary support

---

### 4. **Layout Components**

#### **RootLayout** (`src/layouts/RootLayout.jsx`)
- ✅ Main layout wrapper
- ✅ Navbar integration
- ✅ Footer integration
- ✅ Auth check on mount
- ✅ Outlet for nested routes

#### **Navbar** (`src/components/Navbar.jsx`)
- ✅ Responsive navigation bar
- ✅ Logo with branding
- ✅ Navigation links (Home, Map)
- ✅ User menu dropdown (for authenticated users)
- ✅ Admin dashboard link (for admin users)
- ✅ Login/Register buttons (for guests)
- ✅ Mobile hamburger menu
- ✅ Authentication state integration
- ✅ **Styles:** `src/components/Navbar.css`

#### **Footer** (`src/components/Footer.jsx`)
- ✅ Brand information
- ✅ Quick links section
- ✅ Contact information
- ✅ Social media links (Facebook, Instagram, Twitter)
- ✅ Copyright notice
- ✅ Responsive grid layout
- ✅ **Styles:** `src/components/Footer.css`

#### **PageContainer** (`src/components/PageContainer.jsx`)
- ✅ Reusable page wrapper
- ✅ Configurable max-width and padding
- ✅ Consistent layout across pages
- ✅ **Styles:** `src/components/PageContainer.css`

---

### 5. **Page Components**

#### **Public Pages**
- ✅ **HomePage** (`src/pages/Home/HomePage.jsx`)
  - Hero section with gradient background
  - Features grid (Artisanat, Séjours, Caravanes)
  - Call-to-action section
  - Responsive design
  - **Styles:** `src/pages/Home/HomePage.css`

- ✅ **MapPage** (`src/pages/Map/MapPage.jsx`)
  - Placeholder for Leaflet map integration
  - Ready for Phase 4B implementation

- ✅ **ArtisanatDetailsPage** (`src/pages/Details/ArtisanatDetailsPage.jsx`)
- ✅ **SejourDetailsPage** (`src/pages/Details/SejourDetailsPage.jsx`)
- ✅ **CaravaneDetailsPage** (`src/pages/Details/CaravaneDetailsPage.jsx`)
  - All detail pages with dynamic `:id` routing
  - Placeholder content ready for Phase 4B

- ✅ **ReservationPage** (`src/pages/Reservation/ReservationPage.jsx`)
  - Protected route (requires authentication)

#### **Auth Pages**
- ✅ **LoginPage** (`src/pages/Auth/LoginPage.jsx`)
  - Email/password form
  - Form validation
  - Error handling display
  - Integration with useAuthStore
  - Link to registration page
  - Inline styles (modern card design)

- ✅ **RegisterPage** (`src/pages/Auth/RegisterPage.jsx`)
  - Name, email, password, confirm password fields
  - Client-side password matching validation
  - Integration with useAuthStore
  - Link to login page
  - Inline styles (modern card design)

#### **Admin Pages**
- ✅ **AdminDashboardPage** (`src/pages/Admin/AdminDashboardPage.jsx`)
  - Overview dashboard with navigation cards
  - Links to all management sections
  
- ✅ **AdminArtisansPage** (`src/pages/Admin/AdminArtisansPage.jsx`)
- ✅ **AdminSejoursPage** (`src/pages/Admin/AdminSejoursPage.jsx`)
- ✅ **AdminCaravanesPage** (`src/pages/Admin/AdminCaravanesPage.jsx`)
- ✅ **AdminReservationsPage** (`src/pages/Admin/AdminReservationsPage.jsx`)
  - All admin CRUD pages with placeholders

#### **Error Pages**
- ✅ **NotFoundPage** (`src/pages/NotFoundPage.jsx`)
  - 404 error page
  - Link back to home

---

### 6. **Global Styles**

#### **index.css** (Global CSS Reset & Variables)
- ✅ CSS Reset (`* { margin: 0; padding: 0; box-sizing: border-box; }`)
- ✅ CSS Custom Properties (variables):
  - Color palette (primary, secondary, text, background)
  - Spacing scale (xs, sm, md, lg, xl)
  - Border radius (sm, md, lg)
  - Box shadows (sm, md, lg)
- ✅ Typography styles (h1-h6, p, a)
- ✅ Form elements base styles
- ✅ Custom scrollbar styling (Webkit)
- ✅ Responsive base font size

#### **App.css** (Layout Utilities)
- ✅ Root layout styles
- ✅ Utility classes (text-center, margins, paddings)
- ✅ Fade-in animation

---

### 7. **Environment Configuration**
- ✅ `.env.example` - Template for environment variables
- ✅ `.env` - Local environment configuration
  - `VITE_API_URL=http://localhost:5000`

---

## 🚀 Running the Frontend

### **Prerequisites:**
- Node.js installed
- Backend server running on port 5000

### **Commands:**

```powershell
# Navigate to frontend directory
cd "c:\Users\HP\Desktop\safaria\Frontend\safaria"

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The application will be available at: **http://localhost:5173/**

---

## 🔗 API Integration

All API calls are centralized in `src/utils/api.js`:

```javascript
import api from './utils/api';

// Example usage:
const artisans = await api.getArtisans();
const loginResult = await api.login({ email, password });
const reservation = await api.createReservation(data);
```

---

## 🎨 Styling Architecture

### **Approach:**
- Component-scoped CSS files (e.g., `Navbar.css`, `Footer.css`)
- Global variables via CSS custom properties (`--primary-color`, etc.)
- Inline styles for simple pages (auth pages, placeholders)
- Responsive design with mobile-first approach

### **Color Palette:**
- Primary: `#667eea` (Purple-Blue)
- Secondary: `#764ba2` (Dark Purple)
- Text Dark: `#2c3e50`
- Text Light: `#7f8c8d`
- Background: `#f5f7fa`

---

## 🔐 Authentication Flow

1. User submits login/register form
2. `useAuthStore` action called (login/register)
3. API request sent via `api.js`
4. Token received and stored in localStorage
5. User state updated in Zustand store
6. Navigation redirects to home page
7. Navbar updates to show user menu

---

## 🛡️ Protected Routes

Routes are protected using wrapper components:

```javascript
<ProtectedRoute>
  <ReservationPage />
</ProtectedRoute>

<ProtectedRoute adminOnly={true}>
  <AdminDashboardPage />
</ProtectedRoute>
```

Unauthenticated users are redirected to `/login`.  
Non-admin users trying to access admin routes are redirected to `/`.

---

## 📦 Installed Dependencies

```json
{
  "axios": "^1.7.9",
  "react-router-dom": "^7.2.1",
  "leaflet": "^1.9.4",
  "zustand": "^5.0.3",
  "react-icons": "^5.4.0"
}
```

---

## 🗂️ Project Structure

```
Frontend/safaria/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── PageContainer.jsx
│   │   └── PageContainer.css
│   ├── context/         # React context providers (future)
│   ├── hooks/           # Custom React hooks (future)
│   ├── layouts/         # Layout components
│   │   └── RootLayout.jsx
│   ├── pages/           # Page components
│   │   ├── Admin/       # Admin pages
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminArtisansPage.jsx
│   │   │   ├── AdminSejoursPage.jsx
│   │   │   ├── AdminCaravanesPage.jsx
│   │   │   └── AdminReservationsPage.jsx
│   │   ├── Auth/        # Auth pages
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── Details/     # Details pages
│   │   │   ├── ArtisanatDetailsPage.jsx
│   │   │   ├── SejourDetailsPage.jsx
│   │   │   └── CaravaneDetailsPage.jsx
│   │   ├── Home/        # Home page
│   │   │   ├── HomePage.jsx
│   │   │   └── HomePage.css
│   │   ├── Map/         # Map page
│   │   │   └── MapPage.jsx
│   │   ├── Reservation/ # Reservation page
│   │   │   └── ReservationPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── store/           # Zustand stores
│   │   ├── useAppStore.js
│   │   └── useAuthStore.js
│   ├── utils/           # Utility functions
│   │   └── api.js       # API service layer
│   ├── App.css          # Global app styles
│   ├── App.jsx          # Main App component
│   ├── index.css        # Global CSS reset & variables
│   ├── main.jsx         # React entry point
│   └── router.jsx       # React Router configuration
├── .env                 # Environment variables
├── .env.example         # Environment template
├── index.html           # HTML entry point
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

---

## ✅ Phase 4A Checklist

- [x] Folder structure created
- [x] Dependencies installed (axios, react-router-dom, leaflet, zustand, react-icons)
- [x] Zustand stores (useAppStore, useAuthStore)
- [x] API service layer (api.js)
- [x] React Router configuration with protected routes
- [x] Layout components (RootLayout, Navbar, Footer, PageContainer)
- [x] Page components (Home, Map, Details, Reservation, Auth, Admin, 404)
- [x] Global styles (index.css, App.css)
- [x] Environment configuration (.env)
- [x] Frontend dev server tested and running

---

## 🔜 Next Steps (Phase 4B)

1. **Implement Map Page with Leaflet:**
   - Display interactive map of Morocco
   - Marker clustering for items
   - Map filters and search

2. **Build Details Pages:**
   - Fetch item data by ID
   - Display images, description, price
   - 360° image viewer integration
   - Reservation form

3. **Create Admin CRUD Interfaces:**
   - Tables with data fetching
   - Create/Edit forms with image upload
   - Delete confirmations

4. **User Profile & Reservations:**
   - User profile page
   - Reservation history table
   - Cancel reservation functionality

5. **UI Enhancements:**
   - Loading spinners
   - Toast notifications
   - Modal dialogs
   - Form validation

---

## 📝 Notes

- All page components are currently placeholders ready for Phase 4B implementation
- Backend API must be running on port 5000 for full functionality
- Authentication is fully integrated with localStorage persistence
- Mobile-responsive design implemented across all components
- Admin routes require `role: 'admin'` in the user object

---

**Phase 4A Status:** ✅ **COMPLETED**

Frontend architecture is fully set up and ready for feature implementation in Phase 4B!

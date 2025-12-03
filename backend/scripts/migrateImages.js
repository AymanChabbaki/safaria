/**
 * ============================================================
 * SAFARIA Platform - Image Migration to Cloudinary
 * ============================================================
 * This script migrates existing local images to Cloudinary
 * Run: node scripts/migrateImages.js
 * ============================================================
 */

require('dotenv').config();
const { pool } = require('../src/config/db');
const { cloudinary } = require('../src/config/cloudinary');
const fs = require('fs');
const path = require('path');

// Upload a single image to Cloudinary
async function uploadToCloudinary(localPath, folder) {
    try {
        const result = await cloudinary.uploader.upload(localPath, {
            folder: `safaria/${folder}`,
            transformation: folder === 'profiles' 
                ? [{ width: 500, height: 500, crop: 'limit' }]
                : [{ width: 1200, height: 800, crop: 'limit' }]
        });
        console.log(`✅ Uploaded: ${path.basename(localPath)} -> ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Failed to upload ${localPath}:`, error.message);
        return null;
    }
}

// Migrate artisans images
async function migrateArtisans() {
    console.log('\n📦 Migrating Artisans...');
    const [artisans] = await pool.query('SELECT * FROM artisans');
    
    for (const artisan of artisans) {
        let updated = false;
        let newMainImage = artisan.main_image;
        let newImages = artisan.images;
        
        // Migrate main_image
        if (artisan.main_image && artisan.main_image.startsWith('/uploads/')) {
            const localPath = path.join(__dirname, '../src', artisan.main_image);
            if (fs.existsSync(localPath)) {
                const cloudinaryUrl = await uploadToCloudinary(localPath, 'artisans');
                if (cloudinaryUrl) {
                    newMainImage = cloudinaryUrl;
                    updated = true;
                }
            }
        }
        
        // Migrate gallery images
        if (artisan.images) {
            try {
                const imageArray = typeof artisan.images === 'string' 
                    ? JSON.parse(artisan.images) 
                    : artisan.images;
                
                const migratedImages = [];
                for (const img of imageArray) {
                    if (img.startsWith('/uploads/')) {
                        const localPath = path.join(__dirname, '../src', img);
                        if (fs.existsSync(localPath)) {
                            const cloudinaryUrl = await uploadToCloudinary(localPath, 'artisans');
                            migratedImages.push(cloudinaryUrl || img);
                            if (cloudinaryUrl) updated = true;
                        } else {
                            migratedImages.push(img);
                        }
                    } else {
                        migratedImages.push(img); // Already Cloudinary URL
                    }
                }
                newImages = JSON.stringify(migratedImages);
            } catch (e) {
                console.error(`Error parsing images for artisan ${artisan.id}:`, e.message);
            }
        }
        
        // Update database if any changes
        if (updated) {
            await pool.query(
                'UPDATE artisans SET main_image = ?, images = ? WHERE id = ?',
                [newMainImage, newImages, artisan.id]
            );
            console.log(`✅ Updated artisan ${artisan.id}: ${artisan.name_fr || artisan.name}`);
        }
    }
    console.log('✅ Artisans migration complete');
}

// Migrate sejours images
async function migrateSejours() {
    console.log('\n📦 Migrating Sejours...');
    const [sejours] = await pool.query('SELECT * FROM sejours');
    
    for (const sejour of sejours) {
        let updated = false;
        let newMainImage = sejour.main_image;
        let newImages = sejour.images;
        
        // Migrate main_image
        if (sejour.main_image && sejour.main_image.startsWith('/uploads/')) {
            const localPath = path.join(__dirname, '../src', sejour.main_image);
            if (fs.existsSync(localPath)) {
                const cloudinaryUrl = await uploadToCloudinary(localPath, 'sejours');
                if (cloudinaryUrl) {
                    newMainImage = cloudinaryUrl;
                    updated = true;
                }
            }
        }
        
        // Migrate gallery images
        if (sejour.images) {
            try {
                const imageArray = typeof sejour.images === 'string' 
                    ? JSON.parse(sejour.images) 
                    : sejour.images;
                
                const migratedImages = [];
                for (const img of imageArray) {
                    if (img.startsWith('/uploads/')) {
                        const localPath = path.join(__dirname, '../src', img);
                        if (fs.existsSync(localPath)) {
                            const cloudinaryUrl = await uploadToCloudinary(localPath, 'sejours');
                            migratedImages.push(cloudinaryUrl || img);
                            if (cloudinaryUrl) updated = true;
                        } else {
                            migratedImages.push(img);
                        }
                    } else {
                        migratedImages.push(img);
                    }
                }
                newImages = JSON.stringify(migratedImages);
            } catch (e) {
                console.error(`Error parsing images for sejour ${sejour.id}:`, e.message);
            }
        }
        
        if (updated) {
            await pool.query(
                'UPDATE sejours SET main_image = ?, images = ? WHERE id = ?',
                [newMainImage, newImages, sejour.id]
            );
            console.log(`✅ Updated sejour ${sejour.id}: ${sejour.name_fr || sejour.name}`);
        }
    }
    console.log('✅ Sejours migration complete');
}

// Migrate caravanes images
async function migrateCaravanes() {
    console.log('\n📦 Migrating Caravanes...');
    const [caravanes] = await pool.query('SELECT * FROM caravanes');
    
    for (const caravane of caravanes) {
        let updated = false;
        let newMainImage = caravane.main_image;
        let newImages = caravane.images;
        
        // Migrate main_image
        if (caravane.main_image && caravane.main_image.startsWith('/uploads/')) {
            const localPath = path.join(__dirname, '../src', caravane.main_image);
            if (fs.existsSync(localPath)) {
                const cloudinaryUrl = await uploadToCloudinary(localPath, 'caravanes');
                if (cloudinaryUrl) {
                    newMainImage = cloudinaryUrl;
                    updated = true;
                }
            }
        }
        
        // Migrate gallery images
        if (caravane.images) {
            try {
                const imageArray = typeof caravane.images === 'string' 
                    ? JSON.parse(caravane.images) 
                    : caravane.images;
                
                const migratedImages = [];
                for (const img of imageArray) {
                    if (img.startsWith('/uploads/')) {
                        const localPath = path.join(__dirname, '../src', img);
                        if (fs.existsSync(localPath)) {
                            const cloudinaryUrl = await uploadToCloudinary(localPath, 'caravanes');
                            migratedImages.push(cloudinaryUrl || img);
                            if (cloudinaryUrl) updated = true;
                        } else {
                            migratedImages.push(img);
                        }
                    } else {
                        migratedImages.push(img);
                    }
                }
                newImages = JSON.stringify(migratedImages);
            } catch (e) {
                console.error(`Error parsing images for caravane ${caravane.id}:`, e.message);
            }
        }
        
        if (updated) {
            await pool.query(
                'UPDATE caravanes SET main_image = ?, images = ? WHERE id = ?',
                [newMainImage, newImages, caravane.id]
            );
            console.log(`✅ Updated caravane ${caravane.id}: ${caravane.name_fr || caravane.name}`);
        }
    }
    console.log('✅ Caravanes migration complete');
}

// Migrate user profile photos
async function migrateUsers() {
    console.log('\n📦 Migrating User Profiles...');
    const [users] = await pool.query('SELECT * FROM users WHERE photo IS NOT NULL');
    
    for (const user of users) {
        if (user.photo && user.photo.startsWith('/uploads/')) {
            const localPath = path.join(__dirname, '../src', user.photo);
            if (fs.existsSync(localPath)) {
                const cloudinaryUrl = await uploadToCloudinary(localPath, 'profiles');
                if (cloudinaryUrl) {
                    await pool.query(
                        'UPDATE users SET photo = ? WHERE id = ?',
                        [cloudinaryUrl, user.id]
                    );
                    console.log(`✅ Updated user ${user.id}: ${user.email}`);
                }
            }
        }
    }
    console.log('✅ Users migration complete');
}

// Main migration function
async function migrate() {
    console.log('🚀 Starting image migration to Cloudinary...\n');
    console.log('📋 This will:');
    console.log('   1. Upload local images to Cloudinary');
    console.log('   2. Update database with Cloudinary URLs');
    console.log('   3. Keep original files (you can delete later)\n');
    
    try {
        await migrateArtisans();
        await migrateSejours();
        await migrateCaravanes();
        await migrateUsers();
        
        console.log('\n✅ Migration completed successfully!');
        console.log('📊 Check your Cloudinary dashboard: https://cloudinary.com/console');
        console.log('🗑️  You can now safely delete the src/uploads folder');
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
    } finally {
        process.exit(0);
    }
}

// Run migration
migrate();

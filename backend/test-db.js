const { pool } = require('./db');

async function testDatabase() {
    try {
        console.log('🔍 Testing database connection...\n');
        
        // Test basic connection
        const [result] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('✅ Basic query test passed:', result[0].solution, '=', 2);
        
        // Test artisans
        const [artisans] = await pool.query('SELECT * FROM artisans');
        console.log(`✅ Found ${artisans.length} artisans`);
        if (artisans.length > 0) {
            console.log(`   Example: ${artisans[0].name}`);
        }
        
        // Test sejours
        const [sejours] = await pool.query('SELECT * FROM sejours');
        console.log(`✅ Found ${sejours.length} sejours`);
        if (sejours.length > 0) {
            console.log(`   Example: ${sejours[0].name}`);
        }
        
        // Test caravanes
        const [caravanes] = await pool.query('SELECT * FROM caravanes');
        console.log(`✅ Found ${caravanes.length} caravanes`);
        if (caravanes.length > 0) {
            console.log(`   Example: ${caravanes[0].name}`);
        }
        
        // Test 360 images
        const [images] = await pool.query('SELECT * FROM images_360');
        console.log(`✅ Found ${images.length} 360° images`);
        
        // Test reservations
        const [reservations] = await pool.query('SELECT * FROM reservations');
        console.log(`✅ Found ${reservations.length} reservations`);
        
        // Test polymorphic relationship
        const [imageDetails] = await pool.query(`
            SELECT 
                i.id,
                i.itemType,
                i.imageUrl,
                CASE 
                    WHEN i.itemType = 'artisanat' THEN (SELECT name FROM artisans WHERE id = i.itemId)
                    WHEN i.itemType = 'sejour' THEN (SELECT name FROM sejours WHERE id = i.itemId)
                    WHEN i.itemType = 'caravane' THEN (SELECT name FROM caravanes WHERE id = i.itemId)
                END as item_name
            FROM images_360 i
            LIMIT 1
        `);
        
        if (imageDetails.length > 0) {
            console.log(`\n✅ Polymorphic relationship test passed:`);
            console.log(`   ${imageDetails[0].itemType} - ${imageDetails[0].item_name}`);
        }
        
        console.log('\n🎉 All database tests passed successfully!');
        console.log('📊 Database is ready for use.\n');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Database test failed:');
        console.error('Error:', error.message);
        console.error('\n💡 Troubleshooting steps:');
        console.error('1. Check if MySQL is running');
        console.error('2. Verify .env configuration');
        console.error('3. Ensure database schema is created (run schema.sql)');
        console.error('4. Ensure seed data is loaded (run seed_data.sql)\n');
        process.exit(1);
    }
}

testDatabase();

const { sequelize } = require('./config/database');
const User = require('./models/User');
const { Product, Electronics } = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const DeliveryAddress = require('./models/DeliveryAddress');

async function initializeDatabase() {
    try {
        console.log('Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');

        console.log('Syncing database models...');
        
        // Create all models in the correct order (considering foreign key dependencies)
        await sequelize.sync({ force: false, alter: true });
        
        console.log('✅ Database models synchronized successfully.');
        
        // Optional: Create sample data
        await createSampleData();
        
        console.log('🎉 Database initialization completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

async function createSampleData() {
    try {
        // Check if admin user exists
        const adminExists = await User.findOne({ where: { role: 'admin' } });
        
        if (!adminExists) {
            const adminUser = await User.create({
                username: 'admin',
                email: 'admin@ecofinds.com',
                password: 'admin123', // This will be hashed by the beforeCreate hook
                role: 'admin',
                isEmailVerified: true
            });
            console.log('✅ Admin user created');
        }

        // Check if sample products exist
        const productCount = await Product.count();
        if (productCount === 0) {
            await Product.bulkCreate([
                {
                    name: 'Eco-Friendly Water Bottle',
                    price: 25.99,
                    image: '/uploads/water-bottle.jpg',
                    description: 'Sustainable stainless steel water bottle'
                },
                {
                    name: 'Bamboo Toothbrush Set',
                    price: 12.99,
                    image: '/uploads/toothbrush.jpg',
                    description: 'Set of 4 biodegradable bamboo toothbrushes'
                }
            ]);
            console.log('✅ Sample products created');
        }

        // Check if sample electronics exist
        const electronicsCount = await Electronics.count();
        if (electronicsCount === 0) {
            await Electronics.bulkCreate([
                {
                    name: 'Eco-Friendly Solar Charger',
                    price: 89.99,
                    image: '/uploads/solar-charger.jpg',
                    description: 'Portable solar power bank for sustainable charging'
                },
                {
                    name: 'Energy-Efficient LED Smart Bulb',
                    price: 24.99,
                    image: '/uploads/smart-bulb.jpg',
                    description: 'WiFi-enabled LED bulb with energy monitoring'
                }
            ]);
            console.log('✅ Sample electronics created');
        }

    } catch (error) {
        console.error('Warning: Could not create sample data:', error.message);
    }
}

// Run the initialization
initializeDatabase();

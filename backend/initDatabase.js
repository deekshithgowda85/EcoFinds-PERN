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
        if (productCount > 0) {
            await Product.destroy({ where: {} });
            console.log('✅ Existing products cleared');
        }

        // Check if sample electronics exist
        const electronicsCount = await Electronics.count();
        if (electronicsCount > 0) {
            await Electronics.destroy({ where: {} });
            console.log('✅ Existing electronics cleared');
        }

        console.log('✅ Database ready for fresh uploads - no sample data');

    } catch (error) {
        console.error('Warning: Could not create sample data:', error.message);
    }
}

// Run the initialization
initializeDatabase();

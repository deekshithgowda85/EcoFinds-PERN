const { sequelize } = require('./config/database');
const { Product, Grocery } = require('./models/Product');

async function syncDatabase() {
    try {
        // Sync all models with the database
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');

        // Check if we need to seed initial data
        const productCount = await Product.count();
        const groceryCount = await Grocery.count();

        if (productCount === 0) {
            // Add some sample products
            await Product.bulkCreate([
                {
                    name: 'Tesla Model S',
                    price: 50000,
                    image: '/uploads/tesla-model-s.jpg',
                    description: 'Tesla cars are electric vehicles known for their cutting-edge technology, impressive performance, and autonomous driving capabilities.'
                },
                {
                    name: 'BMW X5',
                    price: 65000,
                    image: '/uploads/bmw-x5.jpg',
                    description: 'BMW X5 is a luxury SUV known for its performance, comfort, and advanced technology features.'
                }
            ]);
            console.log('Sample products added');
        }

        if (groceryCount === 0) {
            // Add some sample groceries
            await Grocery.bulkCreate([
                {
                    name: 'Car Cover',
                    price: 99.99,
                    image: '/uploads/car-cover.jpg',
                    description: 'High-quality car cover to protect your vehicle from weather elements.'
                },
                {
                    name: 'Floor Mats',
                    price: 49.99,
                    image: '/uploads/floor-mats.jpg',
                    description: 'Premium floor mats for maximum protection and comfort.'
                }
            ]);
            console.log('Sample groceries added');
        }

    } catch (error) {
        console.error('Error synchronizing database:', error);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
}

// Run the sync function
syncDatabase(); 
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_source: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    // Sequelize automatically adds createdAt timestamp (created_at is covered by createdAt)
}, {
    tableName: 'order_items', // Explicitly set table name
    timestamps: true,
    createdAt: 'created_at', // Map createdAt to created_at column
    updatedAt: false, // Disable updatedAt for this table based on your schema
});

// Function to initialize associations
OrderItem.initializeAssociations = function (models) {
    OrderItem.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
    });

    OrderItem.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        constraints: false
    });

    OrderItem.belongsTo(models.Electronics, {
        foreignKey: 'product_id',
        as: 'electronics',
        constraints: false
    });
};

module.exports = OrderItem; 
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const DeliveryAddress = require('./DeliveryAddress');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    delivery_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: DeliveryAddress,
            key: 'id',
        },
        onDelete: 'SET NULL',
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
    },
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'order_date',
    updatedAt: 'updated_at',
});

// Define associations
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(DeliveryAddress, { foreignKey: 'delivery_address_id' });

// Function to initialize associations
Order.initializeAssociations = function (models) {
    Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'items'
    });
};

module.exports = Order; 
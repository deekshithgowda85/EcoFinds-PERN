const Order = require('./Order');
const OrderItem = require('./OrderItem');
const User = require('./User');
const DeliveryAddress = require('./DeliveryAddress');
const { Product, Electronics } = require('./Product');

// Create models object
const models = {
    Order,
    OrderItem,
    User,
    DeliveryAddress,
    Product,
    Electronics
};

// Initialize associations
Object.values(models).forEach(model => {
    if (model.initializeAssociations) {
        model.initializeAssociations(models);
    }
});

module.exports = models; 
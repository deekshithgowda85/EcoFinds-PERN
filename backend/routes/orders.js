const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

console.log('Orders router loaded');

// Import Sequelize Models
const DeliveryAddress = require('../models/DeliveryAddress');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { Product, Electronics } = require('../models/Product');

// Function to fetch product price securely using Sequelize models
async function getProductDetails(productId, source) {
    let model;
    let details = null;

    try {
        if (source === 'products') {
            model = Product;
        } else if (source === 'electronics') {
            model = Electronics;
        } else {
            return null;
        }

        details = await model.findByPk(productId, { attributes: ['id', 'price'] });
        return details ? details.toJSON() : null;

    } catch (error) {
        console.error(`Error fetching details for product ${productId} (${source}):`, error);
        throw new Error(`Could not fetch details for product ${productId}`);
    }
}

// POST /api/orders - Endpoint to create a new order
router.post('/', authenticateToken, async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { deliveryInfo, carts } = req.body;
        console.log('Creating order with data:', { deliveryInfo, carts, userId: req.user.id });

        // Calculate total amount
        let totalAmount = 0;
        for (const item of carts) {
            const productDetails = await getProductDetails(item.productId, item.source);
            if (!productDetails) {
                throw new Error(`Product with ID ${item.productId} (${item.source}) not found`);
            }
            totalAmount += productDetails.price * item.quantity;
        }

        // Add delivery fee
        const deliveryFee = totalAmount > 0 ? 5 : 0;
        totalAmount += deliveryFee;

        console.log('Calculated total amount:', totalAmount);

        // Create order in database
        const order = await Order.create({
            user_id: req.user.id,
            total_amount: totalAmount,
            status: 'pending',
            deliveryName: deliveryInfo.name,
            deliveryAddress: deliveryInfo.address,
            deliveryCity: deliveryInfo.city,
            deliveryCountry: deliveryInfo.country,
            deliveryPhone: deliveryInfo.phone,
        }, { transaction: t });

        console.log('Created order:', order.id);

        // Create order items
        const orderItems = await Promise.all(carts.map(async (item) => {
            const productDetails = await getProductDetails(item.productId, item.source);
            return OrderItem.create({
                order_id: order.id,
                product_id: item.productId,
                product_source: item.source,
                quantity: item.quantity,
                price: productDetails.price,
            }, { transaction: t });
        }));

        await t.commit();

        // Return success response
        res.status(201).json({
            message: 'Order created successfully!',
            orderId: order.id
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// GET /api/orders - Endpoint to fetch orders for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.user.id);

        const orders = await Order.findAll({
            where: {
                user_id: req.user.id
            },
            include: [{
                model: OrderItem,
                as: 'items',
                attributes: ['product_id', 'product_source', 'quantity', 'price'],
                include: [
                    { model: Product, as: 'product', attributes: ['name'], required: false },
                    { model: Electronics, as: 'electronics', attributes: ['name'], required: false }
                ]
            }],
            order: [['order_date', 'DESC']]
        });

        // Format the orders to include product names
        const formattedOrders = orders.map(order => ({
            id: order.id,
            totalAmount: order.total_amount,
            status: order.status,
            orderDate: order.order_date,
            items: order.items.map(item => {
                let productName = 'Unknown Product';
                if (item.product_source === 'products' && item.product) {
                    productName = item.product.name;
                } else if (item.product_source === 'electronics' && item.electronics) {
                    productName = item.electronics.name;
                }

                return {
                    productId: item.product_id,
                    productSource: item.product_source,
                    productName: productName,
                    quantity: item.quantity,
                    price: item.price
                };
            })
        }));

        res.status(200).json(formattedOrders);

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            message: 'Failed to fetch user orders',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /api/orders/dashboard - Dashboard data endpoint
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        // Get all orders
        const allOrders = await Order.findAll({
            include: [{
                model: OrderItem,
                as: 'items',
                attributes: ['product_id', 'product_source', 'quantity', 'price']
            }]
        });

        // Get product and electronics counts
        const totalProducts = await Product.count();
        const totalElectronics = await Electronics.count();

        // Calculate dashboard statistics
        const totalRevenue = allOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
        const totalOrders = allOrders.length;
        const completedOrders = allOrders.filter(order => order.status === 'completed');
        const completedOrdersCount = completedOrders.length;
        
        // Calculate products and electronics sold
        let productsSoldCount = 0;
        let electronicsSoldCount = 0;
        
        allOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product_source === 'products') {
                    productsSoldCount += item.quantity;
                } else if (item.product_source === 'electronics') {
                    electronicsSoldCount += item.quantity;
                }
            });
        });

        // Get recent orders (last 10)
        const recentOrders = await Order.findAll({
            include: [{
                model: OrderItem,
                as: 'items',
                attributes: ['product_id', 'product_source', 'quantity', 'price'],
                include: [
                    { model: Product, as: 'product', attributes: ['name'], required: false },
                    { model: Electronics, as: 'electronics', attributes: ['name'], required: false }
                ]
            }],
            order: [['order_date', 'DESC']],
            limit: 10
        });

        // Format recent orders
        const formattedRecentOrders = recentOrders.map(order => ({
            id: order.id,
            totalAmount: order.total_amount,
            status: order.status,
            createdAt: order.order_date,
            items: order.items.map(item => {
                let productName = 'Unknown Product';
                if (item.product_source === 'products' && item.product) {
                    productName = item.product.name;
                } else if (item.product_source === 'electronics' && item.electronics) {
                    productName = item.electronics.name;
                }

                return {
                    productId: item.product_id,
                    productSource: item.product_source,
                    productName: productName,
                    quantity: item.quantity,
                    price: item.price
                };
            })
        }));

        res.json({
            totalRevenue,
            totalOrders,
            completedOrdersCount,
            productsSoldCount,
            electronicsSoldCount,
            totalProducts,
            totalElectronics,
            totalUsers: 100, // You can implement user counting if needed
            recentOrders: formattedRecentOrders
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
});

// PUT /api/orders/:orderId/status - Update order status
router.put('/:orderId/status', authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({
            message: 'Order status updated successfully',
            order: {
                id: order.id,
                status: order.status,
                totalAmount: order.total_amount,
                createdAt: order.order_date
            }
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
});

module.exports = router;
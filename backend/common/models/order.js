'use strict';

module.exports = function(Order) {
    Order.newOrder = async function(discount, item_list, ctx) {
        // Validate the inputs as needed
        const customer_id = ctx.req.accessToken.userId;
    
        // Create a new order
        const order = await Order.create({
            customerId: customer_id,
            discount: discount,
            bought_at: new Date(), // Set bought_at to the current date and time
            createdAt: new Date(),
            updatedAt: new Date()
        });
    
        // Create order items
        for (const item of item_list) {
            let menuItem = await Order.app.models.MenuItem.findById(item.menu_item_id);
            if (!menuItem) {
                const error = new Error('Menu Item not found');
                error.statusCode = 404;
                throw error;
            }
            await Order.app.models.OrderItem.create({
                orderId: order.id,
                menuItemId: item.menu_item_id,
                price_at_order: menuItem.price,
                quantity: item.quantity,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    
        return order;
    };

    Order.remoteMethod('newOrder', {
        accepts: [
            { arg: 'discount', type: 'number', required: true },
            { arg: 'item_list', type: 'array', required: true },
            { arg: 'ctx', type: 'object', http: function(ctx) { return ctx; } }
        ],
        returns: { arg: 'order', type: 'object', root: true },
        http: { path: '/newOrder', verb: 'post' }
    });

    Order.beforeRemote('newOrder', async function(ctx) {
        // Check if the user is authenticated
        if (!ctx.req.accessToken) {
            const error = new Error('Authorization Required');
            error.statusCode = 401;
            throw error;
        }
    });

    // get all orders of a customer (GET /api/Order/my-orders)
    Order.myOrders = async function(ctx) {
        const customer_id = ctx.req.accessToken.userId;
        return Order.find({ where: { customerId: customer_id } });
    };

    Order.remoteMethod('myOrders', {
        accepts: { arg: 'ctx', type: 'object', http: function(ctx) { return ctx; } },
        returns: { arg: 'orders', type: 'array', root: true },
        http: { path: '/my-orders', verb: 'get' }
    });

};
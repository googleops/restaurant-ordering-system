// customer.test.js

var app = require('../server/server'); // adjust the path as needed
var expect;

import('chai').then(chai => {
  expect = chai.expect;
}).catch(err => {
  console.error(err);
});

const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:3000';

describe('MenuItem', function() {
    let token;
    let customerId;
    let customerId2;
    let menuItemIds = [];
    
    // clean all customers before running the tests
    before(async function() {
        await app.models.Customer.destroyAll({ principalType: { neq: 'admin' } });
        const customer = await app.models.Customer.create({
            username: 'user1',
            email: 'user1@example.com',
            password: '111111',
            phone: '1234567890',
            address: '123 Main St'
        });
        customerId = customer.id;

        const customer2 = await app.models.Customer.create({
            username: 'user2',
            email: 'user2@example.com',
            password: '222222',
            phone: '1234567890',
            address: '123 Main St'
        });
        customerId2 = customer2.id;

        await app.models.MenuItem.destroyAll();
        // Create 5 menu items
        for (let i = 1; i <= 5; i++) {
            let menuItem = await app.models.MenuItem.create({
                name: `Menu Item ${i}`,
                description: `Description for Menu Item ${i}`,
                price: i * 10,
                quantity: 100,
                imageUrl: `https://example.com/menu-item-${i}.jpg`
            });
            menuItemIds.push(menuItem.id);
        }
    });

    beforeEach(async function() {
        await app.models.Order.destroyAll();
        await app.models.OrderItem.destroyAll();

        // Create an order
        const order = await app.models.Order.create({
            customerId: customerId,
            discount: 10,
            bought_at: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Create order items
        for (let i = 1; i <= 3; i++) {
            await app.models.OrderItem.create({
                orderId: order.id,
                menuItemId: i,
                quantity: i,
                price_at_order: i * 10,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        
        // Create another order
        const order2 = await app.models.Order.create({
            customerId: customerId2,
            discount: 20,
            bought_at: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Create order items
        for (let i = 4; i <= 5; i++) {
            await app.models.OrderItem.create({
                orderId: order2.id,
                menuItemId: i,
                quantity: i,
                price_at_order: i * 10,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    });

    describe('Without login', function() {
        // Put your tests here
        it('should not able to create a new order', async function() {
            try {
                const response = await axios.post('/api/Orders/newOrder', {
                    discount: 10,
                    item_list: [
                        { menu_item_id: 1, quantity: 1 },
                        { menu_item_id: 2, quantity: 2 }
                    ]
                });
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });

        it('should not able to get my orders', async function() {
            try {
                const response = await axios.get('/api/Orders/my-orders');
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });

        it('should not able to get all orders', async function() {
            try {
                const response = await axios.get('/api/Orders');
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });
    });

    describe('Login as user', function() {
        before(async function() {
            const response = await axios.post('/api/Customers/login', {
                email: 'user1@example.com',
                password: '111111'
            });
            token = response.data.id;
            axios.defaults.headers.common['Authorization'] = token;
        });

        after(function() {
            delete axios.defaults.headers.common['Authorization'];
        });

        it('should create a new order', async function() {
            const response = await axios.post('/api/Orders/newOrder', {
                discount: 10,
                item_list: [
                    { menu_item_id: menuItemIds[0], quantity: 1},
                    { menu_item_id: menuItemIds[1], quantity: 2}
                ]
            });
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('id');
        });

        it('should get my orders', async function() {
            const response = await axios.get('/api/Orders/my-orders');
            expect(response.status).to.equal(200);
            expect(response.data).to.have.lengthOf(1);
            expect(response.data[0]).to.have.property('customerId', customerId);
        });

        it('should get order by id', async function() {
            const orders = await app.models.Order.find();
            const response = await axios.get(`/api/Orders/${orders[0].id}`);
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('customerId', customerId);
            expect(response.data).to.have.property('discount', 10);

            const orderItems = await app.models.OrderItem.find({ where: { orderId: orders[0].id } });
            expect(orderItems).to.have.lengthOf(3);
            expect(orderItems[0]).to.have.property('menuItemId', 1);
            expect(orderItems[0]).to.have.property('quantity', 1);
            expect(orderItems[1]).to.have.property('menuItemId', 2);
            expect(orderItems[1]).to.have.property('quantity', 2);
            expect(orderItems[2]).to.have.property('menuItemId', 3);
            expect(orderItems[2]).to.have.property('quantity', 3);
        });

        it('should not able to get order by id of other customers', async function() {
            try {
                const orders = await app.models.Order.find();
                const response = await axios.get(`/api/Orders/${orders[1].id}`);
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });

        it('should not able to get all orders', async function() {
            try {
                const response = await axios.get('/api/Orders');
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });
    });

    describe('Login as admin', function() {
        before(async function() {
            const response = await axios.post('/api/Customers/login', {
                email: 'admin@example.com',
                password: 'admin123'
            });
            token = response.data.id;
            axios.defaults.headers.common['Authorization'] = token;
        });

        after(function() {
            delete axios.defaults.headers.common['Authorization'];
        });

        it('should get all orders', async function() {
            const response = await axios.get('/api/Orders');
            expect(response.status).to.equal(200);
            expect(response.data).to.have.lengthOf(2);
        });
    });
});
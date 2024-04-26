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
    });
    beforeEach(async function() {
        await app.models.MenuItem.destroyAll();
        
        // Create 5 menu items
        for (let i = 1; i <= 5; i++) {
            await app.models.MenuItem.create({
                name: `Menu Item ${i}`,
                description: `Description for Menu Item ${i}`,
                price: i * 10,
                quantity: 100,
                imageUrl: `https://example.com/menu-item-${i}.jpg`
            });
        }
    });

    describe('Without login', function() {
        // Put your tests here
        it('should get all menu items', async function() {
            const response = await axios.get('/api/menuItems');
            expect(response.status).to.equal(200);
            expect(response.data).to.have.lengthOf(5);
        });
    
        it('should get a menu item by id', async function() {
            const menuItems = await app.models.MenuItem.find();
            const response = await axios.get(`/api/menuItems/${menuItems[0].id}`);
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('name', menuItems[0].name);
        });
    
        it('should not create a menu item', async function() {
            try {
                const response = await axios.post('/api/menuItems', {
                    name: 'New Menu Item',
                    description: 'Description for New Menu Item',
                    price: 100,
                    quantity: 100,
                    imageUrl: 'https://example.com/new-menu-item.jpg'
                });
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });
    
        it('should not update a menu item', async function() {
            try {
                const menuItems = await app.models.MenuItem.find();
                const response = await axios.put(`/api/menuItems/${menuItems[0].id}`, {
                    name: 'Updated Menu Item',
                    description: 'Description for Updated Menu Item',
                    price: 100,
                    quantity: 100,
                    imageUrl: 'https://example.com/updated-menu-item.jpg'
                });
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });
    
        it('should not delete a menu item', async function() {
            try {
                const menuItems = await app.models.MenuItem.find();
                const response = await axios.delete(`/api/menuItems/${menuItems[0].id}`);
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

        it('should get all menu items', async function() {
            const response = await axios.get('/api/menuItems');
            expect(response.status).to.equal(200);
            expect(response.data).to.have.lengthOf(5);
        });

        it('should get a menu item by id', async function() {
            const menuItems = await app.models.MenuItem.find();
            const response = await axios.get(`/api/menuItems/${menuItems[0].id}`);
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('name', menuItems[0].name);
        });

        it('should not create a menu item', async function() {
            try {
                const response = await axios.post('/api/menuItems', {
                    name: 'New Menu Item',
                    description: 'Description for New Menu Item',
                    price: 100,
                    quantity: 100,
                    imageUrl: 'https://example.com/new-menu-item.jpg'
                });
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });

        it('should not update a menu item', async function() {
            try {
                const menuItems = await app.models.MenuItem.find();
                const response = await axios.put(`/api/menuItems/${menuItems[0].id}`, {
                    name: 'Updated Menu Item',
                    description: 'Description for Updated Menu Item',
                    price: 100,
                    quantity: 100,
                    imageUrl: 'https://example.com/updated-menu-item.jpg'
                });
            }
            catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });

        it('should not delete a menu item', async function() {
            try {
                const menuItems = await app.models.MenuItem.find();
                const response = await axios.delete(`/api/menuItems/${menuItems[0].id}`);
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

        // Put your tests here
        it('should get all menu items', async function() {
            const response = await axios.get('/api/menuItems');
            expect(response.status).to.equal(200);
            expect(response.data).to.have.lengthOf(5);
        });

        it('should get a menu item by id', async function() {
            const menuItems = await app.models.MenuItem.find();
            const response = await axios.get(`/api/menuItems/${menuItems[0].id}`);
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('name', menuItems[0].name);
        });

        it('should create a menu item', async function() {
            const response = await axios.post('/api/menuItems', {
                name: 'New Menu Item',
                description: 'Description for New Menu Item',
                price: 100,
                quantity: 100,
                imageUrl: 'https://example.com/new-menu-item.jpg'
            });
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('name', 'New Menu Item');
        });

        it('should update a menu item', async function() {
            const menuItems = await app.models.MenuItem.find();
            const response = await axios.put(`/api/menuItems/${menuItems[0].id}`, {
                name: 'Updated Menu Item',
                description: 'Description for Updated Menu Item',
                price: 100,
                quantity: 100,
                imageUrl: 'https://example.com/updated-menu-item.jpg'
            });
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('name', 'Updated Menu Item');
        });

        it('should delete a menu item', async function() {
            const menuItems = await app.models.MenuItem.find();
            const response = await axios.delete(`/api/menuItems/${menuItems[0].id}`);
            expect(response.status).to.equal(200);
        });
    });
});
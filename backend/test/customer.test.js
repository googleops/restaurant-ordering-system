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

describe('Customer', function() {
    let token;
    let customerId1;
    let customerId2;

    // clean all customers before running the tests
    before(async function() {
        await app.models.Customer.destroyAll();
    });
    beforeEach(async function() {
        const customer = await app.models.Customer.create({
            username: 'user1',
            email: 'user1@example.com',
            password: '111111',
            phone: '1234567890',
            address: '123 Main St'
        });
        customerId1 = customer.id;
        const otherCustomer = await app.models.Customer.create({
            username: 'user2',
            email: 'user2@example.com',
            password: '222222',
            phone: '0987654321',
            address: '321 Main St'
        });
        customerId2 = otherCustomer.id;

    });

    afterEach(async function() {
        await app.models.Customer.destroyAll({ id: customerId1 });
        await app.models.Customer.destroyAll({ id: customerId2 });
    });

    it('should be able to create a new customer', async function() {
        const response = await axios.post('/api/customers', {
            username: 'user3',
            email: 'user3@example.com',
            password: '333333',
            phone: '0987654321',
            address: '321 Main St'
        });
    
        const customer = response.data;
    
        expect(customer).to.exist;
        expect(customer).to.have.property('id');
        expect(customer.username).to.equal('user3');
        expect(customer.email).to.equal('user3@example.com');
        expect(customer.phone).to.equal('0987654321');
        expect(customer.address).to.equal('321 Main St');
    });

    it('should not be able to create a new customer with the same username', async function() {
        try {
            await axios.post('/api/customers', {
                username: 'user1',
                email: 'different@mail.com',
                password: '333333',
                phone: '1122334455',
                address: '456 Main St'
            });
        } catch (err) {
            expect(err).to.exist;
        }
    });

    it('should not be able to create a new customer with the same email', async function() {
        try {
            await axios.post('/api/customers', {
                username: 'differentuser',
                email: 'user1@example.com',
                password: '333333',
                phone: '1122334455',
                address: '456 Main St'
            });
        } catch (err) {
            expect(err).to.exist;
        }
    });

    it('should be able to login', async function() {
        const response = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = response.data.id;
        expect(token).to.exist;
    });

    it ('should be able to logout', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;
        const response = await axios.post(`/api/customers/logout?access_token=${token}`);
        expect(response.status).to.equal(204);
    });

    it('should not be able to get customer data before login', async function() {
        try {
            await axios.get(`/api/customers/${customerId1}`);
        } catch (err) {
            expect(err).to.exist;
            expect(err.response.status).to.equal(401); // Unauthorized
            expect(err.response.data.error.message).to.equal('Authorization Required');
        }
    });

    it('should be able to get customer data after login', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;

        const response = await axios.get(`/api/customers/${customerId1}?access_token=${token}`);
        const customer = response.data;
        expect(customer).to.exist;
        expect(customer).to.have.property('id');
        expect(customer.username).to.equal('user1');
        expect(customer.email).to.equal('user1@example.com');
        expect(customer.phone).to.equal('1234567890');
        expect(customer.address).to.equal('123 Main St');
    });

    it('should not be able to get other customer data', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;

        try {
            await axios.get(`/api/customers/${customerId2}?access_token=${token}`);
        } catch (err) {
            expect(err).to.exist;
            expect(err.response.status).to.equal(401); // Unauthorized
            expect(err.response.data.error.message).to.equal('Authorization Required');
        }
    });

    it('should not be able to get customer data after logout', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;
        await axios.post(`/api/customers/logout?access_token=${token}`);

        try {
            await axios.get(`/api/customers/${customerId1}?access_token=${token}`);
        } catch (err) {
            expect(err).to.exist;
            expect(err.response.status).to.equal(401); // Unauthorized
            expect(err.response.data.error.message).to.equal('Authorization Required');
        }
    });

    it('should not be able to get all customers', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;

        try {
            await axios.get(`/api/customers?access_token=${token}`);
        } catch (err) {
            expect(err).to.exist;
            expect(err.response.status).to.equal(401); // Unauthorized
            expect(err.response.data.error.message).to.equal('Authorization Required');
        }
    });

    it('should be able to update customer data', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;

        const response = await axios.patch(`/api/customers/${customerId1}?access_token=${token}`, {
            username: 'new_user',
            email: 'newmail@example.com',
            phone: '0987654321',
            address: '321 Main St'
        });
        const customer = response.data;
        expect(customer).to.exist;
        expect(customer).to.have.property('id');
        expect(customer.username).to.equal('new_user');
        expect(customer.email).to.equal('newmail@example.com');
        expect(customer.phone).to.equal('0987654321');
        expect(customer.address).to.equal('321 Main St');
    });

    it('should not be able to update other customer data', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;

        try {
            await axios.patch(`/api/customers/${customerId2}?access_token=${token}`, {
                username: 'new_user',
                email: 'new_email@example.com',
                phone: '0987654321',
                address: '321 Main St'
            });
        } catch (err) {
            expect(err).to.exist;
            expect(err.response.status).to.equal(401); // Unauthorized
            expect(err.response.data.error.message).to.equal('Authorization Required');
        }
    });

    it('should not be able to update customer data without login', async function() {
        try {
            await axios.patch(`/api/customers/${customerId1}`, {
                username: 'new_user',
                email: 'new_email@example.com',
                phone: '0987654321',
                address: '321 Main St'
            });
        } catch (err) {
            expect(err).to.exist;
            expect(err.response.status).to.equal(401); // Unauthorized
            expect(err.response.data.error.message).to.equal('Authorization Required');
        }
    });

    it('should be able to delete customer data', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;

        const response = await axios.delete(`/api/customers/${customerId1}?access_token=${token}`);
        expect(response.status).to.equal(200);
    });

    it('should not be able to delete other customer data', async function() {
        const loginResponse = await axios.post('/api/customers/login', {
            username: 'user1',
            password: '111111'
        });
        token = loginResponse.data.id;

        try {
            await axios.delete(`/api/customers/${customerId2}?access_token=${token}`);
        } catch (err) {
            expect(err).to.exist;
            expect(err.response.status).to.equal(401); // Unauthorized
            expect(err.response.data.error.message).to.equal('Authorization Required');
        }
    });

    it('should not be able to delete customer data without login', async function() {
        try {
            await axios.delete(`/api/customers/${customerId1}`);
        } catch (err) {
            expect(err).to.exist;
            expect(err.response.status).to.equal(401); // Unauthorized
            expect(err.response.data.error.message).to.equal('Authorization Required');
        }
    });
});
const app = require('./server');

const Customer = app.models.Customer;
const Role = app.models.Role;
const RoleMapping = app.models.RoleMapping;

const adminData = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '1234567890',
    address: '123 Main St',
    principalType: 'admin',
    secretKey: 'my-secret-key',
};

Customer.create(adminData, (err, user) => {
    if (err) {
        console.error('Error creating admin:', err);
        return;
    }

    // Create the 'admin' role
    Role.create({ name: 'admin' }, (err, role) => {
        if (err) {
            console.error('Error creating role:', err);
            return;
        }

        // Map the 'admin' role to the user
        role.principals.create({
            principalType: RoleMapping.USER,
            principalId: user.id
        }, (err, principal) => {
            if (err) {
                console.error('Error creating role mapping:', err);
                return;
            }

            console.log('Admin created:', user);
        });
    });
});
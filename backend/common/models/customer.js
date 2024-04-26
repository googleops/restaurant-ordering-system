'use strict';

module.exports = function(Customer) {
    // prevent creating a admin user
    Customer.observe('before save', function(ctx, next) {
        if (ctx.instance && ctx.instance.principalType === 'ADMIN') {
            if (ctx.instance.secretKey === 'my-secret-key') {
                next();
            } else {
                const err = new Error('Admin user cannot be created');
                err.statusCode = 400;
                next(err);
            }
        } else {
            next();
        }
    });
};
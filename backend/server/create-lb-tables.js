var server = require('./server');
var ds = server.dataSources.db;
var lbTables = ['Customer', 'MenuItem', 'OrderItem', 'Order', 'User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];
ds.automigrate(lbTables, function(er) {
    if (er) throw er;
    console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
    ds.disconnect();
});

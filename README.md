# Restaurant Ordering System
this is a simple restaurant ordering system that allows customers to browse available dishes, place orders, and manage their details. The system consists of a frontend developed using Ember.js and a backend API developed using IBM Loopback 3. The database system used is PostgreSQL.

## Specification
### Frontend
- Framework: Ember.js
- Create a simple and user-friendly interface that includes:
    - A homepage with restaurant information.
    - A menu page where users can browse available dishes.
    - A customer portal where users can sign in (based on a unique username), view their order history, and manage their details.
    - An order page where users can select menu items, specify quantities, and submit their orders.
### Backend
- Framework/API: IBM Loopback 3
- Engine: NodeJS v16
- Develop the API to handle CRUD operations for menu items, orders, and customer accounts.
### Database
- Database System: PostgreSQL
- Design the database schema to include the following models with specified relationships:
    - Menu Item: Represents dishes available for order.
    - Order: Records details of customer orders.
    - Customer: Information about registered customers.
### Relationships
- Menu Item to Order (Many-to-Many): A menu item can be part of many orders, and an order can include multiple menu items. This relationship should be managed through an intermediary table that records the quantities of each menu item in the order.
- Customer to Order (One-to-Many): A customer can have multiple orders but each order belongs to one customer.


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

## Database Schema
### Customer
- id: number (primary key)
- username: string
- password: encrypted string
- email: string
- phone: string
- address: string

### Menu Item
- id: number (primary key)
- name: string
- description: string
- quantity: number
- price: number
- imageUrl: string

### Order
- id: number (primary key)
- customer_id: number (foreign key)
- discount: number
- bought_at: datetime

### OrderItem (Intermediary Table)
- order_id: number (foreign key)
- menu_item_id: number (foreign key)
- quantity: number
- price_at_order: number

## Installation
### Setup nodejs
- check nodejs version `node -v` or `node --version` if not installed, install nodejs
- if using version other than v16, install nvm and switch to v16
- install nvm `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash`
- install nodejs v16 `nvm install v16`
- switch to nodejs v16 `nvm use v16`

### Setup PostgreSQL
- check PostgreSQL version `psql --version` if not installed, install PostgreSQL
- install PostgreSQL `sudo apt-get install postgresql postgresql-contrib`
- start PostgreSQL service `sudo service postgresql start`
- login to PostgreSQL `sudo -u postgres psql`
- delete database `DROP DATABASE IF EXISTS restaurant_db;`
- create database `CREATE DATABASE restaurant_db;`
- create user `CREATE USER restaurant_admin WITH PASSWORD 'password';`
- grant privileges to user `GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_admin;`
- exit PostgreSQL `\q`

### Setup IBM Loopback 3
- install IBM Loopback 3 `npm install -g loopback-cli`
- change directory to the `backend` folder
- create IBM Loopback 3 project `lb`
- follow the prompts to create the project
    - What's the name of your application? backend
    - Which version of LoopBack would you like to use? 3.x (Maintenance Long Term Support)
    - What kind of application do you have in mind? api-server (A LoopBack API server with local User auth)
- install dependencies `npm install`
- install postgresql connector `npm install --save loopback-connector-postgresql`
- generate database tables `node ./server/create-lb-tables.js`
- create admin user `node ./server/create-admin.js`

### Loopback Model
1. **Customer Model**:
    - name: Customer
    - properties: username, password, email, phone, address
    - datasource: db
2. **MenuItem Model**:
    - name: MenuItem
    - properties: name, description, quantity, price, imageUrl
    - datasource: db
3. **Order Model**:
    - name: Order
    - properties: discount, bought_at
    - datasource: db
4. **OrderItem Model**:
    - name: OrderItem
    - properties: quantity, price_at_order
    - datasource: db

### Loopback Relation
1. **For the Customer model (one side)**:
   - **Relation type**: has many
   - **Model to create a relationship with**: Order
   - **Property name for the relation**: ordersPlaced
   - **Custom foreign key**: customerId
   - **Require a through model?**: No (This is important; for one-to-many, you do not need a through model)

2. **For the Order model (many side)**:
   - **Relation type**: belongs to
   - **Model to create a relationship with**: Customer
   - **Property name for the relation**: customer
   - **Custom foreign key**: customerId
   - **Allow the relation to be nested in REST APIs**: No
   - **Disable the relation from being included**: No

3. **For the Order model (one side)**:
    - **Relation type**: has many
    - **Model to create a relationship with**: OrderItem
    - **Property name for the relation**: items
    - **Custom foreign key**: orderId
    - **Require a through model?**: No

4. **For the OrderItem model (many side)**:
    - **Relation type**: belongs to
    - **Model to create a relationship with**: Order
    - **Property name for the relation**: order
    - **Custom foreign key**: orderId
    - **Allow the relation to be nested in REST APIs**: No
    - **Disable the relation from being included**: No

5. **For the MenuItem model (many side)**:
    - **Relation type**: has many
    - **Model to create a relationship with**: OrderItem
    - **Property name for the relation**: orders
    - **Custom foreign key**: menuItemId
    - **Require a through model?**: No

6. **For the OrderItem model (many side)**:
    - **Relation type**: belongs to
    - **Model to create a relationship with**: MenuItem
    - **Property name for the relation**: menuItem
    - **Custom foreign key**: menuItemId
    - **Allow the relation to be nested in REST APIs**: No
    - **Disable the relation from being included**: No

# API Documentation
## Authentication
- **POST /api/Customer/login**: Login a customer
    - Request Body:
        - username: string
        - password: string
    - Response:
        - 200: OK
        - 401: Unauthorized

- **POST /api/Customer/logout**: Logout a customer
    - Response:
        - 204: No Content

## Customer
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /api/Customer | Get all customers | YES |
| POST | /api/Customer | Create a new customer | NO |
| GET | /api/Customer/{id} | Get a customer by id | YES |
| PUT | /api/Customer/{id} | Update a customer by id | YES |
| DELETE | /api/Customer/{id} | Delete a customer by id | YES |

- **GET /api/Customer**: Get all customers
    - Response:
        - 200: OK
        - 401: Unauthorized

- **POST /api/Customer**: Create a new customer
    - Request Body:
        - username: string
        - password: string
        - email: string
        - phone: string
        - address: string
    - Response:
        - 200: OK
        - 401: Unauthorized

- **GET /api/Customer/{id}**: Get a customer by id
    - Response:
        - 200: OK
        - 401: Unauthorized

- **PUT /api/Customer/{id}**: Update a customer by id
    - Request Body:
        - username: string
        - password: string
        - email: string
        - phone: string
        - address: string
    - Response:
        - 200: OK
        - 401: Unauthorized

- **DELETE /api/Customer/{id}**: Delete a customer by id
    - Response:
        - 200: No Content
        - 401: Unauthorized

## MenuItem
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | /api/MenuItem | Get all menu items | NO |
| POST | /api/MenuItem | Create a new menu item | admin |
| GET | /api/MenuItem/{id} | Get a menu item by id | NO |
| PUT | /api/MenuItem/{id} | Update a menu item by id | admin |
| DELETE | /api/MenuItem/{id} | Delete a menu item by id | admin |

- **GET /api/MenuItem**: Get all menu items
    - Response:
        - 200: OK
        - 401: Unauthorized

- **POST /api/MenuItem**: Create a new menu item
    - Request Body:
        - name: string
        - description: string
        - quantity: number
        - price: number
        - imageUrl: string
    - Response:
        - 200: OK
        - 401: Unauthorized

- **GET /api/MenuItem/{id}**: Get a menu item by id
    - Response:
        - 200: OK
        - 401: Unauthorized

- **PUT /api/MenuItem/{id}**: Update a menu item by id
    - Request Body:
        - name: string
        - description: string
        - quantity: number
        - price: number
        - imageUrl: string
    - Response:
        - 200: OK
        - 401: Unauthorized

- **DELETE /api/MenuItem/{id}**: Delete a menu item by id
    - Response:
        - 200: No Content
        - 401: Unauthorized

# Testing
- install mocha `npm install -g mocha`
- install chai `npm install chai --save-dev`
- install axios `npm install axios`
- run customer tests `mocha test/customer.test.js`
- run menu item tests `mocha test/menuItem.test.js`
- run order tests `mocha test/order.test.js`

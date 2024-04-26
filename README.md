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
- create objects
    - lb model
        - name: Customer
        - properties: username, password, email, phone, address
        - datasource: db
    - lb model
        - name: MenuItem
        - properties: name, description, quantity, price, imageUrl
        - datasource: db
    - lb model
        - name: Order
        - properties: discount, bought_at
        - datasource: db
    - lb model
        - name: OrderItem
        - properties: quantity, price_at_order
        - datasource: db



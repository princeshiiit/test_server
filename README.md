# AdonisJS API with Redis Caching
This project is a RESTful API built with AdonisJS v6 and TypeScript. It features a simple authentication flow, CRUD endpoints for a Todo application, and utilizes Redis for caching to improve performance.

# Table of Contents
- Features
- Technologies
- Setup Instructions
- API Endpoints
- Running the Project
- Testing the API
- Contributing
- License
# Simple Authentication: Register and login functionalities.

# CRUD Operations: Create, read, update, and delete todos.
Caching with Redis: Utilizes Redis to cache responses for improved performance.
Technologies:
- AdonisJS: Web framework for building APIs and web applications.
- TypeScript: A superset of JavaScript that compiles to plain JavaScript.
- PostgreSQL: Relational database used to store todos.
- Redis: In-memory data structure store used for caching.
- Axios: Promise-based HTTP client for making requests.

# Setup Instructions
### Clone the Repository
- `git clone https://github.com/princeshiiit/test_server.git`
- `cd test_server`

### Install Dependencies
- `npm install`
### Make sure you have Node.js and npm installed. Then run:

1. Install Dependencies
   - Run `npm install` to install the project dependencies.

2. Set Up Environment Variables
   - Create a `.env` file in the root directory.
   - Configure your database and Redis connection settings in the `.env` file.

- DB_CONNECTION=pg
- PG_HOST=127.0.0.1
- PG_PORT=5432
- PG_USER=your_username
- PG_PASSWORD=your_password
- PG_DB_NAME=your_database

- REDIS_HOST: 127.0.0.1
- REDIS_PORT: 6379

# Run Migrations

### Set up the database by running the migrations:
- node ace migration:run

# API Endpoints
## Authentication
## Register

POST /register
Request Body: { "username": "your_username", "password": "your_password" }
Login

POST /login
Request Body: { "username": "your_username", "password": "your_password" }
Todos
Create Todo

POST /todos
Request Body: { "title": "Todo Title", "description": "Todo Description" }
Read All Todos

GET /todos
Read Todo by ID

GET /todos/:id
Update Todo

PUT /todos/:id
Request Body: { "title": "Updated Title", "description": "Updated Description" }

Delete Todo
DELETE /todos/:id

# Running the Project
## To start the development server, run:
- node ace serve --watch
### The API will be available at http://localhost:3333.

Testing the API
You can use tools like Postman or curl to test the API endpoints. Ensure to set the appropriate headers and request bodies as described in the API endpoints section.

Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

License
This project is licensed under the MIT License - see the LICENSE file for details.


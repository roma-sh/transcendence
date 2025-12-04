# Backend

We are using Fastify (framework for node.js) and SQLite3, handling authentication, user management, and game statistics.

---

## Main Logic

The backend uses a modular structure:

- **Routes**: Define HTTP endpoints and map requests to controllers.
- **Controllers**: Process requests, validate input, and call services.
- **Services**: Contain business logic and interact with the database.

Authentication includes user signup, login, and storing user information in SQLite.

---

## Folder Structure (Authentication)

backend/src/

- controllers/auth.controller.js – handles authentication requests
- services/auth.service.js – contains database logic for authentication
- routes/auth.routes.js – defines signup and login endpoints
- db/db.js – connects to SQLite and initializes the users table

---

## How It Works

1. Frontend sends a request to signup or login.
2. Route directs request to the controller.
3. Controller validates input and calls the service.
4. Service executes database operations and returns results.
5. Controller sends the response back to the frontend.

---
## APIs:

login: http://localhost:3000/api/auth/login
sign up: http://localhost:3000/api/auth/signup
log out: http://localhost:3000/api/auth/logout
user data: http://localhost:3000/api/profile
user online status: http://localhost:3000/api/useronline


more API routes will be added

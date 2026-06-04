# Vendor Management System Backend

A backend-focused REST API for managing vendors and suppliers. It uses Node.js, Express.js, PostgreSQL, Prisma ORM, JWT authentication, bcrypt password hashing, request validation, centralized error handling, filtering, pagination, and sorting.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- dotenv
- express-validator
- nodemon

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from the example:

```bash
cp .env.example .env
```

3. Update `DATABASE_URL` and `JWT_SECRET` in `.env`.

4. Generate Prisma client:

```bash
npm run db:generate
```

5. Create/update database tables:

```bash
npm run db:push
```

6. Add sample data:

```bash
npm run db:seed
```

Seed login:

```text
Email: admin@example.com
Password: password123
```

7. Start development server:

```bash
npm run dev
```

8. Open the frontend dashboard:

```text
http://localhost:5000
```

You can register, login, add vendors, edit vendors, delete vendors, search, filter, sort, and paginate from this page.

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Vendors

- `POST /api/vendors`
- `GET /api/vendors`
- `GET /api/vendors/:id`
- `PUT /api/vendors/:id`
- `DELETE /api/vendors/:id`

## Vendor Query Examples

```text
GET /api/vendors?search=steel
GET /api/vendors?status=ACTIVE
GET /api/vendors?city=Mumbai
GET /api/vendors?page=1&limit=10
GET /api/vendors?sortBy=vendorName&sortOrder=asc
```

Allowed `sortBy` values are `vendorName`, `companyName`, and `createdAt`.

## Auth Usage

After login, pass the JWT token in protected requests:

```text
Authorization: Bearer <token>
```

## Deployment

This repository includes `render.yaml` for Render deployment.

1. Push the project to GitHub.
2. Open Render and create a new Blueprint from the GitHub repository.
3. Render will create:

- Node.js web service
- PostgreSQL database
- `DATABASE_URL` from the Render database connection string
- generated `JWT_SECRET`

The Render build command runs Prisma generate, and the pre-deploy command syncs the database schema.

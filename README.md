# 🎫 Event Management System — Backend

A RESTful backend API for an Event Management System built with **Express.js**, **Prisma ORM**, and **PostgreSQL** (Neon). Currently features user authentication with JWT and a fully designed database schema for events, venues, bookings, tickets, and payments.

## Tech Stack

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| **Node.js**           | Runtime                       |
| **Express 5**         | Web framework                 |
| **Prisma ORM**        | Database ORM & migrations     |
| **PostgreSQL (Neon)** | Cloud database                |
| **JWT**               | Authentication tokens         |
| **bcryptjs**          | Password hashing              |
| **Zod**               | Request validation            |
| **CORS**              | Cross-origin resource sharing |
| **dotenv**            | Environment variables         |
| **nodemon**           | Dev auto-reload               |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A PostgreSQL database (e.g. [Neon](https://neon.tech/))

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
NODE_ENV="development"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

| Variable         | Description                                  |
| ---------------- | -------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string                 |
| `NODE_ENV`       | `development` or `production`                |
| `JWT_SECRET`     | Secret key for signing JWT tokens            |
| `JWT_EXPIRES_IN` | Token expiration duration (e.g. `7d`, `24h`) |

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

## API Endpoints

### Health Check

| Method | Endpoint | Description                    |
| ------ | -------- | ------------------------------ |
| `GET`  | `/`      | Returns `{ message: "hello" }` |

### Authentication (`/auth`)

| Method | Endpoint         | Description                 | Request Body                |
| ------ | ---------------- | --------------------------- | --------------------------- |
| `POST` | `/auth/register` | Register a new user         | `{ name, email, password }` |
| `POST` | `/auth/login`    | Login user                  | `{ email, password }`       |
| `POST` | `/auth/logout`   | Logout user (clears cookie) | —                           |
| `GET` | `/auth/me`   | your | —                           |
| `USER` | `/auth/user`   | all user  | —                           |

#### Register — `POST /auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**

- `name` — required, 3–100 characters
- `email` — required, valid email, max 255 characters
- `password` — required, 6–255 characters

**Success Response (201):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ATTENDEE"
    },
    "token": "jwt-token"
  }
}
```

#### Login — `POST /auth/login`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ATTENDEE"
    },
    "token": "jwt-token"
  }
}
```

### Events (`/home`)

| Method | Endpoint      | Description                           |
| ------ | ------------- | ------------------------------------- |
| `GET`  | `/home/hello` | Placeholder — returns welcome message |

## Database Schema

The Prisma schema defines the following models:

```
User ──────< Event (organizer)
User ──────< Booking
Venue ─────< Event
Event ─────< TicketType
TicketType ─< Booking
Booking ───< AttendeeTicket
Booking ───── Payment (1:1)
User ──────< AttendeeTicket (scannedBy)
```

### Models

| Model              | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| **User**           | Users with roles: `ORGANIZER`, `ATTENDEE`, `ADMIN`                        |
| **Venue**          | Event venues with name, address, capacity                                 |
| **Event**          | Events linked to an organizer and venue                                   |
| **TicketType**     | Ticket categories per event (name, price, quantity)                       |
| **Booking**        | User bookings with status: `PENDING`, `CONFIRMED`, `CANCELLED`            |
| **AttendeeTicket** | Individual tickets with QR code tokens for entry                          |
| **Payment**        | Payment records with status: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` |

## Project Structure

```
backend/
├── prisma.config.ts          # Prisma configuration
├── package.json
├── .env                      # Environment variables (not committed)
├── .gitignore
└── src/
    ├── server.js             # Express app entry point
    ├── config/
    │   └── db.js             # Prisma client setup & connection
    ├── controllers/
    │   └── authController.js # Register, login, logout logic
    ├── middleware/
    │   └── validate.js       # Zod validation middleware
    ├── routes/
    │   ├── authRoutes.js     # /auth routes
    │   └── eventRoutes.js    # /home routes (placeholder)
    ├── schema/
    │   └── authSchema.js     # Zod schemas for auth validation
    ├── utils/
    │   └── generateToken.js  # JWT token generation + cookie
    └── generated/
        └── prisma/           # Auto-generated Prisma Client
```

## Scripts

| Command                  | Description                     |
| ------------------------ | ------------------------------- |
| `npm run dev`            | Start dev server with nodemon   |
| `npx prisma migrate dev` | Run database migrations         |
| `npx prisma generate`    | Generate Prisma Client          |
| `npx prisma studio`      | Open Prisma Studio (DB browser) |

## CORS Configuration

The server accepts requests from:

- `http://localhost:3000`
- `http://localhost:5173`

Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`

## License

ISC

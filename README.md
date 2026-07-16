# 🚚 Delivery Buddy Backend

A robust backend API powering the **Delivery Buddy** application, built with **NestJS**, **Prisma ORM**, and **SQLite**.

The API manages drivers, deliveries, work shifts, wallet transactions, caching, and order tracking while exposing fully documented REST endpoints through Swagger.

---

# Features

## Driver Management

- Driver registration
- Driver login (Work ID)
- Driver profile retrieval

## Order Management

- Create delivery orders
- Assign drivers
- Update delivery status
- Retrieve order information

## Shift Management

- Start shift
- Stop shift
- Retrieve active shift
- Retrieve previous shift

## Wallet System

- Wallet balance
- Withdraw funds
- Transaction history
- Cached exchange rates

## API Documentation

Interactive Swagger UI

```
http://localhost:3000/docs
```

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| NestJS | Backend Framework |
| Prisma ORM | Database ORM |
| SQLite | Database |
| Swagger | API Documentation |
| Jest | End-to-End Testing |
| Cache Manager | Response Caching |
| Better SQLite3 | SQLite Driver |

---

# Project Structure

```
src
│
├── drivers
├── orders
├── shifts
├── wallet
├── prisma
├── app.module.ts
└── main.ts

prisma
│
├── schema.prisma
└── dev.db

test
│
├── app.e2e-spec.ts
├── drivers.e2e-spec.ts
├── shifts.e2e-spec.ts
├── wallet.e2e-spec.ts
└── orders.e2e-spec.ts
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/Larry-Craig/delivery-buddy-backend.git
```

Navigate into the project

```bash
cd delivery-buddy-backend
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

Start the server

```bash
npm run start:dev
```

---

# Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# .env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

---

# Running Tests

Run all End-to-End tests

```bash
npm run test:e2e
```

Run specific test suite

```bash
npm run test:e2e -- --testPathPattern=drivers
```

Current Status

```
23 Tests Passed
5 Test Suites Passed
```

---

# API Endpoints

## Drivers

### Register a new driver

```
POST /v1/drivers/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "workId": "DRV-123"
}
```

**Response:**
```json
{
  "id": "1",
  "name": "John Doe",
  "workId": "DRV-123",
  "createdAt": "2026-07-16T10:00:00.000Z"
}
```

---

### Login driver

```
GET /v1/drivers/login?workId=DRV-123
```

**Response:**
```json
{
  "id": "1",
  "name": "John Doe",
  "workId": "DRV-123"
}
```

---

### Get driver profile

```
GET /v1/drivers/:id
```

**Response:**
```json
{
  "id": "1",
  "name": "John Doe",
  "workId": "DRV-123",
  "wallet": {
    "balance": 150.50
  }
}
```

---

## Orders

### Create delivery order

```
POST /v1/orders
```

**Request Body:**
```json
{
  "pickupAddress": "123 Main St",
  "deliveryAddress": "456 Oak Ave",
  "driverId": "1"
}
```

**Response:**
```json
{
  "id": "1",
  "pickupAddress": "123 Main St",
  "deliveryAddress": "456 Oak Ave",
  "status": "PENDING",
  "driverId": "1",
  "createdAt": "2026-07-16T10:00:00.000Z"
}
```

---

### Update order status

```
PATCH /v1/orders/:id/status
```

**Request Body:**
```json
{
  "status": "DELIVERED"
}
```

**Response:**
```json
{
  "id": "1",
  "status": "DELIVERED",
  "updatedAt": "2026-07-16T10:30:00.000Z"
}
```

---

### Get all orders

```
GET /v1/orders
```

**Query Parameters:**
- `driverId` (optional) - Filter by driver
- `status` (optional) - Filter by status

**Response:**
```json
[
  {
    "id": "1",
    "pickupAddress": "123 Main St",
    "deliveryAddress": "456 Oak Ave",
    "status": "DELIVERED",
    "driverId": "1"
  }
]
```

---

## Shifts

### Start shift

```
POST /v1/shifts/start
```

**Request Body:**
```json
{
  "driverId": "1"
}
```

**Response:**
```json
{
  "id": "1",
  "driverId": "1",
  "startTime": "2026-07-16T10:00:00.000Z",
  "endTime": null,
  "isActive": true
}
```

---

### Stop shift

```
POST /v1/shifts/stop
```

**Request Body:**
```json
{
  "driverId": "1"
}
```

**Response:**
```json
{
  "id": "1",
  "driverId": "1",
  "startTime": "2026-07-16T10:00:00.000Z",
  "endTime": "2026-07-16T18:00:00.000Z",
  "isActive": false
}
```

---

### Get active shift

```
GET /v1/shifts/active?driverId=1
```

**Response:**
```json
{
  "id": "1",
  "driverId": "1",
  "startTime": "2026-07-16T10:00:00.000Z",
  "endTime": null,
  "isActive": true
}
```

---

### Get last shift

```
GET /v1/shifts/last?driverId=1
```

**Response:**
```json
{
  "id": "1",
  "driverId": "1",
  "startTime": "2026-07-16T10:00:00.000Z",
  "endTime": "2026-07-16T18:00:00.000Z",
  "isActive": false
}
```

---

## Wallet

### Withdraw funds

```
POST /v1/wallet/withdraw
```

**Request Body:**
```json
{
  "driverId": "1",
  "amount": 50.00,
  "currency": "USD"
}
```

**Response:**
```json
{
  "id": "1",
  "driverId": "1",
  "amount": 50.00,
  "currency": "USD",
  "status": "COMPLETED",
  "transactionDate": "2026-07-16T10:00:00.000Z"
}
```

---

### Get transaction history

```
GET /v1/wallet/transactions?driverId=1
```

**Response:**
```json
[
  {
    "id": "1",
    "driverId": "1",
    "amount": 50.00,
    "currency": "USD",
    "status": "COMPLETED",
    "transactionDate": "2026-07-16T10:00:00.000Z"
  }
]
```

---

### Get exchange rates (cached)

```
GET /v1/wallet/rates
```

**Response:**
```json
{
  "USD": 1.00,
  "EUR": 0.92,
  "GBP": 0.78,
  "NGN": 1550.00,
  "cachedAt": "2026-07-16T10:00:00.000Z"
}
```

---

# Authentication

**Current Implementation:** Work ID-based authentication

**Request Headers:**
```
x-work-id: DRV-123
```

> **Note:** JWT authentication is planned for future releases.

---

# Testing

The backend includes comprehensive End-to-End tests covering:

- Driver Registration
- Driver Login
- Driver Profile
- Wallet Withdrawals
- Wallet Validation
- Wallet Caching
- Shift Management
- Order Management
- API Boot Validation

All tests are currently passing.

---

# Troubleshooting

| Issue | Solution |
|-------|----------|
| Prisma Client not found | Run `npx prisma generate` |
| Migration fails | Delete `prisma/dev.db` and re-migrate |
| Port already in use | Change `PORT` in `.env` file |
| Database connection error | Ensure `DATABASE_URL` is set correctly |

---

# Future Improvements

- JWT Authentication
- Role-Based Authorization
- PostgreSQL Deployment
- Docker Support
- CI/CD Pipeline
- Redis Caching
- Real-time Driver Tracking
- Push Notifications

---

# License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

This project is licensed under the MIT License.

---

# Author

**Larry Craig**

- GitHub: [https://github.com/Larry-Craig](https://github.com/Larry-Craig)

---

# Support

For support, email chewachongcraig@gmail.com or open an issue on GitHub.

---

# Quick Start

```bash
# Clone the repository
git clone https://github.com/Larry-Craig/delivery-buddy-backend.git

# Install dependencies
cd delivery-buddy-backend && npm install

# Set up database
npx prisma generate && npx prisma migrate dev

# Start the server
npm run start:dev

# Run tests
npm run test:e2e
```

---

**Built  using NestJS**

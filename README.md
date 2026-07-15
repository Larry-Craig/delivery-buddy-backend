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

# Running Tests

Run all End-to-End tests

```bash
npm run test:e2e
```

Current Status

```
23 Tests Passed
5 Test Suites Passed
```

---

# API Endpoints

## Drivers

POST

```
/v1/drivers/register
```

GET

```
/v1/drivers/login
```

GET

```
/v1/drivers/:id
```

---

## Orders

POST

```
/v1/orders
```

PATCH

```
/v1/orders/:id/status
```

GET

```
/v1/orders
```

---

## Shifts

POST

```
/v1/shifts/start
```

POST

```
/v1/shifts/stop
```

GET

```
/v1/shifts/active
```

GET

```
/v1/shifts/last
```

---

## Wallet

POST

```
/v1/wallet/withdraw
```

GET

```
/v1/wallet/transactions
```

GET

```
/v1/wallet/rates
```

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

# Author

Larry Craig

GitHub

https://github.com/Larry-Craig

---

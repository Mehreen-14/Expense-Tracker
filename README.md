# Expense Tracker

A full-stack expense tracking application with an **Angular 17** frontend and **Spring Boot 3** backend, persisted in **PostgreSQL 16**.

## Features

- Add, edit, duplicate, and delete expenses
- Dashboard with period summaries:
  - **Today / Yesterday**
  - **This week / Last week**
  - **This month / Last month**
  - **This year / Last year**
- 6-month spending trend chart and daily spending bars
- Favorites and recurring expense flags
- Split expenses among friends with per-participant paid tracking
- Recurring bill manager
- **SSLCommerz payment integration** (sandbox) with success/fail/cancel callbacks
- **Voice-to-form smart input** — speak a phrase  and the form fills itself

## Repository layout

This repository uses two branches that mirror the application's two layers:

| Branch     | Contents                                |
|------------|-----------------------------------------|
| `main`     | Project documentation and Docker config |
| `backend`  | Spring Boot backend source code         |
| `frontend` | Angular frontend source code            |

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL 14+ (or use Docker below)

## 1. Start PostgreSQL

### Option A: Docker (recommended)

```bash
docker compose up -d
```

### Option B: Local PostgreSQL

Create the database:

```sql
CREATE DATABASE expense_tracker;
```

Update credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## 2. Run the backend

```bash
git checkout backend
cd backend
mvn spring-boot:run
```

API runs at `http://localhost:8080`

## 3. Run the frontend

```bash
git checkout frontend
cd frontend
npm install
npm start
```

App runs at `http://localhost:4200`

## SSLCommerz

Payments use the SSLCommerz **sandbox** environment. Sandbox credentials live in
`backend/src/main/resources/application.properties`. To go live, replace them with your
store credentials and update the callback URLs to your deployed domain:

```properties
sslcommerz.api_url=https://securepay.sslcommerz.com/gwprocess/v4/api.php
sslcommerz.validation_url=https://securepay.sslcommerz.com/merchant/api/validation
sslcommerz.store_id=YOUR_STORE_ID
sslcommerz.store_password=YOUR_STORE_PASSWORD
sslcommerz.success_url=https://your-domain.com/payment/success
sslcommerz.fail_url=https://your-domain.com/payment/fail
sslcommerz.cancel_url=https://your-domain.com/payment/cancel
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List all expenses |
| GET | `/api/expenses/summary` | Dashboard summaries |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/{id}` | Update expense |
| DELETE | `/api/expenses/{id}` | Delete expense |
| POST | `/api/expenses/bulk-delete` | Bulk delete expenses |
| PATCH | `/api/expenses/{id}/toggle-favorite` | Toggle favorite flag |
| PATCH | `/api/expenses/{id}/toggle-recurring` | Toggle recurring flag |
| POST | `/api/payment/initiate` | Start SSLCommerz payment |
| POST | `/api/payment/verify` | Verify SSLCommerz payment |
| GET/POST | `/api/bills` | Recurring bill management |
| GET/POST | `/api/splits` | Split expense management |
| POST | `/api/splits/{id}/settle` | Settle a split expense |

## Tech stack

- **Frontend:** Angular 17, TypeScript, RxJS, Remix Icon
- **Backend:** Spring Boot 3.2, Spring Data JPA, Java 17
- **Database:** PostgreSQL 16
- **Payments:** SSLCommerz (sandbox)

## Project structure

```
expense-tracker/
├── backend/          # Spring Boot + JPA + PostgreSQL (backend branch)
├── frontend/         # Angular standalone app (frontend branch)
└── docker-compose.yml
```

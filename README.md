# Notification Service

A lightweight, asynchronous notification service built with **Node.js**, **Express**, **MongoDB**, **Redis**, and **BullMQ**.

The project demonstrates modern backend engineering concepts by decoupling notification delivery from the request-response cycle using a message queue and background workers. It follows a clean, modular architecture that can be extended to support multiple notification channels such as Email, SMS, Push Notifications, and more.

---

## Features

- JWT Authentication
- RESTful APIs for notification management
- Asynchronous notification processing using BullMQ
- Redis-backed job queue
- Background worker architecture
- Notification status tracking
- Automatic retry mechanism for failed jobs
- Provider Factory pattern
- Console notification provider
- Email notification provider using Nodemailer
- Extensible provider architecture
- Layered project structure
- Centralized error handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- BullMQ
- JSON Web Token (JWT)
- Nodemailer


---

# Architecture

```text
                Client
                   │
                   ▼
        POST /notifications
                   │
                   ▼
      Save Notification (MongoDB)
          status = QUEUED
                   │
                   ▼
         BullMQ Queue (Redis)
                   │
                   ▼
        Background Worker
                   │
                   ▼
           ProviderFactory
          ┌────────┴────────┐
          ▼                 ▼
  ConsoleProvider     EmailProvider
          │                 │
          ▼                 ▼
   Console Output     SMTP (Nodemailer)
          │                 │
          └────────┬────────┘
                   ▼
      Update Notification Status
          SENT / FAILED
```

---

# Project Structure

```text
notification-service
│
├── src
│   ├── config
│   │   ├── db.js
│   │   └── redis.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   └── notificationController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Notification.js
│   │
│   ├── providers
│   │   ├── ConsoleProvider.js
│   │   ├── EmailProvider.js
│   │   └── ProviderFactory.js
│   │
│   ├── queues
│   │   └── notificationQueue.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── notificationRoutes.js
│   │
│   ├── services
│   │   └── notificationService.js
│   │
│   ├── workers
│   │   └── notificationWorker.js
│   │
│   ├── utils
│   │   └── validator.js
│   │
│   └── app.js
│
├── server.js
├── package.json
├── .env.example
└── README.md
```

---

# How It Works

1. The client sends a request to create a notification.
2. The API validates the request.
3. A notification document is stored in MongoDB with the status **QUEUED**.
4. A BullMQ job containing the notification ID is pushed to Redis.
5. The background worker consumes jobs from the queue.
6. The worker retrieves the notification from MongoDB.
7. `ProviderFactory` selects the appropriate provider based on the notification channel.
8. The provider attempts to deliver the notification.
9. If delivery succeeds, the notification status becomes **SENT**.
10. If delivery fails, BullMQ retries the job automatically.
11. After all retry attempts are exhausted, the notification status becomes **FAILED**.

---

# Notification Lifecycle

```text
                QUEUED
                   │
                   ▼
             PROCESSING
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
       SENT              FAILED
                             ▲
                             │
                      Automatic Retry
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get authenticated user |

---

## Notifications

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/notifications` | Create a notification |
| GET | `/api/notifications` | Get all notifications |
| GET | `/api/notifications/:id` | Get notification by ID |

---

# Notification Model

```text
Notification

_id
recipient
channel
title
message
status
attempts
createdAt
updatedAt
```

---

# Supported Channels

| Channel | Provider | Status |
|----------|----------|--------|
| console | ConsoleProvider | ✅ Implemented |
| email | EmailProvider (Nodemailer) | ✅ Implemented |
| sms | SMSProvider | 🚧 Planned |
| push | PushProvider | 🚧 Planned |

---

# Running the Project

## Clone Repository

```bash
git clone https://github.com/avadhpatel1508/Notifier.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment

Create a `.env` file.

```env
PORT=3000

MONGO_URI=

JWT_SECRET=

REDIS_HOST=localhost
REDIS_PORT=6379

EMAIL_USER=
EMAIL_PASS=
EMAIL_PORT=
EMAIL_HOST=
EMAIL_FROM=

REDIS_PASS=
REDIS_HOST=
REDIS_PORT=
```

---

## Start Redis

If Redis is installed locally:

```bash
redis-server
```

Or using Docker:

```bash
docker run -d -p 6379:6379 redis
```

---

## Start API Server

```bash
npm run dev
```

---

## Start Background Worker

```bash
npm run worker
```

---

# Design Decisions

## Why Background Workers?

Sending emails or other notifications can take several seconds.

Instead of making users wait for the notification to be delivered, the API immediately stores the notification and queues the job. The background worker processes it independently, keeping the API fast and responsive.

---

## Why BullMQ?

BullMQ provides:

- Reliable job queues
- Automatic retries
- Delayed jobs
- Scalable worker processes
- Redis-backed persistence

This makes it suitable for production-ready asynchronous processing.

---

## Provider Factory Pattern

The worker never communicates directly with notification providers.

Instead, it delegates notification delivery to **ProviderFactory**, which selects the correct provider according to the notification channel.

Current providers:

- ConsoleProvider
- EmailProvider

Future providers can be added without modifying the worker.

Examples:

```
SMSProvider

PushProvider

WhatsAppProvider

SlackProvider
```

This follows the **Open/Closed Principle**, allowing the system to grow without changing existing business logic.

---

## Retry Strategy

BullMQ automatically retries failed jobs.

Typical flow:

```text
Attempt 1
      │
      ▼
 Failed
      │
 Retry
      ▼
Attempt 2
      │
      ▼
 Failed
      │
 Retry
      ▼
Attempt 3
      │
      ▼
FAILED
```

Retry attempts are tracked in the `attempts` field of the notification document.

---

# Future Improvements

- SMS notification provider
- Push notification provider
- Scheduled notifications
- Notification templates
- WebSocket status updates
- Dead Letter Queue (DLQ)
- Notification analytics dashboard
- Rate limiting
- Notification priority queues
- Bulk notifications
- Admin dashboard
- Docker Compose setup
- Kubernetes deployment

---

# Learning Outcomes

This project demonstrates practical backend engineering concepts including:

- REST API development
- JWT Authentication
- Clean Architecture
- Layered Project Structure
- Queue-Based Communication
- Background Workers
- Redis Integration
- BullMQ Job Processing
- Provider Factory Pattern
- Retry Mechanisms
- MongoDB Data Modeling
- Asynchronous Processing
- Error Handling
- Extensible Software Design

---

# Possible Enhancements

The current architecture allows new providers to be integrated with minimal effort.

```
Client
   │
   ▼
API
   │
   ▼
Queue
   │
   ▼
Worker
   │
   ▼
ProviderFactory
      │
 ┌────┼──────┐
 ▼           ▼
Email       SMS          
```

No changes are required in the worker logic when introducing a new provider.

---

# License

This project is licensed under the **MIT License**.

Feel free to use, modify, and extend this project for learning or production use.

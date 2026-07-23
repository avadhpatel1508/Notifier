# Notification Service

A lightweight backend service for processing notifications asynchronously.

The goal of this project is to demonstrate backend engineering concepts such as queue-based processing, clean architecture, background workers, and scalable service design. Instead of sending notifications directly from the API, requests are pushed to a queue and processed by a worker.

The project is intentionally kept small while following production-oriented design principles.

---

## Features

* JWT Authentication
* Create notifications through REST APIs
* Background processing using BullMQ
* Redis-backed job queue
* Notification status tracking
* Retry failed jobs automatically
* Provider abstraction for notification delivery
* Layered project structure
* Centralized error handling

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Redis
* BullMQ
* JWT
* Docker (optional)

---

## Architecture

```
                Client
                   |
                   |
        POST /notifications
                   |
                   v
          Express API Server
                   |
        +----------+-----------+
        |                      |
        |                      |
        v                      v
     MongoDB            BullMQ Queue
                                |
                                |
                                v
                         Notification Worker
                                |
                                |
                                v
                    Notification Provider
                                |
                                v
                         Console Output
```

---

## Project Structure

```
notification-service
│
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── providers
│   ├── queues
│   ├── routes
│   ├── services
│   ├── workers
│   ├── utils
│   └── app.js
│
├── server.js
├── package.json
├── .env.example
└── README.md
```

---

## How It Works

1. Client sends a request to create a notification.
2. API validates the request and stores it in MongoDB with the status **QUEUED**.
3. A BullMQ job is created.
4. The worker picks up the job from Redis.
5. The provider processes the notification.
6. Status is updated to **SENT** or **FAILED**.

This keeps the API responsive while handling notification processing in the background.

---

## Notification Lifecycle

```
QUEUED
   │
   ▼
PROCESSING
   │
   ├──────────────► FAILED
   │                    ▲
   │                    │
   └──── Retry ─────────┘
   │
   ▼
SENT
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login and receive JWT |
| GET    | `/api/auth/me`       | Get current user      |

---

### Notifications

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| POST   | `/api/notifications`     | Create a notification    |
| GET    | `/api/notifications`     | List notifications       |
| GET    | `/api/notifications/:id` | Get notification details |

---

## Notification Model

```
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

## Running the Project

Clone the repository

```bash
git clone <repository-url>
cd notification-service
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000

MONGO_URI=

JWT_SECRET=

REDIS_HOST=localhost
REDIS_PORT=6379
```

Start the API

```bash
npm run dev
```

Start the worker

```bash
npm run worker
```

---

## Design Decisions

### Background Workers

Notifications are processed asynchronously instead of inside the request cycle. This reduces response time and keeps the API independent from notification delivery.

### Provider Layer

The worker communicates with a provider instead of directly sending notifications.

Current implementation:

```
ConsoleProvider
```

New providers can be added later without changing the worker logic.

```
EmailProvider

SMSProvider

PushProvider
```

### Queue

BullMQ handles job scheduling and retries while Redis acts as the message broker.

---

## Future Improvements

* Email provider integration
* Push notifications
* SMS support
* Scheduled notifications
* Notification templates
* WebSocket updates
* Metrics dashboard
* Dead Letter Queue
* Rate limiting

---

## Learning Outcomes

This project focuses on backend fundamentals rather than feature count.

It demonstrates:

* REST API design
* Authentication with JWT
* Layered architecture
* Background job processing
* Queue-based communication
* Worker processes
* Retry mechanisms
* Clean code organization
* Error handling
* Extensible system design

---

## License

This project is open source and available under the MIT License.

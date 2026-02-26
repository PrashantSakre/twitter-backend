# 🐦 Twitter Clone - Microservices Architecture

> A scalable, modular Twitter-like backend built with ElysiaJS, Bun, Redis, PostgreSQL, JWT, meilisearch and BullMQ.

---

## 📦 Services Overview

| Service               | Port   | Description                           |
|----------------------|--------|---------------------------------------|
| `user-service`        | 3000   | Manages profiles, follow system       |
| `auth-service`        | 3001   | Handles JWT login/signup              |
| `tweet-service`       | 3002   | Tweet creation, fetch, metadata       |
| `timeline-service`    | 3004   | Shows user feed and discover tweets   |
| `like-service`        | 3005   | Likes/unlikes, like counts            |
| `notification-service`| 3006   | Sends notifications for likes/follows |
| `reply-service`       | 3007   | Reply for the tweets                  |
| `search-service`      | 3009   | Search for tweets and users           |
| `meilisearch-service` | 3010   | MeiliSearch for tweets and users      |
| `queue-service`       | -      | Handles fanout via BullMQ             |
| `api-gateway-service` | 4000   | API - Global Gateway                  |


---

## 🗂 Folder Structure

```
root/
├── libs/
│   ├── auth-middleware/
│   ├── redis-client.ts
│   ├── queue.ts
│   └── tweet-core/           # Shared logic for tweet validation
│
├── global-api-gateway-service/
├── auth-service/
├── user-service/
├── tweet-service/
├── like-service/
├── timeline-service/
├── queue-service/
├── reply-service/
├── search-service/
├── meilisearch-service/
└── notification-service/
```


---

## 🔐 Authentication
- JWT-based
- Middleware in `libs/auth-middleware`
- Token generated in `auth-service`, verified across services


---

## ⚙️ Tech Stack

- **Language:** TypeScript
- **Runtime:** [Bun](https://bun.sh)
- **Web Framework:** [ElysiaJS](https://elysiajs.com)
- **DB:** PostgreSQL via [Prisma](https://www.prisma.io)
- **Cache / Feed:** Redis
- **Queue:** [BullMQ](https://bullmq.io)
- **meilisearch** [meilisearch](https://www.meilisearch.com/)


---

## 🔄 Fanout Architecture

- On tweet post:
  - `queue-service` enqueues fanout job
  - Job reads all followers from `user-service`
  - Pushes tweet ID into each follower’s Redis feed list


---

## 🧪 Testing
- `bun test` supported in each service
- Redis state is tested directly
- Integration testing via axios + mock headers


---

## 🔜 Coming Services

- `media-service`: File uploads for tweets/avatars

---

## 🧠 Notes
- Redis keys follow `feed:<userId>`, `tweet:<id>:likes`
- Notification data stored as JSON objects in `notifications:<userId>`
- Service URLs configured via environment variables
- Meilisearch integration for searching tweets and users lightning fast.
- rate-limit-service Global throttling

---

## 🛠 Dev Scripts (per service)

```bash
bun run dev       # Start service
```

---

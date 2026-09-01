# Nexus

A real-time chat application built to demonstrate correct distributed-systems engineering around WebSockets, connection state, and message delivery guarantees — not just a CRUD app with a socket bolted on.

## Status: Early build (Day 1 of 12)

This project is under active development. What's below reflects what's actually built right now, not the end-state plan.

**Built so far:**
- Turborepo monorepo scaffolded (`apps/web`, `apps/ws-server`, `packages/db`, `packages/config`)
- `apps/web` — Next.js 15 + Tailwind + shadcn/ui, default scaffold only
- `apps/ws-server` — bare WebSocket server (connect/message/disconnect logging only, no auth or persistence yet)
- `packages/db` — Prisma 7 configured against a real Postgres instance (Neon), connection verified
- `packages/config` — shared TypeScript compiler config, consumed by `ws-server`

**Not built yet:** auth, database schema, real-time message flow, UI beyond the default scaffold. See [Roadmap](#roadmap).

## Why this project

Most chat-app side projects are wrappers around Socket.IO with no real engineering decisions in them. Nexus is deliberately built with the constraints a production real-time system actually has to deal with:

- Multiple devices per user (`userId → Set<socket>`, not a single socket)
- Message ordering that guarantees a client never sees a message that isn't durably persisted (validate → authorize → persist → broadcast → ack)
- Server-derived sender identity — the client never gets to claim who it is
- Explicit authorization on every conversation action, not just authentication at the door

## Architecture

    apps/web (Next.js 15)  <-- WebSocket -->  apps/ws-server (Node + ws)
                                                       |
                                              packages/db (Prisma + Postgres)

Auth (Clerk) sits in front of `apps/web` and issues the token the WS server verifies on connection.

## Stack

- **Frontend:** Next.js 15, Tailwind CSS, shadcn/ui
- **Real-time:** raw `ws` (Node.js + TypeScript) — no Socket.IO abstraction
- **Database:** PostgreSQL (Neon) + Prisma 7
- **Auth:** Clerk (planned)
- **Monorepo:** Turborepo + npm workspaces
- **Deploy:** Railway (`ws-server`), Vercel (`web`)

**Planned for V2:** Redis pub/sub for multi-instance WS fanout, BullMQ for offline notification delivery — added once there's an actual need for more than one server instance, not preemptively.

## Project structure

    nexus/
    ├── apps/
    │   ├── web/          # Next.js 15 frontend
    │   └── ws-server/     # WebSocket server
    ├── packages/
    │   ├── db/            # Prisma schema + client
    │   └── config/        # Shared TypeScript config
    └── turbo.json

## Getting started

    npm install

Set up environment variables:

    cp packages/db/.env.example packages/db/.env
    # fill in your own DATABASE_URL

Run everything in dev mode:

    npm run dev

## Roadmap

- [x] Day 1 — Monorepo, app scaffolds, Prisma connected
- [ ] Day 2 — Data model, Clerk auth
- [ ] Day 3 — WS server core (auth handshake, connection registry, protocol)
- [ ] Day 4–5 — Frontend shell and chat UI
- [ ] Day 6 — End-to-end real-time messaging
- [ ] Day 7 — Presence and typing indicators
- [ ] Day 8 — Pagination, read receipts
- [ ] Day 9 — Group chats
- [ ] Day 10 — File/image sharing
- [ ] Day 11 — Notifications, polish
- [ ] Day 12 — Deploy

## License

MIT

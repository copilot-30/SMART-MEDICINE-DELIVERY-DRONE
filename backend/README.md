# Smart Medicine Delivery Drone Backend

Node.js + Express backend for ESP32-based medicine delivery telemetry, command dispatch, and monitoring.

## Folder structure

- `src/server.js` - server startup
- `src/app.js` - Express app wiring
- `src/routes/*` - API routes (`health`, `devices`, `telemetry`, `commands`, `dashboard`)
- `src/store/memoryStore.js` - in-memory device/telemetry/command state
- `src/middleware/*` - auth and error middleware
- `database/` - PostgreSQL config, migrations, seeding, and CLI runners
- `esp32/smart_medicine_drone.ino` - ESP32 firmware sample
- `esp32/wiring.md` - hardware wiring and power notes

## Quick start

1. Copy `.env.example` to `.env` and configure values.
2. Install packages and run backend.

### Environment

- `PORT` - Express port (default `8080`)
- `DEVICE_SHARED_TOKEN` - optional shared device token checked via `x-device-token` header
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL` - PostgreSQL connection
- `DATABASE_URL` - optional full connection string alternative to `DB_*`

## Database CLI (PostgreSQL)

Run from `backend` folder:

- `node drone db:migrate` -> Create database tables (runs all migrations)
- `node drone db:fresh` -> Recreate all tables (⚠️ ALL DATA GONE)
- `node drone db:seed` -> Create default data (admin user)
- `node drone db:setup` -> Fresh install: migrate + seed (for new devices)
- `node drone db:status` -> Show migration status
- `node drone db:rollback` -> Rollback last migration
- `node drone db:create` -> Create the database if it doesn't exist
- `node drone.js db:drop` -> Drop the configured database

## API contract (core)

### 1) Register ESP32 device

- `POST /api/devices/register`
- Body:
  - `deviceId` (string)
  - `firmwareVersion` (string)
  - `capabilities` (string[] optional)

### 2) Send telemetry from ESP32

- `POST /api/telemetry`
- Header: `x-device-token` (if enabled)
- Body supports:
  - `deviceId`
  - `gps.lat`, `gps.lng`, `gps.altitude`, `gps.speedKmph`, `gps.satellites`
  - `batteryPercent`, `signalQuality`
  - `servoLocked`, `limitSwitchPressed`, `buttonPressed`, `ledOn`, `buzzerOn`

### 3) Queue command for device

- `POST /api/commands`
- Body:
  - `deviceId`
  - `type` in: `SERVO_DROP`, `BUZZER_ALERT`, `LED_ON`, `LED_OFF`, `PING`
  - `payload` optional

### 4) ESP32 pulls next command

- `GET /api/commands/device/:deviceId/next`
- Header: `x-device-token` (if enabled)
- Returns `204` when no pending command.

### 5) ESP32 acknowledges command result

- `POST /api/commands/:commandId/ack`
- Header: `x-device-token` (if enabled)
- Body:
  - `status`: `acked` | `failed`
  - `result` object optional
  - `error` string optional

### 6) Device status and dashboard

- `GET /api/devices/:deviceId/status`
- `GET /api/dashboard/snapshot`
- `GET /api/dashboard/stream` (SSE real-time events)

## ESP32 firmware notes

Firmware example in `esp32/smart_medicine_drone.ino` is designed for:

- ESP32 DevKit V1
- NEO-6M GPS
- SIM800L GPRS transport
- MG90S/SG90 servo payload lock/drop
- LED, buzzer, limit switch, push button

Update these values before flashing:

- `APN`, `GPRS_USER`, `GPRS_PASS`
- `SERVER_HOST`, `SERVER_PORT`
- `DEVICE_TOKEN` (must match backend `.env` when auth is enabled)


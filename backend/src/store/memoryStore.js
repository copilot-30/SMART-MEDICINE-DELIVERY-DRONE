const { randomUUID } = require("node:crypto")
const { EventEmitter } = require("node:events")

const events = new EventEmitter()

const devices = new Map()
const telemetry = new Map()
const commands = new Map()
const deviceCommandIds = new Map()

function resetStore() {
  devices.clear()
  telemetry.clear()
  commands.clear()
  deviceCommandIds.clear()
}

function registerDevice({ deviceId, firmwareVersion, capabilities = [] }) {
  const now = new Date().toISOString()
  const existing = devices.get(deviceId)
  const device = {
    deviceId,
    firmwareVersion,
    capabilities,
    firstSeenAt: existing?.firstSeenAt || now,
    registeredAt: now,
    lastSeenAt: existing?.lastSeenAt || null,
    status: existing?.status || "offline",
  }

  devices.set(deviceId, device)
  events.emit("device:registered", device)
  return device
}

function saveTelemetry(payload) {
  const now = new Date().toISOString()
  const item = {
    id: randomUUID(),
    receivedAt: now,
    ...payload,
  }

  const current = telemetry.get(payload.deviceId) || []
  current.unshift(item)
  telemetry.set(payload.deviceId, current.slice(0, 200))

  const device = devices.get(payload.deviceId)
  if (device) {
    device.lastSeenAt = now
    device.status = "online"
    devices.set(payload.deviceId, device)
  }

  events.emit("telemetry:received", item)
  return item
}

function enqueueCommand({ deviceId, type, payload = {} }) {
  const now = new Date().toISOString()
  const command = {
    id: randomUUID(),
    deviceId,
    type,
    payload,
    status: "pending",
    createdAt: now,
    deliveredAt: null,
    ackedAt: null,
    result: null,
    error: null,
  }

  commands.set(command.id, command)
  const queue = deviceCommandIds.get(deviceId) || []
  queue.push(command.id)
  deviceCommandIds.set(deviceId, queue)
  events.emit("command:queued", command)
  return command
}

function getNextCommand(deviceId) {
  const queue = deviceCommandIds.get(deviceId) || []
  for (const commandId of queue) {
    const command = commands.get(commandId)
    if (!command) continue
    if (command.status === "pending") {
      command.status = "delivered"
      command.deliveredAt = new Date().toISOString()
      commands.set(command.id, command)
      events.emit("command:delivered", command)
      return command
    }
  }

  return null
}

function ackCommand(commandId, { status, result = null, error = null }) {
  const command = commands.get(commandId)
  if (!command) return null

  command.status = status
  command.result = result
  command.error = error
  command.ackedAt = new Date().toISOString()
  commands.set(command.id, command)
  events.emit("command:acked", command)
  return command
}

function listDevices() {
  return [...devices.values()]
}

function getDevice(deviceId) {
  return devices.get(deviceId) || null
}

function getLatestTelemetry(deviceId) {
  const rows = telemetry.get(deviceId) || []
  return rows[0] || null
}

function listCommandsByDevice(deviceId, limit = 30) {
  const ids = deviceCommandIds.get(deviceId) || []
  return ids
    .map((id) => commands.get(id))
    .filter(Boolean)
    .slice(-limit)
    .reverse()
}

function getCommand(commandId) {
  return commands.get(commandId) || null
}

module.exports = {
  events,
  resetStore,
  registerDevice,
  saveTelemetry,
  enqueueCommand,
  getNextCommand,
  ackCommand,
  listDevices,
  getDevice,
  getLatestTelemetry,
  listCommandsByDevice,
  getCommand,
}

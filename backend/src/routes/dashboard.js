const express = require("express")

const {
  events,
  getLatestTelemetry,
  listCommandsByDevice,
  listDevices,
} = require("../store/memoryStore")

const router = express.Router()

router.get("/snapshot", (_req, res) => {
  const devices = listDevices().map((d) => ({
    ...d,
    latestTelemetry: getLatestTelemetry(d.deviceId),
    recentCommands: listCommandsByDevice(d.deviceId, 5),
  }))

  return res.json({ ok: true, data: devices })
})

router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders?.()

  const writeEvent = (eventName, payload) => {
    res.write(`event: ${eventName}\n`)
    res.write(`data: ${JSON.stringify(payload)}\n\n`)
  }

  const onTelemetry = (payload) => writeEvent("telemetry", payload)
  const onCommandQueued = (payload) => writeEvent("commandQueued", payload)
  const onCommandAcked = (payload) => writeEvent("commandAcked", payload)

  events.on("telemetry:received", onTelemetry)
  events.on("command:queued", onCommandQueued)
  events.on("command:acked", onCommandAcked)

  const heartbeat = setInterval(() => {
    res.write(`event: ping\ndata: {}\n\n`)
  }, 15000)

  req.on("close", () => {
    clearInterval(heartbeat)
    events.off("telemetry:received", onTelemetry)
    events.off("command:queued", onCommandQueued)
    events.off("command:acked", onCommandAcked)
  })
})

module.exports = { dashboardRouter: router }

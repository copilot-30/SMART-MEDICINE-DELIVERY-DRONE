const express = require("express")
const { z } = require("zod")

const {
  getDevice,
  getLatestTelemetry,
  listCommandsByDevice,
  listDevices,
  registerDevice,
} = require("../store/memoryStore")

const registerSchema = z.object({
  deviceId: z.string().min(2).max(100),
  firmwareVersion: z.string().min(1).max(60),
  capabilities: z.array(z.string().min(1).max(60)).optional(),
})

const router = express.Router()

router.post("/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  }

  const device = registerDevice(parsed.data)
  return res.status(201).json({ ok: true, data: device })
})

router.get("/", (_req, res) => {
  return res.json({ ok: true, data: listDevices() })
})

router.get("/:deviceId/status", (req, res) => {
  const { deviceId } = req.params
  const device = getDevice(deviceId)
  if (!device) {
    return res.status(404).json({ ok: false, error: "Device not found" })
  }

  const latestTelemetry = getLatestTelemetry(deviceId)
  const commands = listCommandsByDevice(deviceId, 10)

  return res.json({
    ok: true,
    data: {
      device,
      latestTelemetry,
      commands,
    },
  })
})

module.exports = { devicesRouter: router }

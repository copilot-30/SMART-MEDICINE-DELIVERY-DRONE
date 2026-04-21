const express = require("express")
const { z } = require("zod")

const {
  ackCommand,
  enqueueCommand,
  getCommand,
  getNextCommand,
  getDevice,
  listCommandsByDevice,
} = require("../store/memoryStore")

const createCommandSchema = z.object({
  deviceId: z.string().min(2).max(100),
  type: z.enum(["SERVO_DROP", "BUZZER_ALERT", "LED_ON", "LED_OFF", "PING"]),
  payload: z.record(z.any()).optional(),
})

const ackSchema = z.object({
  status: z.enum(["acked", "failed"]),
  result: z.record(z.any()).optional(),
  error: z.string().max(500).nullable().optional(),
})

const router = express.Router()

router.post("/", (req, res) => {
  const parsed = createCommandSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  }

  const device = getDevice(parsed.data.deviceId)
  if (!device) {
    return res.status(404).json({ ok: false, error: "Target device not registered" })
  }

  const command = enqueueCommand(parsed.data)
  return res.status(201).json({ ok: true, data: command })
})

router.get("/device/:deviceId", (req, res) => {
  const { deviceId } = req.params
  const data = listCommandsByDevice(deviceId, 50)
  return res.json({ ok: true, data })
})

router.get("/device/:deviceId/next", (req, res) => {
  const { deviceId } = req.params
  const command = getNextCommand(deviceId)
  if (!command) {
    return res.status(204).send()
  }

  return res.json({ ok: true, data: command })
})

router.post("/:commandId/ack", (req, res) => {
  const parsed = ackSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  }

  const command = getCommand(req.params.commandId)
  if (!command) {
    return res.status(404).json({ ok: false, error: "Command not found" })
  }

  const updated = ackCommand(req.params.commandId, {
    status: parsed.data.status,
    result: parsed.data.result || null,
    error: parsed.data.error || null,
  })

  return res.json({ ok: true, data: updated })
})

module.exports = { commandsRouter: router }

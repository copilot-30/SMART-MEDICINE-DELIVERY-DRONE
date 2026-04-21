const express = require("express")
const { z } = require("zod")

const { saveTelemetry } = require("../store/memoryStore")

const telemetrySchema = z.object({
  deviceId: z.string().min(2).max(100),
  gps: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      altitude: z.number().optional(),
      speedKmph: z.number().optional(),
      satellites: z.number().int().optional(),
    })
    .optional(),
  batteryPercent: z.number().min(0).max(100).optional(),
  signalQuality: z.number().min(0).max(31).optional(),
  servoLocked: z.boolean().optional(),
  limitSwitchPressed: z.boolean().optional(),
  buttonPressed: z.boolean().optional(),
  ledOn: z.boolean().optional(),
  buzzerOn: z.boolean().optional(),
  meta: z.record(z.any()).optional(),
})

const router = express.Router()

router.post("/", (req, res) => {
  const parsed = telemetrySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  }

  const row = saveTelemetry(parsed.data)
  return res.status(201).json({ ok: true, data: row })
})

module.exports = { telemetryRouter: router }

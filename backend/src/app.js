const cors = require("cors")
const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")

const { deviceAuth } = require("./middleware/deviceAuth")
const { errorHandler } = require("./middleware/errorHandler")
const { commandsRouter } = require("./routes/commands")
const { dashboardRouter } = require("./routes/dashboard")
const { devicesRouter } = require("./routes/devices")
const { healthRouter } = require("./routes/health")
const { telemetryRouter } = require("./routes/telemetry")

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))

app.use("/api/health", healthRouter)
app.use("/api/devices", devicesRouter)
app.use("/api/telemetry", deviceAuth, telemetryRouter)
app.use("/api/commands/device/:deviceId/next", deviceAuth, (req, res, next) => next())
app.use("/api/commands/:commandId/ack", deviceAuth, (req, res, next) => next())
app.use("/api/commands", commandsRouter)
app.use("/api/dashboard", dashboardRouter)

app.use((req, res) => {
  res.status(404).json({ ok: false, error: `Route not found: ${req.method} ${req.path}` })
})

app.use(errorHandler)

module.exports = { app }

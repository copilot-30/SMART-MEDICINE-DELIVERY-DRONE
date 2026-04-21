const express = require("express")

const router = express.Router()

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "smart-medicine-drone-backend",
    timestamp: new Date().toISOString(),
  })
})

module.exports = { healthRouter: router }

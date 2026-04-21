const { config } = require("../config")

function deviceAuth(req, res, next) {
  if (!config.deviceSharedToken) {
    return next()
  }

  const token = req.header("x-device-token")
  if (!token || token !== config.deviceSharedToken) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized device token",
    })
  }

  next()
}

module.exports = { deviceAuth }

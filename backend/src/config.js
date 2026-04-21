const dotenv = require("dotenv")

dotenv.config()

const config = {
  port: Number(process.env.PORT || 8080),
  deviceSharedToken: process.env.DEVICE_SHARED_TOKEN || "",
}

module.exports = { config }

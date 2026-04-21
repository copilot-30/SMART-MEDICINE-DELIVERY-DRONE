const path = require("node:path")
const dotenv = require("dotenv")

dotenv.config({ path: path.resolve(process.cwd(), ".env") })

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase())
}

function resolveSslConfig() {
  return parseBoolean(process.env.DB_SSL, false)
    ? { rejectUnauthorized: false }
    : false
}

function getDatabaseName() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL)
    return url.pathname.replace(/^\//, "") || "postgres"
  }

  return process.env.DB_NAME || "smart_medicine_drone"
}

function getDbConnectionConfig({ databaseOverride } = {}) {
  const ssl = resolveSslConfig()

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL)
    if (databaseOverride) {
      url.pathname = `/${databaseOverride}`
    }

    return {
      connectionString: url.toString(),
      ssl,
    }
  }

  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: databaseOverride || getDatabaseName(),
    ssl,
  }
}

function getMaintenanceConnectionConfig() {
  return getDbConnectionConfig({ databaseOverride: "postgres" })
}

module.exports = {
  getDatabaseName,
  getDbConnectionConfig,
  getMaintenanceConnectionConfig,
}

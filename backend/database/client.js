const { Client, Pool } = require("pg")
const { getDbConnectionConfig, getMaintenanceConnectionConfig } = require("./config")

function createPool() {
  return new Pool(getDbConnectionConfig())
}

function createClient() {
  return new Client(getDbConnectionConfig())
}

function createMaintenanceClient() {
  return new Client(getMaintenanceConnectionConfig())
}

async function withClient(work) {
  const client = createClient()
  await client.connect()
  try {
    return await work(client)
  } finally {
    await client.end()
  }
}

module.exports = {
  createPool,
  createClient,
  createMaintenanceClient,
  withClient,
}

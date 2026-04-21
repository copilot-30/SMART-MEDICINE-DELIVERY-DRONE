const { withClient } = require("./client")
const { seed } = require("./seeds")

async function runSeed() {
  return withClient(async (client) => {
    await client.query("BEGIN")
    try {
      await seed(client)
      await client.query("COMMIT")
      console.log("🌱 Seed completed.")
      return true
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    }
  })
}

module.exports = { runSeed }

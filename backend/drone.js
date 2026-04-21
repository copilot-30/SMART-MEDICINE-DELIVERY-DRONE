#!/usr/bin/env node

const {
  createDatabase,
  dropDatabase,
  fresh,
  migrate,
  rollback,
  runSeed,
  status,
} = require("./database")

const helpText = `
Usage:
  node drone db:create
  node drone db:migrate
  node drone db:fresh
  node drone db:seed
  node drone db:setup
  node drone db:status
  node drone db:rollback
  node drone.js db:drop

Commands:
  db:create    Create the database if it doesn't exist.
  db:migrate   Run all pending migrations.
  db:fresh     Recreate all tables (ALL DATA WILL BE LOST).
  db:seed      Insert default seed data (admin user).
  db:setup     Fresh install: db:create + db:migrate + db:seed.
  db:status    Show migration status.
  db:rollback  Rollback the last applied migration.
  db:drop      Drop the configured database.
`

async function main() {
  const command = process.argv[2]

  if (!command || command === "help" || command === "--help" || command === "-h") {
    console.log(helpText)
    return
  }

  try {
    switch (command) {
      case "db:create":
        await createDatabase()
        break
      case "db:migrate":
        await migrate()
        break
      case "db:fresh":
        await fresh()
        break
      case "db:seed":
        await runSeed()
        break
      case "db:setup":
        await createDatabase()
        await migrate()
        await runSeed()
        break
      case "db:status":
        await status()
        break
      case "db:rollback":
        await rollback()
        break
      case "db:drop":
        await dropDatabase()
        break
      default:
        console.error(`Unknown command: ${command}`)
        console.log(helpText)
        process.exitCode = 1
    }
  } catch (error) {
    console.error("❌ Command failed:", error.message)
    process.exitCode = 1
  }
}

main()

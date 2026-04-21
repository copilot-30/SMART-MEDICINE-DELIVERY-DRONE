const fs = require("node:fs")
const path = require("node:path")

const { getDatabaseName } = require("./config")
const { createMaintenanceClient, withClient } = require("./client")

const migrationsDir = path.resolve(__dirname, "migrations")

function loadMigrations() {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".js"))
    .sort((a, b) => a.localeCompare(b))

  return files.map((file) => {
    const fullPath = path.join(migrationsDir, file)
    const mod = require(fullPath)

    return {
      id: path.basename(file, ".js"),
      name: mod.name || path.basename(file, ".js"),
      up: mod.up,
      down: mod.down,
    }
  })
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

async function getAppliedMigrations(client) {
  await ensureMigrationsTable(client)
  const result = await client.query(
    `SELECT id, name, applied_at FROM schema_migrations ORDER BY applied_at ASC;`
  )
  return result.rows
}

async function migrate() {
  return withClient(async (client) => {
    const migrations = loadMigrations()
    const appliedRows = await getAppliedMigrations(client)
    const appliedSet = new Set(appliedRows.map((row) => row.id))

    const pending = migrations.filter((m) => !appliedSet.has(m.id))

    for (const migration of pending) {
      await client.query("BEGIN")
      try {
        await migration.up(client)
        await client.query(
          `INSERT INTO schema_migrations (id, name) VALUES ($1, $2)`,
          [migration.id, migration.name]
        )
        await client.query("COMMIT")
        console.log(`✅ Migrated: ${migration.id}`)
      } catch (error) {
        await client.query("ROLLBACK")
        throw error
      }
    }

    if (pending.length === 0) {
      console.log("ℹ️ No pending migrations.")
    }

    return pending.length
  })
}

async function rollback() {
  return withClient(async (client) => {
    const migrations = loadMigrations()
    const byId = new Map(migrations.map((m) => [m.id, m]))
    const applied = await getAppliedMigrations(client)
    const last = applied.at(-1)

    if (!last) {
      console.log("ℹ️ No migrations to rollback.")
      return 0
    }

    const migration = byId.get(last.id)
    if (!migration || typeof migration.down !== "function") {
      throw new Error(`Rollback not found for migration ${last.id}`)
    }

    await client.query("BEGIN")
    try {
      await migration.down(client)
      await client.query(`DELETE FROM schema_migrations WHERE id = $1`, [last.id])
      await client.query("COMMIT")
      console.log(`↩️ Rolled back: ${last.id}`)
      return 1
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    }
  })
}

async function status() {
  return withClient(async (client) => {
    const migrations = loadMigrations()
    const applied = await getAppliedMigrations(client)
    const appliedMap = new Map(applied.map((row) => [row.id, row]))

    console.log(`\nMigration status for database: ${getDatabaseName()}`)
    console.log("------------------------------------------------")
    for (const migration of migrations) {
      const row = appliedMap.get(migration.id)
      if (row) {
        console.log(`✅ ${migration.id}  (${row.applied_at.toISOString()})`)
      } else {
        console.log(`⏳ ${migration.id}  (pending)`)
      }
    }
    console.log("------------------------------------------------\n")
    return migrations.length
  })
}

async function fresh() {
  await withClient(async (client) => {
    console.log("⚠️ Dropping all tables via schema reset...")
    await client.query(`DROP SCHEMA IF EXISTS public CASCADE;`)
    await client.query(`CREATE SCHEMA public;`)
    await client.query(`GRANT ALL ON SCHEMA public TO CURRENT_USER;`)
    await client.query(`GRANT ALL ON SCHEMA public TO PUBLIC;`)
  })

  return migrate()
}

async function createDatabase() {
  const dbName = getDatabaseName()
  const adminClient = createMaintenanceClient()
  await adminClient.connect()
  try {
    const exists = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])
    if (exists.rowCount > 0) {
      console.log(`ℹ️ Database already exists: ${dbName}`)
      return false
    }

    const safeName = dbName.replace(/"/g, "")
    await adminClient.query(`CREATE DATABASE "${safeName}"`)
    console.log(`✅ Database created: ${dbName}`)
    return true
  } finally {
    await adminClient.end()
  }
}

async function dropDatabase() {
  const dbName = getDatabaseName()
  const adminClient = createMaintenanceClient()
  await adminClient.connect()
  try {
    await adminClient.query(
      `SELECT pg_terminate_backend(pid)
       FROM pg_stat_activity
       WHERE datname = $1 AND pid <> pg_backend_pid();`,
      [dbName]
    )

    const safeName = dbName.replace(/"/g, "")
    await adminClient.query(`DROP DATABASE IF EXISTS "${safeName}"`)
    console.log(`🗑️ Database dropped (if existed): ${dbName}`)
    return true
  } finally {
    await adminClient.end()
  }
}

module.exports = {
  migrate,
  rollback,
  status,
  fresh,
  createDatabase,
  dropDatabase,
}

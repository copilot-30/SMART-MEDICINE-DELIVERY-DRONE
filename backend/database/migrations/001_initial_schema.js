const name = "001_initial_schema"

async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id BIGSERIAL PRIMARY KEY,
      username VARCHAR(60) NOT NULL UNIQUE,
      email VARCHAR(120) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS services (
      id BIGSERIAL PRIMARY KEY,
      code VARCHAR(40) NOT NULL UNIQUE,
      name VARCHAR(120) NOT NULL,
      description TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS schedules (
      id BIGSERIAL PRIMARY KEY,
      service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
      day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      enabled BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

async function down(client) {
  await client.query(`DROP TABLE IF EXISTS schedules;`)
  await client.query(`DROP TABLE IF EXISTS services;`)
  await client.query(`DROP TABLE IF EXISTS admins;`)
}

module.exports = { name, up, down }

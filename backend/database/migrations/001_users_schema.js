const name = "001_users_schema"

async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      full_name VARCHAR(120),
      email VARCHAR(120) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'receiver' CHECK (role IN ('admin', 'receiver')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

async function down(client) {
  await client.query(`DROP TABLE IF EXISTS users;`)
}

module.exports = { name, up, down }

const name = "002_drone_ops_schema"

async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS devices (
      id BIGSERIAL PRIMARY KEY,
      device_id VARCHAR(100) NOT NULL UNIQUE,
      firmware_version VARCHAR(60),
      status VARCHAR(30) NOT NULL DEFAULT 'offline',
      last_seen_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS telemetry_logs (
      id BIGSERIAL PRIMARY KEY,
      device_id VARCHAR(100) NOT NULL,
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      altitude DOUBLE PRECISION,
      speed_kmph DOUBLE PRECISION,
      satellites INTEGER,
      battery_percent DOUBLE PRECISION,
      signal_quality INTEGER,
      servo_locked BOOLEAN,
      limit_switch_pressed BOOLEAN,
      button_pressed BOOLEAN,
      led_on BOOLEAN,
      buzzer_on BOOLEAN,
      meta JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS drone_commands (
      id BIGSERIAL PRIMARY KEY,
      command_uuid UUID NOT NULL UNIQUE,
      device_id VARCHAR(100) NOT NULL,
      command_type VARCHAR(50) NOT NULL,
      payload JSONB,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      result JSONB,
      error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      delivered_at TIMESTAMPTZ,
      acked_at TIMESTAMPTZ
    );
  `)

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_telemetry_device_created
    ON telemetry_logs (device_id, created_at DESC);
  `)

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_commands_device_status
    ON drone_commands (device_id, status);
  `)
}

async function down(client) {
  await client.query(`DROP TABLE IF EXISTS drone_commands;`)
  await client.query(`DROP TABLE IF EXISTS telemetry_logs;`)
  await client.query(`DROP TABLE IF EXISTS devices;`)
}

module.exports = { name, up, down }

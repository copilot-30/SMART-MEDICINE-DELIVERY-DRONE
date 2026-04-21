async function seed(client) {
  await client.query(`
    INSERT INTO users (full_name, email, password, role)
    VALUES ('Admin User', 'admin@gmail,com', 'jalaka09', 'admin')
    ON CONFLICT (email) DO NOTHING;
  `)
}

module.exports = { seed }

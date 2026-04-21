async function seed(client) {
  await client.query(`
    INSERT INTO admins (username, email, password_hash, role)
    VALUES ('admin', 'admin@drone.local', 'change-me', 'admin')
    ON CONFLICT (username) DO NOTHING;
  `)

  await client.query(`
    INSERT INTO services (code, name, description)
    VALUES
      ('EMR_MED', 'Emergency Medicine', 'Urgent medicine and life-saving payload dispatch.'),
      ('VACCINE', 'Vaccine Transport', 'Temperature-aware vaccine transport service.'),
      ('LAB_PICKUP', 'Lab Sample Pickup', 'Clinic and hospital sample logistics.')
    ON CONFLICT (code) DO NOTHING;
  `)

  await client.query(`
    INSERT INTO schedules (service_id, day_of_week, start_time, end_time, enabled)
    SELECT s.id, d.day_of_week, '08:00', '18:00', TRUE
    FROM services s
    CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS d(day_of_week)
    WHERE s.code IN ('EMR_MED', 'VACCINE', 'LAB_PICKUP')
      AND NOT EXISTS (
        SELECT 1
        FROM schedules sc
        WHERE sc.service_id = s.id
          AND sc.day_of_week = d.day_of_week
          AND sc.start_time = '08:00'
          AND sc.end_time = '18:00'
      );
  `)
}

module.exports = { seed }

-- Make districts.id auto-increment using IDENTITY
ALTER TABLE districts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;
SELECT setval(pg_get_serial_sequence('districts', 'id'), COALESCE((SELECT MAX(id) FROM districts), 1), true);

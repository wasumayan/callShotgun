CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  destination VARCHAR(100) NOT NULL,
  departure_date DATE NOT NULL,
  arrival_date DATE NOT NULL,
  budget INTEGER,
  transport_modes TEXT[],
  trip_name VARCHAR(100),
  interests TEXT[],
  flexibility VARCHAR(50),
  notes TEXT,
  group_size INTEGER,
  travel_style VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- You may need to add a foreign key constraint for user_id referencing your users table if it exists. 
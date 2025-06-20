ALTER TABLE trips
  ADD COLUMN trip_name VARCHAR(100),
  ADD COLUMN interests TEXT[],
  ADD COLUMN flexibility VARCHAR(50),
  ADD COLUMN notes TEXT,
  ADD COLUMN group_size INTEGER,
  ADD COLUMN travel_style VARCHAR(50); 
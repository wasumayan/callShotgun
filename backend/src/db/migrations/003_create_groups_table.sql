CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_members (
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (group_id, user_id)
); 
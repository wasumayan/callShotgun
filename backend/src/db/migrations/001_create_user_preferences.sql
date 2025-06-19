-- Create enum for transport modes
CREATE TYPE transport_mode AS ENUM (
    'plane',
    'train',
    'bus',
    'car',
    'ferry',
    'bicycle',
    'walking'
);

-- Create user preferences table
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Weights (must sum to 1)
    destination_weight DECIMAL(3,2) NOT NULL DEFAULT 0.4,
    date_overlap_weight DECIMAL(3,2) NOT NULL DEFAULT 0.3,
    budget_weight DECIMAL(3,2) NOT NULL DEFAULT 0.2,
    transport_weight DECIMAL(3,2) NOT NULL DEFAULT 0.1,
    -- Constraints
    max_budget_difference DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    min_date_overlap INTEGER NOT NULL DEFAULT 1,
    -- Arrays for transport preferences
    required_transport_modes transport_mode[] DEFAULT '{}',
    excluded_transport_modes transport_mode[] DEFAULT '{}',
    -- Additional preferences
    preferred_age_range_min INTEGER,
    preferred_age_range_max INTEGER,
    preferred_gender VARCHAR(50)[],
    preferred_languages VARCHAR(50)[],
    preferred_interests VARCHAR(100)[],
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Constraints
    CONSTRAINT weights_sum_to_one CHECK (
        destination_weight + date_overlap_weight + budget_weight + transport_weight = 1
    ),
    CONSTRAINT valid_age_range CHECK (
        (preferred_age_range_min IS NULL AND preferred_age_range_max IS NULL) OR
        (preferred_age_range_min <= preferred_age_range_max)
    )
);

-- Create index for faster lookups
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 
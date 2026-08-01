BEGIN;

CREATE TABLE IF NOT EXISTS airlines (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(3) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL UNIQUE,
  country VARCHAR(80) NOT NULL DEFAULT 'India',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT airlines_code_format CHECK (code ~ '^[A-Z0-9]{2,3}$')
);

CREATE TABLE IF NOT EXISTS airports (
  id BIGSERIAL PRIMARY KEY,
  code CHAR(3) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(80) NOT NULL DEFAULT 'India',
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  timezone VARCHAR(60) NOT NULL DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT airports_code_format CHECK (code ~ '^[A-Z]{3}$')
);

CREATE TABLE IF NOT EXISTS routes (
  id BIGSERIAL PRIMARY KEY,
  origin_airport_id BIGINT NOT NULL REFERENCES airports(id) ON DELETE RESTRICT,
  destination_airport_id BIGINT NOT NULL REFERENCES airports(id) ON DELETE RESTRICT,
  distance_km INTEGER NOT NULL,
  scheduled_duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT routes_distinct_airports CHECK (origin_airport_id <> destination_airport_id),
  CONSTRAINT routes_positive_distance CHECK (distance_km > 0),
  CONSTRAINT routes_unique_pair UNIQUE (origin_airport_id, destination_airport_id)
);

CREATE TABLE IF NOT EXISTS flights (
  id BIGSERIAL PRIMARY KEY,
  flight_number VARCHAR(12) NOT NULL,
  airline_id BIGINT NOT NULL REFERENCES airlines(id) ON DELETE RESTRICT,
  route_id BIGINT NOT NULL REFERENCES routes(id) ON DELETE RESTRICT,
  flight_date DATE NOT NULL,
  scheduled_departure TIME NOT NULL,
  actual_departure TIME,
  scheduled_arrival TIME NOT NULL,
  actual_arrival TIME,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
  weather VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT flights_delay_nonnegative CHECK (delay_minutes >= 0),
  CONSTRAINT flights_status_valid CHECK (status IN ('Scheduled', 'On time', 'Delayed', 'Cancelled', 'Diverted')),
  CONSTRAINT flights_weather_valid CHECK (weather IS NULL OR weather IN ('Clear', 'Cloudy', 'Rain', 'Fog', 'Storm')),
  CONSTRAINT flights_service_unique UNIQUE (flight_number, flight_date)
);

CREATE TABLE IF NOT EXISTS model_versions (
  id BIGSERIAL PRIMARY KEY,
  version VARCHAR(40) NOT NULL UNIQUE,
  algorithm VARCHAR(100) NOT NULL,
  trained_at TIMESTAMPTZ NOT NULL,
  training_rows INTEGER NOT NULL,
  metrics JSONB NOT NULL,
  feature_importance JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prediction_logs (
  id BIGSERIAL PRIMARY KEY,
  airline_code VARCHAR(3) NOT NULL,
  origin_code CHAR(3) NOT NULL,
  destination_code CHAR(3) NOT NULL,
  departure_hour SMALLINT NOT NULL,
  month SMALLINT NOT NULL,
  day_of_week VARCHAR(10) NOT NULL,
  distance_km INTEGER NOT NULL,
  weather VARCHAR(20) NOT NULL,
  prediction VARCHAR(40) NOT NULL,
  probability NUMERIC(5,2) NOT NULL,
  expected_delay_minutes INTEGER NOT NULL,
  model_version VARCHAR(40) NOT NULL,
  used_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  request_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT prediction_probability_range CHECK (probability BETWEEN 0 AND 100),
  CONSTRAINT prediction_hour_range CHECK (departure_hour BETWEEN 0 AND 23),
  CONSTRAINT prediction_month_range CHECK (month BETWEEN 1 AND 12)
);

CREATE INDEX IF NOT EXISTS idx_flights_date ON flights (flight_date DESC);
CREATE INDEX IF NOT EXISTS idx_flights_airline_date ON flights (airline_id, flight_date DESC);
CREATE INDEX IF NOT EXISTS idx_flights_route_date ON flights (route_id, flight_date DESC);
CREATE INDEX IF NOT EXISTS idx_flights_number_lower ON flights (LOWER(flight_number));
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights (status);
CREATE INDEX IF NOT EXISTS idx_flights_delay ON flights (delay_minutes DESC) WHERE delay_minutes > 0;
CREATE INDEX IF NOT EXISTS idx_routes_origin ON routes (origin_airport_id);
CREATE INDEX IF NOT EXISTS idx_routes_destination ON routes (destination_airport_id);
CREATE INDEX IF NOT EXISTS idx_prediction_logs_created ON prediction_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prediction_logs_route ON prediction_logs (origin_code, destination_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_model_one_active ON model_versions (is_active) WHERE is_active;

COMMIT;

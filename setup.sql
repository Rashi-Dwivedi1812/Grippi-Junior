-- This script is for reference. We will run this logic in Python.

-- Drop the table if it already exists (makes it easy to re-run)
DROP TABLE IF EXISTS campaigns;

-- Create the campaigns table
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY, -- 'SERIAL' in Postgres, 'INTEGER PRIMARY KEY AUTOINCREMENT' in SQLite
  name VARCHAR(100) NOT NULL,
  status VARCHAR(10) NOT NULL,
  clicks INT,
  cost DECIMAL(10, 2), -- 'DECIMAL' in Postgres, 'REAL' in SQLite
  impressions INT
);

-- Insert the 10 sample rows
INSERT INTO campaigns (name, status, clicks, cost, impressions) VALUES
('Summer Sale', 'Active', 150, 45.99, 1000),
('Black Friday', 'Paused', 320, 89.50, 2500),
('New Year Promo', 'Active', 500, 120.00, 5000),
('Spring Fling', 'Active', 80, 25.00, 800),
('Cyber Monday', 'Paused', 450, 150.75, 6000),
('Back to School', 'Active', 120, 30.00, 1200),
('Holiday Special', 'Active', 280, 75.50, 3000),
('Flash Sale', 'Paused', 10, 5.00, 100),
('Winter Clearance', 'Active', 200, 60.00, 2200),
('Early Access', 'Paused', 90, 40.00, 900);
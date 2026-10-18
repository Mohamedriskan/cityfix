-- =====================================
-- CityFix Seed Data
-- =====================================

USE cityfix;

-- Default Admin User (password: CityFix123)
INSERT INTO users (name, email, password, phone, role)
VALUES (
    'Admin',
    'admin@cityfix.demo',
    '$2b$10$D.cv1kDEFC1O5qNZmdxy9.lQO0Gih9G28sGSjhdOz7nEYGiQ6wIpW',
    '0771234567',
    'Admin'
);

-- Default Officer User (password: CityFix123)
INSERT INTO users (name, email, password, phone, role)
VALUES (
    'Officer Sam',
    'officer@cityfix.demo',
    '$2b$10$D.cv1kDEFC1O5qNZmdxy9.lQO0Gih9G28sGSjhdOz7nEYGiQ6wIpW',
    '0779876543',
    'Officer'
);

-- Default Citizen User (password: CityFix123)
INSERT INTO users (name, email, password, phone, role)
VALUES (
    'Jane Citizen',
    'citizen@cityfix.demo',
    '$2b$10$D.cv1kDEFC1O5qNZmdxy9.lQO0Gih9G28sGSjhdOz7nEYGiQ6wIpW',
    '0711111111',
    'Citizen'
);

-- Departments
INSERT INTO departments (name) VALUES
('Roads & Transport'),
('Sanitation & Waste'),
('Water Supply'),
('Electricity'),
('Public Safety'),
('Parks & Recreation');

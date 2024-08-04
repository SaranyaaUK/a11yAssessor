-- Postgres Database Schema

-- Create Database
CREATE DATABASE a11yassessordb;

-- Users table
CREATE TABLE users(
    user_id uuid DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id),
    UNIQUE (email)
);

-- Sites table

CREATE TABLE sites(
    site_id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY (site_id)
);

-- Evaluators table

CREATE TABLE evaluators(
    evaluator_id uuid DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    site_id uuid NOT NULL,
    PRIMARY KEY (evaluator_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES sites(site_id) ON DELETE CASCADE
);

-- Result timestamp table

CREATE TABLE result_time (
    time_id uuid DEFAULT uuid_generate_v4(),
    site_id uuid NOT NULL,
    auto_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    manual_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (time_id),
    FOREIGN KEY (site_id) REFERENCES sites(site_id) ON DELETE CASCADE,
    UNIQUE (site_id)
);

-- Automated results table

CREATE TABLE automated_results (
    automated_result_id uuid DEFAULT uuid_generate_v4(),
    result jsonb NOT NULL,
    evaluator_id uuid NOT NULL,
    PRIMARY KEY (automated_result_id),
    FOREIGN KEY (evaluator_id) REFERENCES evaluators(evaluator_id) ON DELETE CASCADE,
    UNIQUE (evaluator_id)
);
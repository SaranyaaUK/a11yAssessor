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
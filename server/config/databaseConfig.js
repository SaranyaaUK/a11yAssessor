/**
 * 
 *  databaseConfig.js
 *  
 *  Postgres Database configuration
 * 
 */

import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const Pool = pg.Pool;

const isProduction = process.env.NODE_ENV === "production";

// Postgres url - local
let connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
// If production environment use the hosted database
connectionString = isProduction ? process.env.DATABASE_URL : connectionString;

// Create a postgres pool 
const pool = new Pool({
    connectionString: connectionString
});

export default pool;




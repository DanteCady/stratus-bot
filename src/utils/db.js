import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Ensure environment variables exist
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error("❌ Missing database environment variables! Please check your .env.local file.");
}

// Create MySQL Connection Pool
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // Limits max simultaneous connections
    queueLimit: 0
});

// Log errors to a file for better tracking
const logErrorToFile = (error, query = '', values = []) => {
    const logPath = path.join(process.cwd(), 'logs', 'db_errors.log');
    const logMessage = `[${new Date().toISOString()}] ERROR: ${error.message} | Code: ${error.code || 'N/A'} | Query: ${query} | Params: ${JSON.stringify(values)}\nStack Trace:\n${error.stack}\n\n`;
    
    fs.appendFile(logPath, logMessage, (err) => {
        if (err) console.error("❌ Failed to write to log file:", err);
    });
};

// Query Database with Enhanced Error Logging & Proper Connection Release
export async function queryDatabase(query, values = []) {
    let connection;
    try {
        connection = await pool.getConnection();  // Get connection from pool
        const [results] = await connection.execute(query, values);
        return results;
    } catch (error) {
        console.error("❌ Database Query Error:", {
            message: error.message,
            code: error.code || 'N/A',
            query,
            params: values
        });

        logErrorToFile(error, query, values);

        throw new Error('❌ Database query execution failed. Check logs for details.');
    } finally {
        if (connection) connection.release();  // Ensure connection is always released
    }
}

// Handle Unexpected Connection Errors (e.g., MySQL server restarts)
pool.on('error', (err) => {
    console.error("❌ Database Pool Error:", err);
    logErrorToFile(err);
});

// Gracefully Close Connections on App Termination
process.on('SIGINT', async () => {
    console.log('🔄 Closing database connections...');
    await pool.end();
    process.exit(0);
});

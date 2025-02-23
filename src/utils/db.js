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
    connectionLimit: 10,
    queueLimit: 0
});

// Log errors to a file for better tracking
const logErrorToFile = (error) => {
    const logPath = path.join(process.cwd(), 'logs', 'db_errors.log');
    const logMessage = `[${new Date().toISOString()}] ${error}\n`;
    
    fs.appendFile(logPath, logMessage, (err) => {
        if (err) console.error("❌ Failed to write to log file:", err);
    });
};

// Query Database with Enhanced Error Logging
export async function queryDatabase(query, values = []) {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();
        return results;
    } catch (error) {
        console.error("❌ Database Query Error:", {
            message: error.message,
            code: error.code || 'N/A',
            query: query,
            params: values
        });

        logErrorToFile(`[ERROR] ${error.message} | Query: ${query} | Params: ${JSON.stringify(values)}`);

        throw new Error('❌ Database query execution failed. Check logs for details.');
    }
}

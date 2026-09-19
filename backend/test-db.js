const pool = require('./db/database');

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');

        console.log('Conexión exitosa con PostgreSQL');
        console.log(result.rows);
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error);
    } finally {
        await pool.end();
    }
}

testConnection();
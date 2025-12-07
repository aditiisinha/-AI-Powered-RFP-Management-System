const fs = require('fs');
const path = require('path');
const pool = require('./connection');

async function initDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('Database schema initialized successfully!');
    
    // Optionally seed some test data
    console.log('Database ready!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;


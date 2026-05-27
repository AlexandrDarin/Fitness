const { Pool } = require('pg');

const pool = new Pool({
  // Указали верный порт 5433!
  connectionString: 'postgres://fitness_user:fitness_password@127.0.0.1:5433/fitness_db'
});

module.exports = pool;

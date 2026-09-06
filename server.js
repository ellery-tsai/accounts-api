const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 8080;

const pool = new Pool({
  host: process.env.DB_HOSTNAME || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'accounts',
  password: process.env.DB_PASSWORD || 'accounts',
  database: process.env.DB_NAME || 'accounts',
});

app.get('/accounts', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, balance FROM accounts ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to query accounts:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

async function start() {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.error('Startup DB connectivity check failed:', err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`accounts-api listening on port ${port}`);
  });
}

start();

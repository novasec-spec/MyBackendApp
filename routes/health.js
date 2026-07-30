const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { AppResponse } = require('../utils/response');
const os = require('os');

router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'disconnected',
      memory: 'unknown'
    },
    system: {
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        usage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%'
      },
      cpu: os.cpus().length,
      load: os.loadavg()
    }
  };

  try {
    await pool.query('SELECT 1');
    health.services.database = 'connected';
  } catch (error) {
    health.status = 'unhealthy';
    health.services.database = 'disconnected';
    health.error = error.message;
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  return AppResponse.success(res, 'Health check', health, statusCode);
});

router.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return AppResponse.success(res, 'Ready');
  } catch (error) {
    return AppResponse.error(res, 'Not ready', 503);
  }
});

router.get('/live', (req, res) => {
  return AppResponse.success(res, 'Alive');
});

module.exports = router;

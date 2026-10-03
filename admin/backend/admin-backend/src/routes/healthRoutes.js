import express from 'express';
import mongoose from 'mongoose';
import { isDatabaseConnected } from '../config/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbConnected = isDatabaseConnected();
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    status: dbConnected ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
    },
  });
});

router.get('/database', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const isHealthy = state === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'HEALTHY' : 'UNHEALTHY',
    connectionState: states[state] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  });
});

export default router;

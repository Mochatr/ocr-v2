import express from 'express';
import { performHealthCheck } from '../utils/dbHealthCheck.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const health = await performHealthCheck();
  
  res.status(health.healthy ? 200 : 503).json(health);
});

export default router;
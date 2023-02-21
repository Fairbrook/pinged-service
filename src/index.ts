import express from 'express';
import { HealthcheckerSimpleCheck } from 'nodejs-health-checker/dist/healthchecker/healthchecker.js';
import { cronCheck, healthCheck } from './check.js';
import cron from 'node-cron';

const server = express();

server.get('/health-check/liveness', (_, res) => {
  res.send(HealthcheckerSimpleCheck());
});

server.get('/health-check/readiness', async (_, res) => {
  res.send(await healthCheck());
});

cron.schedule('0 * * * *', cronCheck);
server.listen('3000');
console.log('Server listening');

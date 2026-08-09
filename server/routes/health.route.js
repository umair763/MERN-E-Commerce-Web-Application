const r = require('express').Router();
r.get('/', (req, res) =>
  res.json({
    success: true,
    status: 'ok',
    service: 'stylehive-api',
    timestamp: new Date().toISOString(),
  }),
);
module.exports = r;

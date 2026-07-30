const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const { specs } = require('../config/swagger');

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MyApp API Documentation'
}));

router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

module.exports = router;

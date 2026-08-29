const express = require('express');
const path = require('path');
const { calculateTax, effectiveTaxRate, TAX_BRACKETS } = require('./src/taxCalculator');

const app = express();

// PORT must come from the environment for Docker / IBM Cloud Code Engine
// compatibility, defaulting to 8080 for local runs.
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint - useful for Docker HEALTHCHECK and Code Engine probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'tax-calculator' });
});

// Returns the bracket configuration so the frontend can display it
app.get('/api/brackets', (req, res) => {
  res.status(200).json({ brackets: TAX_BRACKETS });
});

// Core calculation endpoint
app.post('/api/calculate', (req, res) => {
  const { income } = req.body;
  const numericIncome = Number(income);

  try {
    const tax = calculateTax(numericIncome);
    const rate = effectiveTaxRate(numericIncome);
    res.status(200).json({
      income: numericIncome,
      tax,
      effectiveRate: rate,
      netIncome: Math.round((numericIncome - tax) * 100) / 100,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Only start listening if this file is run directly (not when required by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Tax Calculator app listening on port ${PORT}`);
  });
}

module.exports = app;

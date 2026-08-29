document.getElementById('tax-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const incomeInput = document.getElementById('income');
  const resultSection = document.getElementById('result');
  const errorSection = document.getElementById('error');

  resultSection.classList.add('hidden');
  errorSection.classList.add('hidden');

  const income = Number(incomeInput.value);

  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ income }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    document.getElementById('result-income').textContent = data.income.toFixed(2);
    document.getElementById('result-tax').textContent = data.tax.toFixed(2);
    document.getElementById('result-rate').textContent = (data.effectiveRate * 100).toFixed(2);
    document.getElementById('result-net').textContent = data.netIncome.toFixed(2);

    resultSection.classList.remove('hidden');
  } catch (err) {
    errorSection.textContent = err.message;
    errorSection.classList.remove('hidden');
  }
});

// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const {
  updateWindow,
  getWindow,
  getAverage
} = require('./windowStore');

const app = express();
const PORT = 9876;
app.use(cors());

const API_URLS = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand'
};

app.get('/numbers/:id', async (req, res) => {
  const id = req.params.id;
  const url = API_URLS[id];

  if (!url) {
    return res.status(400).json({ error: 'Invalid number type' });
  }

  const prevState = getWindow();

  try {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel();
    }, 500);

    const response = await axios.get(url, {
      timeout: 500,
      cancelToken: source.token
    });
    clearTimeout(timeout);

    const newNumbers = response.data.numbers || response.data.number || [];
    const updatedWindow = updateWindow(newNumbers);

    return res.json({
      windowPrevState: prevState,
      windowCurrState: updatedWindow,
      numbers: updatedWindow,
      avg: getAverage()
    });

  } catch (err) {
    // On error or timeout, return the previous state
    return res.json({
      windowPrevState: prevState,
      windowCurrState: getWindow(),
      numbers: getWindow(),
      avg: getAverage()
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

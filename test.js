const express = require('express');
const app = express();
const PORT = 9876;

app.get('/', (req, res) => {
  res.send('Minimal test server is running!');
});

app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});

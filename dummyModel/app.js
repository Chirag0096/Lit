const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/api/', (req, res) => {
  res.json("Healthy")
})

app.post('/api/message', (req, res) => {
  const { message } = req.body;

  if (message) {
    res.json({ response: "The model is working." });
  } else {
    res.status(400).json({ error: "No message provided." });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

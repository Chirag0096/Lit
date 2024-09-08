const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/api/', (req, res) => {
  res.json("Healthy")
})

app.post('/api/message', (req, res) => {
  const { imageData } = req.body;
  
  if (imageData) {
    console.log("Returning response");
    
    return res.status(200).json({ response: "The model is working." });
  } else {
    return res.status(400).json({ error: "No message provided." });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

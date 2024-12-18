
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('webroot'));
app.use(express.json());

app.post('/save-data', (req, res) => {
  const data = { countries: req.body.countries };
  fs.writeFileSync(path.join(__dirname, 'webroot/data.json'), JSON.stringify(data, null, 2));
  res.send({ success: true });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});

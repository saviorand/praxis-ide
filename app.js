const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import CORS module

const app = express();
const port = 8080;

// Enable CORS for all responses
app.use(cors());

// Serve your HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to check for the file and read its contents
app.get('/read-file', (req, res) => {
  const filePath = path.join(__dirname, '../../.vscode/praxis/tmp.pl');

  fs.exists(filePath, (exists) => {
    if (exists) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send('Error reading the file');
        } else {
          res.send(data);
        }
      });
    } else {
      res.status(404).send('File not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

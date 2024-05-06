const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import CORS module

const app = express();
const port = 8080;

app.use(cors({
  origin: "*", // Adjust accordingly for production
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

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

app.post('/write-file', (req, res) => {
  console.log('Received request to write file');
  // res.setHeader("Access-Control-Allow-Origin", "*"); // Allow any domain
  // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  console.log(req.body); 
  const content = req.body.content;
  const filePath = path.join(__dirname, '../../.vscode/praxis/tmp.pl');

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Failed to write file:', err);
      res.status(500).send('Failed to write file');
    } else {
      console.log('File written successfully');
      res.send('File written successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './'); // Save files to the root of the project directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

// Route for listing files
app.get('/files', (req, res) => {
  fs.readdir('./', (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files');
    }
    res.json(files);
  });
});

// Route for downloading a file
app.get('/download/:filename', (req, res) => {
  const file = path.join(__dirname, req.params.filename);
  res.download(file);
});

// Route for deleting a file
app.delete('/delete/:filename', (req, res) => {
  const file = path.join(__dirname, req.params.filename);
  fs.unlink(file, (err) => {
    if (err) {
      return res.status(500).send('File not found');
    }
    res.send('File deleted successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

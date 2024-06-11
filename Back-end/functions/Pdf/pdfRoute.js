const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');

const upload = multer({ dest: 'uploads/' });

router.post('/convert-pdf', upload.single('file'), (req, res) => {
    const filePath = req.file.path; // Full path of the uploaded file on the server
    exec(`python "c:\\Users\\victor.yanez\\Projects\\OCR\\main.py"  convert_pdf "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send({ message: `Error executing Python script: ${error}` });
        }
        res.send({ message: 'Script executed successfully', output: stdout });
    });
});

router.post('/split-pdf', upload.single('file'), (req, res) => {
    const filePath = req.file.path; // Full path of the uploaded file on the server
    exec(`python "c:\\Users\\victor.yanez\\Projects\\OCR\\main.py"  split_pdf "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send({ message: `Error executing Python script: ${error}` });
        }
        res.send({ message: 'Script executed successfully', output: stdout });
    });
});
module.exports = router;
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'minutes.json');

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the root directory so the HTML/CSS/JS works
app.use(express.static(__dirname));

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    if (!fs.existsSync(path.join(__dirname, 'data'))) {
        fs.mkdirSync(path.join(__dirname, 'data'));
    }
    fs.writeFileSync(DATA_FILE, '[]');
}

// Helper to read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
};

// API: Get all minutes
app.get('/api/minutes', (req, res) => {
    const minutes = readData();
    res.json(minutes);
});

// API: Save new meeting minutes
app.post('/api/minutes', (req, res) => {
    const newMinute = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...req.body
    };

    const minutes = readData();
    minutes.push(newMinute);
    
    if (writeData(minutes)) {
        res.status(201).json({ message: 'Minutes saved successfully', data: newMinute });
    } else {
        res.status(500).json({ message: 'Failed to save minutes' });
    }
});

// Fallback to index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/minutes`);
});

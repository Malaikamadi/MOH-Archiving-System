const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'minutes.json');
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the root directory so the HTML/CSS/JS works
app.use(express.static(__dirname));

// Ensure data files exist
const ensureFiles = () => {
    if (!fs.existsSync(path.join(__dirname, 'data'))) {
        fs.mkdirSync(path.join(__dirname, 'data'));
    }
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
    if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, '[]');
};
ensureFiles();

// Helper to read data
const readData = (file) => {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return [];
    }
};

// Helper to write data
const writeData = (file, data) => {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${file}:`, error);
        return false;
    }
};

// API: Get all minutes
app.get('/api/minutes', (req, res) => {
    const minutes = readData(DATA_FILE);
    res.json(minutes);
});

// API: Save new meeting minutes
app.post('/api/minutes', (req, res) => {
    const newMinute = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...req.body
    };

    const minutes = readData(DATA_FILE);
    minutes.push(newMinute);
    
    if (writeData(DATA_FILE, minutes)) {
        res.status(201).json({ message: 'Minutes saved successfully', data: newMinute });
    } else {
        res.status(500).json({ message: 'Failed to save minutes' });
    }
});

// API: Get all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readData(TASKS_FILE);
    res.json(tasks);
});

// API: Save new task or update existing
app.post('/api/tasks', (req, res) => {
    const tasks = readData(TASKS_FILE);
    
    if (req.body.id) {
        // Update existing
        const idx = tasks.findIndex(t => t.id === req.body.id);
        if (idx !== -1) {
            tasks[idx] = { ...tasks[idx], ...req.body, updatedAt: new Date().toISOString() };
        } else {
            return res.status(404).json({ message: 'Task not found' });
        }
    } else {
        // Create new
        const newTask = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...req.body
        };
        tasks.push(newTask);
    }
    
    if (writeData(TASKS_FILE, tasks)) {
        res.status(201).json({ message: 'Task saved successfully' });
    } else {
        res.status(500).json({ message: 'Failed to save task' });
    }
});

const MEETINGS_FILE = path.join(__dirname, 'data', 'meetings.json');

// Ensure meetings.json exists
if (!fs.existsSync(MEETINGS_FILE)) fs.writeFileSync(MEETINGS_FILE, '[]');

// API: Get all scheduled meetings
app.get('/api/meetings', (req, res) => {
    const meetings = readData(MEETINGS_FILE);
    res.json(meetings);
});

// API: Save new scheduled meeting
app.post('/api/meetings', (req, res) => {
    const meetings = readData(MEETINGS_FILE);
    const newMeeting = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...req.body
    };
    meetings.push(newMeeting);
    
    if (writeData(MEETINGS_FILE, meetings)) {
        res.status(201).json({ message: 'Meeting scheduled successfully', data: newMeeting });
    } else {
        res.status(500).json({ message: 'Failed to schedule meeting' });
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

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function load() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', 'hugot.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading hugot.json:', error);
        return [];
    }
}

function random() {
    const hugot = load();
    return hugot[Math.floor(Math.random() * hugot.length)];
}

app.get('/api/hugot', (req, res) => {
    const hugot = load();
    if (!hugot.length) {
        return res.status(500).json({
            success: false,
            message: 'Server error. Parang love life, complicated.'
        });
    }

    res.json({
        success: true,
        hugot: random()
    });
});

app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found. Parang yung forever mo - nonexistent.'
    });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

process.on('uncaughtException', error => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


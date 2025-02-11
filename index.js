const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const hugot = JSON.parse(fs.readFileSync('./data/hugot.json', 'utf8'));

function random() {
    return hugot[Math.floor(Math.random() * hugot.length)]
}

app.get('/api/hugot', (req, res) => {
    try {
        if (!hugot.length) {
            throw new Error('No hugot lines available')
        }

        res.json({
            success: true,
            hugot: random()
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Parang love life, complicated.'
        })
    }
})

app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found. Parang yung forever mo - nonexistent.'
    })
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'))
})

process.on('uncaughtException', error => {
    console.error(`Fatal error: ${error.message}`)
    process.exit(1)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

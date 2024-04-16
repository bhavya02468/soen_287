const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// Home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Additional Routes
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/find-pet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'find-pet.html'));
});

app.get('/giveaway', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'giveaway.html'));
});

app.get('/dog-care', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dog-care.html'));
});

app.get('/cat-care', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cat-care.html'));
});

// Listen on provided port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

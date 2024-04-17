const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));  // This parses incoming requests with URL-encoded payloads

app.set('view engine', 'ejs');

// Define a directory where your templates are located. It defaults to '/views'
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); 
// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// Home page route
app.get('/', (req, res) => {
    res.render('index');
});

// Additional Routes
app.get('/home', (req, res) => {


});

app.get('/contact', (req, res) => {
    res.render('contact');

});

app.get('/find-pet', (req, res) => {
    res.render('find-pet');
});

app.get('/giveaway', (req, res) => {
    res.render('giveaway');

});

app.get('/dog-care', (req, res) => {
    res.render('dog-care');

});

app.get('/cat-care', (req, res) => {
    res.render('cat-care');

});
app.get('/CreateAccount', (req, res) => {
    res.render('createAccount');

});
app.post('/search-pets', (req, res) => {
    console.log("Processing search request...");
    console.log("Received request data:", req.body);  // This will confirm the structure of the incoming data.

    fs.readFile(path.join(__dirname, 'pets.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read data file:', err);
            res.status(500).send("Failed to read pet data file.");
            return;
        }

        const pets = data.trim().split('\n').map(line => {
            const parts = line.split(':');
            return {
                id: parseInt(parts[0], 10),
                type: parts[1],
                breed: parts[2],
                age: parts[3],
                gender: parts[4],
                compatibility: parts[5] ? parts[5].split(',') : []
            };
        });

        // Directly use the array from req.body.compatibility
        const requestedCompatibility = req.body.compatibility || [];

        const filteredPets = pets.filter(pet => {
            return (!req.body.petType || pet.type === req.body.petType) &&
                   (!req.body.breed || pet.breed.toLowerCase().includes(req.body.breed.toLowerCase())) &&
                   (!req.body.age || pet.age === req.body.age) &&
                   (!req.body.gender || pet.gender === req.body.gender) &&
                   (requestedCompatibility.length === 0 || requestedCompatibility.some(c => pet.compatibility.includes(c)));
        });
        console.log()
        res.json(filteredPets);
    });
});

app.post('/create-account', (req, res) => {
    const { username, password } = req.body;
    const filePath = path.join(__dirname, 'login.txt');

    // Read the existing user data
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error reading user data.' });
        }

        const users = data.split('\n');
        const userExists = users.some(user => user.split(':')[0] === username);

        if (userExists) {
            res.json({ message: 'Username already exists, please choose another.' });
        } else {
            // Append new user data
            fs.appendFile(filePath, `${username}:${password}\n`, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ message: 'Error saving user data.' });
                }
                res.json({ message: 'Account successfully created! You can now login.' });
            });
        }
    });
});

app.post('/verify-login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile(path.join(__dirname, 'login.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading login data');
            return;
        }

        const users = data.split('\n');
        const userExists = users.some(user => {
            const [storedUsername, storedPassword] = user.split(':');
            return storedUsername === username && storedPassword === password;
        });

        if (userExists) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});
app.post('/submit-pet', (req, res) => {
    fs.readFile(path.join(__dirname, 'pets.txt'), 'utf8', (readErr, data) => {
        if (readErr) {
            console.error(readErr);
            return res.status(500).send({ error: 'Failed to read pet data file.' });
        }

        // Determine the new ID by finding the highest current ID and adding 1
        const lines = data.trim().split('\n');
        const lastId = lines.reduce((maxId, line) => {
            const currentId = parseInt(line.split(':')[0], 10);
            return currentId > maxId ? currentId : maxId;
        }, 0);

        const newId = lastId + 1;
        const { username, petType, breed, age, gender, compatibility } = req.body;
        const compatibilityString = compatibility && compatibility.length > 0 ? compatibility.join(',') : '';
        const newEntry = `${newId}:${username}:${petType}:${breed}:${age}:${gender}:${compatibilityString}\n`;

        // Append the new entry to the file
        fs.appendFile(path.join(__dirname, 'pets.txt'), newEntry, (appendErr) => {
            if (appendErr) {
                console.error(appendErr);
                return res.status(500).json({ error: 'Error saving pet data' });
            }
            res.json({ message: 'Pet data saved successfully!', id: newId });
        });
    });
});
// Listen on provided port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

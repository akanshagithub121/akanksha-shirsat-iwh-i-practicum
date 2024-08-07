const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects/flowers?properties=color,description,name';

// Fetch and render custom objects
app.get('/', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(HUBSPOT_API_URL, { headers });
        const data = response.data.results; // Adjust based on API response structure
        res.render('homepage', { title: 'Homepage | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error('Error fetching custom objects:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching custom objects');
    }
});

// Render form to create or update custom objects
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Handle form submission to create or update custom objects
app.post('/update-cobj', async (req, res) => {
    const newCustomObject = {
        properties: {
            color: req.body.color,
            description: req.body.description,
            name: req.body.name         
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(HUBSPOT_API_URL, newCustomObject, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating/updating custom object:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating/updating custom object');
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
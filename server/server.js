const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5001;
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Recipe App!');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

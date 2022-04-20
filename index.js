require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth.js');

// MIDDLEWARE
app.use(express.json());
app.use('cors');
app.use('/auth', authRoutes);

//one main get from api
app.get('/', (req, res) => {
	res.send('I see API');
});

//DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECTION, () => {
	console.log('Database connected');
});
//TODO: make file config.env and set variable for process.env.PORT
//LISTENING
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});

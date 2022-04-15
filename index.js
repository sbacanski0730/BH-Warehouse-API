const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MIDDLEWARE

//DATABASE CONNECTION

//TODO: make file config.env and set variable for process.env.PORT
//LISTENING
app.listen(5002, () => {
	console.log('Server is running at port 5002');
});

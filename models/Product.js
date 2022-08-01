const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
	name: String,
	addedDate: { type: Date, default: Date.now },
	expirationDate: String,
	type: String,
	description: String,
	photoLink: String,
});

module.exports = mongoose.model('Product', ProductSchema);

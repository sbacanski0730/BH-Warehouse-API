const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const Product = require('./Product.js');
const ProductSchema = require('./Product.js');

//TODO: still more complex validation for data to schema
const UserSchema = mongoose.Schema({
	email: {
		type: String,
		require: true,
		max: 128,
	},
	name: {
		type: String,
		require: true,
		max: 128,
	},
	password: {
		type: String,
		require: true,
		min: 5,
	},
	userProducts: { type: [] },
});

UserSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.passwordVerify = async function (req_password) {
	let isPasswordMatch = await bcrypt.compare(req_password, this.password);
	return isPasswordMatch;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

const validation = require('../middleware/validationMiddleware.js');
const {
	userRegisterSchema: userRegisterSchemaValidation,
	userLoginSchema: userLoginSchemaValidation,
} = require('../schemas/authSchemas.js');

const resStandard = require('../controller/resStandard.js');
const ordersSeparator = require('../controller/ordersSeparator.js');

router.post('/register', validation(userRegisterSchemaValidation), async (req, res) => {
	ordersSeparator();
	console.log('Server got order - REGISTER');

	let req_name = req.body.name;
	let req_email = req.body.email;
	let req_password = req.body.password;

	try {
		let user = await User.findOne({ email: req_email });
		if (user) {
			throw 'User with that email exist';
		}

		let newUser = new User({
			name: req_name,
			email: req_email,
			password: req_password,
		});

		newUser.save();
		console.log('User created: ', newUser);
		res.json(resStandard(true, 'User created', newUser));
	} catch (err) {
		console.log('Caught error: ', err);
		res.json(resStandard(false, err));
	}
});

router.post('/login', validation(userLoginSchemaValidation), async (req, res) => {
	ordersSeparator();
	console.log('Server got order - LOGIN');

	let req_email = req.body.email;
	let req_password = req.body.password;

	try {
		let user = await User.findOne({ email: req_email });
		console.log(user);

		if (!user) {
			throw "User doesn't exist";
		}

		if (!(await user.passwordVerify(req_password))) {
			throw 'Wrong Password';
		}

		let token = jwt.sign(user._id.valueOf(), process.env.TOKEN_SECRET);

		res.header('token', token);
		res.status(200).json(resStandard(true, 'Login successful'));
	} catch (err) {
		console.log(err);
		res.json(resStandard(false, err));
	}
});

module.exports = router;

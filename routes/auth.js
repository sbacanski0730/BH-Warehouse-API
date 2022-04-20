const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

const validation = require('../middleware/validationMiddleware.js');
const { userRegisterSchema, userLoginSchema } = require('../schemas/authSchemas.js');

const resStandard = require('../controller/resStandard.js');
const ordersSeparator = require('../controller/ordersSeparator.js');

router.post('/register', validation(userRegisterSchema), async (req, res) => {
	ordersSeparator();
	console.log('Server got order - REGISTER');
	var req_name = req.body.name;
	var req_email = req.body.email;
	var req_password = req.body.password;

	try {
		var user = await User.findOne({ email: req_email });
		if (user) {
			throw 'User with that email exist';
		}
		var newUser = new User({
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

router.post('/login', validation(userLoginSchema), async (req, res) => {
	ordersSeparator();
	console.log('Server got order - Login');

	var req_email = req.body.email;
	var req_password = req.body.password;

	try {
		var user = await User.findOne({ email: req_email });
		console.log(user);
		if (!user) {
			throw "User doesn't exist";
		}

		if (!(await user.passwordVerify(req_password))) {
			throw 'Wrong Password';
		}

		var token = jwt.sign(user._id.valueOf(), process.env.TOKEN_SECRET);

		res.header('token', token);
		res.status(200).json(resStandard(true, 'Login successful'));
	} catch (err) {
		console.log(err);
		res.json(resStandard(false, err));
	}
});

module.exports = router;

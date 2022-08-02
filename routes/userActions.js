const router = require('express').Router();
const orderSeparator = require('../controller/ordersSeparator.js');
const resStandard = require('../controller/resStandard.js');
const validation = require('../middleware/validationMiddleware.js');
const userAddProductSchemaValidation = require('../schemas/addProductSchemas.js');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Product = require('../models/Product.js');

// TODO: czy mozna przechowywac zdjecia w bd MongoDB?

router.post('/add', validation(userAddProductSchemaValidation), async (req, res) => {
	orderSeparator();
	console.log('Server got order - ADD NEW PRODUCT');

	try {
		let token = req.headers.token;
		const decodedUserID = jwt.verify(
			token,
			process.env.TOKEN_SECRET,
			(err, decode) => {
				if (err) {
					throw err.message;
				}
				return decode;
			}
		);

		const userFromToken = await User.findById(decodedUserID);

		if (!userFromToken) {
			throw "User doesn't exist";
		}

		let req_name = req.body.name;
		let req_expirationDate = new Date(req.body.expirationDate);
		let req_type = req.body.type;
		let req_description = req.body.description;
		let req_photoLink = req.body.photoLink;

		const newProduct = new Product({
			name: req_name,
			expirationDate: req_expirationDate,
			type: req_type,
			description: req_description,
			photoLink: req_photoLink,
		});

		console.log(newProduct);

		userFromToken.userProducts.push(newProduct);
		await userFromToken.save();

		res.json(resStandard(true, 'Product Added', newProduct));
	} catch (error) {
		res.json(resStandard(false, error));
	}
});

router.get('/user-products', async (req, res) => {
	orderSeparator();
	console.log("Server got order - GET USER'S PRODUCTS");
	try {
		let req_token = req.headers.token;

		const decode = jwt.verify(req_token, process.env.TOKEN_SECRET, (err, decode) => {
			if (err) {
				return res.json(resStandard(false, err.message));
			}
			return decode;
		});

		const userFromToken = await User.findById(decode);

		if (!userFromToken) {
			throw "User with that id doesn't exist";
		}

		res.json(
			resStandard(true, 'User Products in content', userFromToken.userProducts)
		);
	} catch (err) {
		res.json(resStandard(false, err.message));
	}
});

router.post('/post-product-delete', async (req, res) => {
	orderSeparator();
	console.log('Server got order - ADD NEW PRODUCT');

	try {
		let req_productId = req.body.productId,
			req_token = req.headers.token;

		const decode = jwt.verify(req_token, process.env.TOKEN_SECRET, (err, decode) => {
			if (err) {
				throw err;
			}
			return decode;
		});

		let userFromToken = await User.findById(decode);

		const productToRemove = userFromToken.userProducts.filter(
			product => product._id.toString() === req_productId
		);

		console.log('productToRemove', productToRemove);

		if (productToRemove.length === 0) {
			throw "Product doesn't exist";
		}

		userFromToken.userProducts = userFromToken.userProducts.filter(
			product => product._id.toString() !== req_productId
		);

		await userFromToken.save();

		res.json(resStandard(true, 'Product deleted'));
	} catch (err) {
		res.json(resStandard(false, err));
	}
});

module.exports = router;

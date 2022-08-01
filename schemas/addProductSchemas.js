const yup = require('yup');

const userAddProductSchemaValidation = yup.object({
	name: yup //
		.string()
		.required('Product has to have the name')
		.min(5),
	expirationDate: yup //
		.string()
		.required('Nothing is infinite - give the expiration date'),
	type: yup //
		.string(),
	description: yup //
		.string()
		// .max(200, 'Description is too long - max 100 characters'),
		.max(200),
	photoLink: yup //
		.string(),
});

module.exports = userAddProductSchemaValidation;

// module.exports.addProductValidation = userAddProductSchemaValidation;

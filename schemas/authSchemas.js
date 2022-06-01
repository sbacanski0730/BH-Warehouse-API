const yup = require('yup');

const userRegisterSchemaValidation = yup.object({
	name: yup //
		.string()
		.min(5, 'Name must be longer than 5 characters')
		.required(),
	email: yup //
		.string()
		.email('Enter a valid email')
		.required('Email is needed'),
	password: yup //
		.string()
		.min(5, 'Password must be longer than 5 characters')
		.max(120, 'Password is too long')
		.required('Password is necessary'),
});

module.exports.userRegisterSchema = userRegisterSchemaValidation;

const userLoginSchemaValidation = yup.object({
	email: yup //
		.string()
		.required('Email is necessary'),
	password: yup //
		.string()
		.required('Password is necessary'),
});

module.exports.userLoginSchema = userLoginSchemaValidation;

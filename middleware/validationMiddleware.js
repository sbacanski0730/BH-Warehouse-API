const resStandard = require('../controller/resStandard.js');

const validation = schema => async (req, res, next) => {
	const body = req.body;
	try {
		await schema.validate(body);
		next();
	} catch (err) {
		return res.json(resStandard(false, err.errors[0]));
	}
};

module.exports = validation;

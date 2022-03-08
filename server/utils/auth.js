'use strict'

const { verify, sign } = require("jsonwebtoken");

/**
 * [START GET TOKEN]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 */
const getAuthToken = (req, res, next) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		req.authToken = req.headers.authorization.split(' ')[1];
	} else {
		req.authToken = null;
	}
	next();
};
// [END GET TOKEN]

/**
 * [START CHECK AUTH]
 * @param {object} req Express request context.
 * @param {object} res Express response context.
 * @param {object} next Express next context.
 * Define auth middleware.
 */
const authenticate = (req, res, next) => {
	getAuthToken(req, res, async () => {
		try {
			// 
			const { authToken } = req;
			req.payload = verify(authToken, `${process.env.ACCESS_TOKEN_SECRET}`);
			return next();
		} catch (error) {
			return res.status(401).json("Unauthorized");
		}
	});
}
// [END CHECK AUTH]

const generateAccessToken = (privateKey) => {
  return sign({privateKey}, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: '15m',
  });
}

const generateRefreshToken = (privateKey) => {
  return sign({privateKey}, `${process.env.REFRESH_TOKEN_SECRET}`);
}

module.exports = {
	authenticate,
	generateAccessToken,
	generateRefreshToken,
};
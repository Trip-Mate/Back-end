require('dotenv').config({ path: './config/config.env' });

module.exports = {
	port: process.env.PORT || 5000,
	isProduction: process.env.NODE_ENV === 'production',
	token_exp: process.env.TOKEN_EXP,
	secret:
		process.env.NODE_ENV === 'production'
			? process.env.JWT_SECRET
			: 'my-secret',
	mongodbUri: process.env.MONGODB_URI,
	env: process.env.NODE_ENV,
	clientURL:
		process.env.NODE_ENV === 'production'
			? process.env.CLIENT_URL_PROD
			: process.env.CLIENT_URL_DEV,
	fixerKey: process.env.FIXER_ACCESS_KEY,
	mailgun: {
		apiKey: process.env.MAILGUN_API_KEY,
		testDomain: process.env.TEST_DOMAIN,
		fromEmail: process.env.FROM_EMAIL,
	},
	unsplash: {
		accessKey: process.env.UNSPLASH_ACCESS_KEY,
		secretKey: process.env.UNSPLASH_SECRET_KEY,
	},
};
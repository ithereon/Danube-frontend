/* eslint-disable no-undef */
/**
* @type {import('next').NextConfig}
*/
const securityHeaders = [
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block'
	}
];

const nextConfig = {
	reactStrictMode: false,
	swcMinify: false,
	headers: securityHeaders,
	env: {
		REACT_APP_BASE_URL: 'https://live-production-backend.herokuapp.com',
		// REACT_APP_BASE_URL: 'http://127.0.0.1:8000',
		NEXTAUTH_URL: 'http://127.0.0.1:3000',
		SECRET_TOKEN: 'hello',
		SECRET_PHRASE: 'secretPassphrase',
		CURRENT_ENV: 'development',
		RECAPTCHA_SITE_KEY: '6Ld-_8kiAAAAAH5H1KR9BATEm8dN5v6Mdhdg6LIo'
	},
};

export default nextConfig;
import  { NextResponse } from 'next/server';

export function middleware(req) {
	// eslint-disable-next-line no-undef
	const currentEnv = process.env.CURRENT_ENV;
	if (currentEnv === 'production' && req.headers.get('x-forwarded-proto') !== 'https') {
		return NextResponse.redirect(
			`https://${req.headers.get('host')}${req.nextUrl.pathname}`,
			301
		);
	}
	return NextResponse.next();
}
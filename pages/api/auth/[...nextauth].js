/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { requestWithTokenAsync } from '../../../lib/axios';

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Login',
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'Email'
				},
				password: {
					label: 'Password',
					type: 'password',
					placeholder: 'Password'
				}
			},
         
			authorize: async (credentials, req) => {
				try {
					let me;
					const url = `${process.env.REACT_APP_BASE_URL}/accounts/login/`;
					const user = await axios.post(url, {
						password: credentials.password,
						email: credentials.email
					});
					if(user.data.access){
						try {
							const minutesToAdd=15;
							const currentDate = new Date();
							const expireDate = new Date(currentDate.getTime() + minutesToAdd*60000);
							const res = await requestWithTokenAsync(
								'get',
								`/accounts/${user.data.user.id}/`,
								user.data.access
							);
							me = {
								token: {
									access: user.data.access,
									refresh: user.data.refresh,
									accessTokenExpires: expireDate,
								},
								data: {
									...user.data.user,
									title: res?.data?.title ? res.data.title : '',
									mobile: res?.data?.mobile ? res.data.mobile : '',
								}
							};
						} catch (error) {
							console.log(error);
						}
						return me;
					}
					return null;

				} catch (e) {
					throw new Error(e);
				}
			},
            
		}),
	],
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				return {
					user: {
						...user,
						token: {
							...user.token,
							access: user.token.access,
							accessTokenExpires: user.token.accessTokenExpires,
							refresh: user.token.refresh,
						}
					}
				};
			}
	
			// Return previous token if the access token has not expired yet
			if (Date.now() < token.user.token.accessTokenExpires) {
				return token;
			}
	
			// Access token has expired, try to update it
			return refreshAccessToken(token);
		},
		async session({ session, token }) {
			session.user = token.user;
			session.access = token.user.token.access;
			session.refresh = token.user.token.refresh;
			session.expires = token.user.token.accessTokenExpires,
			session.error = token.error;

			return session;
		},
	},
	pages: {
		signIn: '/auth/login',
	},
	session: {
		maxAge: 60 * 60 * 24 * 30, // 30 days
		// updateAge: 15 * 60, // 15 minutes
	},
	secret: process.env.SECRET_TOKEN,
	// Enable debug messages in the console if you are having problems
	debug: process.env.NODE_ENV === 'development',
});


async function refreshAccessToken(token) {
	try {
		const url = process.env.REACT_APP_BASE_URL + '/accounts/token/refresh/';
		const response = await axios.post(url, {
			refresh: token.user.token.refresh
		});

		if (response.statusText !== 'OK') {
			throw response;
		}
		const minutesToAdd=15;
		const currentDate = new Date();
		const expireDate = new Date(currentDate.getTime() + minutesToAdd*60000);
		return {
			user: {
				...token.user,
				token: {
					...token.user.token,
					access: response.data.access ?? token.user.token.access,
					accessTokenExpires: expireDate,
					refresh: response.data.refresh ?? token.user.token.refresh, // Fall back to old refresh token
				}
			},
			error: ''
		};
	} catch (error) {
		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
}
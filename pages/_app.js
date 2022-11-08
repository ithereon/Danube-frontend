import '../styles/globals.css';
import '@fortawesome/fontawesome-free/js/all.js';
import '@fortawesome/fontawesome-free/css/svg-with-js.css';
import Head from 'next/head';
import {Provider} from 'react-redux';
import store from '../lib/store';
import { SessionProvider, useSession } from 'next-auth/react';
import Loading from '../components/UI/loading';
import { useRouter } from 'next/router';
import Home from './index';


function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}) {

	return (
		<Provider store={store}>
			<SessionProvider session={session}>
			
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				</Head>
				{Component.auth ? (
					<Auth Component={Component} pageProps={pageProps} />
				) : (
					<UserLayer Component={Component} {...pageProps} />
				)}
					
			</SessionProvider>
		</Provider>
	);
}

export default MyApp;

const UserLayer = ({ Component, pageProps }) => {
	const { data: token, status } = useSession();
	const Layout = Component.layout || (({ children }) => <>{children}</>);
	
	if (status === 'loading') {
		return <Loading />;
	}
	return (
		<Layout userData={token?.user?.data} token={token?.access}>
			<Component
				status={status}
				userData={token?.user?.data}
				role={token?.user?.data?.user_type?.toLowerCase()}
				token={token?.access}
				{...pageProps} 
			/>
		</Layout>
	);
};

const Auth = ({ Component, pageProps }) => {
	const router = useRouter();
	// if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
	const { data: token, status } = useSession({ required: true });
  
	if (status === 'loading' || !token) {
		return <Loading />;
	}
	const role = token?.user?.data?.user_type;
	let allowed = true;

	if (router.pathname.startsWith('/employee') && role !== 'Employee') {
		allowed = false;
	}
	if (router.pathname.startsWith('/customer') && role !== 'Customer') {
		allowed = false;
	}
	if (router.pathname.startsWith('/business') && role !== 'Business') {
		allowed = false;
	}

	const ComponentToRender = allowed ? Component : Home;

	return (
		<UserLayer Component={ComponentToRender} {...pageProps} />
	);
};


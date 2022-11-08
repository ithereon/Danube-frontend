/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Auth from '../../layouts/Auth';
import { getDataAsync } from '../../lib/axios';
import Button from '../../components/UI/button';
import { getSession } from 'next-auth/react';
import Loading from '../../components/UI/loading';


const EmailVerify = () => {
	const router = useRouter();
	const {token} = router.query;
	const [submitting, setsubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [state, setState] = useState('loading');

	useEffect(() => {
		const confirmEmail = async() => {
			if(!token){
				setMessage({
					type: 'error',
					body: 'Something went wrong'
				});
				setState('error');
				return;
			}
			const res = await getDataAsync(`/accounts/email-verify/?token=${token}`);
			if(res?.data?.email){
				setMessage({
					type: 'success',
					body: res.data.email
				});
				setState('success');
				setTimeout(() => {
					router.push('/auth/login');
				}, 2000);
			}else{
				setMessage({
					type: 'error',
					body: 'Something went wrong! your token might have expired, try to resend email and follow the link'
				});
				setState('error');
			}
		};
		confirmEmail();
	}, []);

	return (
		<Auth title={'Confirm email'}>
			<div className='pt-4 py-8 text-center'>
				{state === 'loading' && (
					<Loading />
				)}
				{state === 'error' ? (
					<p className='flex flex-col justify-center text-left'>
						<span className='mb-2'>! Feature not available for now</span>
						<Button
							type="button"
							full="true"
							onClick={()=>console.log('resend email function')}
							withLoader={submitting}
						>
                            Resend email
						</Button>
					</p>
				) : null}
			</div>
			{(message?.body) && (
				<p className={message.type === 'success' ? 'success-message' : 'error-message'}>{message.body}</p>
			)}
		</Auth>
	);
};

export default EmailVerify;

export async function getServerSideProps(context) {
	const session = await getSession(context);
  
	if (session && session?.error !== 'RefreshAccessTokenError') {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
  
	return {
		props: { session }
	};
}
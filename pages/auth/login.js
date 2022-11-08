import React, {useState} from 'react';
import Link from 'next/link';
import { signIn,
	getSession,
} from 'next-auth/react';
import {useRouter} from 'next/dist/client/router';
import { validateEmail } from '../../lib/utils';

// layout for page
import Auth from '../../layouts/Auth';
//components
import Input from '../../components/UI/input';
import Button from '../../components/UI/button';


export default function Login() {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [input, setInput] = useState({
		email: '',
		password: ''
	});
	const [error, setError] = useState({
		email: '',
		password: '',
	});

	const validateInput = e => {
		let { name, value } = e.target;
		setError(prev => {
			const stateObj = { ...prev, [name]: '' };
	
			switch (name) {
			case 'password':
				if (!value) {
					stateObj[name] = 'Please enter Password.';
				}
				break;
				
			case 'email':
				if(!value){
					stateObj[name] = 'Please enter your email.';
				}else if( !validateEmail(value) ){
					stateObj[name] = 'Email is not valid.';
				}
				break;
			default:
				break;
			}
			return stateObj;
		});
	};
	
	const onInputChange = e => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value
		}));
		validateInput(e);
	};

	const validateForm = async (data) => {
		for (const [key, value] of Object.entries(data)) {
			validateInput({
				target: {
					name: key,
					value: value
				}
			});
		}
		let formHasError = false;
		for (const entry of Object.entries(error)) {
			if(entry[1]){
				formHasError = true;
			}
		}
		for (const entry of Object.entries(input)) {
			if(!entry[1]){
				formHasError = true;
			}
		}
		return formHasError;
	};

	const loginHandler = async(e, credentials) => {
		e.preventDefault();
		setSubmitting(true);
		const formHasErrors = await validateForm(credentials);
		if(!formHasErrors){
			try {
				const res = await signIn('credentials', {
					redirect: false,
					email: credentials.email.toLowerCase(),
					password: credentials.password,
					callbackUrl: `${window.location.origin}`,
				});
				if(res.ok){
					setMessage({
						body: 'You\'re logged in',
						type: 'success'
					});
					router.push('/');
				}else{
					setMessage({
						body: 'Something went wrong. Please check your entered values.',
						type: 'error'
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
		setSubmitting(false);
	};

	return (
		<Auth 
			title="Sign in"
			extra={()=>(
				<div className="flex flex-wrap my-6 relative">
					<div className="w-1/2">
						<Link href="/auth/forgot-password">
							<a className="text-neutral-800 font-semibold">
								<small>Forgot password?</small>
							</a>
						</Link>
					</div>
					<div className="w-1/2 text-right">
						<Link href="/auth/register">
							<a className="text-neutral-800 font-semibold">
								<small>Create new account</small>
							</a>
						</Link>
					</div>
				</div>
			)}
		>
			<form 
				noValidate 
				onSubmit={(e)=>loginHandler(e, input)}
			>
				<div className="relative w-full mb-3 mt-5">
					<Input
						label="Email"
						type="email"
						name="email"
						onChange={onInputChange}
						onBlur={validateInput}
						required
					/>
					{error.email && <span className='err'>{error.email}</span>}
				</div>

				<div className="relative w-full mb-3 mt-8">
					<Input
						label="Password"
						type="password"
						onChange={onInputChange}
						onBlur={validateInput}
						name="password"
						required
					/>
					{error.password && <span className='err'>{error.password}</span>}
				</div>

				<div className="text-center mt-8 mb-3">
					<Button
						type="submit"
						big="true"
						full="true"
						withLoader={submitting}
					>
						Sign In
					</Button>
				</div>

				{(message && message.body) && (
					<p className={message.type === 'success' ? 'success-message' : 'error-message'}>{message.body}</p>
				)}
			</form>
		</Auth>
	);
}

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
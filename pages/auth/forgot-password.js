/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import Layout from '../../layouts/layout';
import { getSession, useSession } from 'next-auth/react';
import Auth from '../../layouts/Auth';
import Input from '../../components/UI/input';
import { validateEmail } from '../../lib/utils';
import Button from '../../components/UI/button';
import { postDataAsync } from '../../lib/axios';
import Link from 'next/link';


export default function ForgotPassword() {
	const [submitting, setSubmitting] = useState(false);
	const [input, setInput] = useState({
		email: '',
	});
	const [error, setError] = useState({
		email: false,
	});
	const [message, setMessage] = useState(false);

	const onInputChange = e => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value
		}));
		validateInput(e);
	};

	const validateInput = e => {
		let { name, value } = e.target;
		setError(prev => {
			const stateObj = { ...prev, [name]: '' };
	
			switch (name) {
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
    
	const requestPasswordReset = async(e, body) => {
		e.preventDefault();
		setSubmitting(true);
		const formHasErrors = await validateForm(body);
		// send request only if no errors are present
		if(!formHasErrors){
			try {
				const res = await postDataAsync('/accounts/api/password_reset/', {
					email: body.email
				});
				if(res?.data?.status === 'OK'){
					setMessage({
						type: 'success',
						body: `Reset password link has been sent to this email address: ${body.email}`
					});
				}else if(res?.error?.response?.data?.email){
					setMessage({
						type: 'error',
						body: res.error.response.data.email
					});
				}else{
					setMessage({
						type: 'error',
						body: 'Something went wrong, try again later.'
					});
				}
			} catch (error) {
				console.log('error is: ', error);
			}
			
		}
		setSubmitting(false);
	};
	return (
		<Auth
			title="Forgot Password?"
			extra={()=>(
				<div className="flex flex-wrap my-6 relative">
					<div className="w-1/2">
						<Link href="/auth/login">
							<a className="text-neutral-800 font-semibold">
								<small>Sign In</small>
							</a>
						</Link>
					</div>
					<div className="w-1/2 text-right">
						<Link href="/auth/register">
							<a className="text-neutral-800 font-semibold">
								<small>Create New Account</small>
							</a>
						</Link>
					</div>
				</div>
			)}
		>
			<form 
				noValidate 
				onSubmit={(e)=>requestPasswordReset(e, input)}
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

				<div className="text-center mt-8 mb-3">
					<Button
						type="submit"
						big="true"
						full="true"
						withLoader={submitting}
					>
						Submit
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
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import { useRouter } from 'next/router';
import Auth from '../../layouts/Auth';
import Input from '../../components/UI/input';
import Button from '../../components/UI/button';
import { postDataAsync } from '../../lib/axios';
import Link from 'next/link';
import { getSession } from 'next-auth/react';


export default function CreatePassword() {
	const router = useRouter();
	const {token} = router.query;
	const [submitting, setSubmitting] = useState(false);

	const [input, setInput] = useState({
		password: '',
		password2: ''
	});
	const [error, setError] = useState({
		password: false,
		password2: false
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
			case 'password':
				if (!value) {
					stateObj[name] = 'This field may not be blank.';
				}else if(value.length < 8){
					stateObj[name] = 'Password is less than 8 characters.';
				}else if (input.password2 && value !== input.password2) {
					stateObj['password2'] = 'Passwords do not match.';
				} else {
					stateObj['password2'] = input.password2 ? '' : error.password2;
				}
				break;
        
			case 'password2':
				if (!value) {
					stateObj[name] = 'This field may not be blank.';
				} else if (input.password && value !== input.password) {
					stateObj[name] = 'Passwords do not match.';
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
		if(!token){
			setMessage({
				type: 'error',
				body: 'Something went wrong'
			});
			return;
		}
		if(!formHasErrors){
			const res = await postDataAsync('/accounts/api/password_reset/confirm/', {
				password: body.password,
				token: token
			});
			if(res?.data?.status === 'OK'){
				setMessage({
					type: 'success',
					body: 'You changed password successfully!'
				});
			}else if(res?.error?.response?.data?.password){
				setMessage({
					type: 'error',
					body: res.error.response.data.password.length > 1 ? res.error.response.data.password.map(
						item=>(
							<li key={item} className='leading-5'>
								{item}
							</li>
						)
					) : res.error.response.data.password
				});
			}else{
				setMessage({
					type: 'error',
					body: res?.error?.response?.data?.detail ? res.error.response.data.detail : 'Something went wrong'
				});
			}
		}
		setSubmitting(false);
	};
	return (
		<Auth
			title={'Reset Password'}
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
				<div className="relative w-full mb-3 mt-8">
					<Input
						label="New Password"
						type="password"
						onChange={onInputChange}
						onBlur={validateInput}
						name="password"
						required
					/>
					{error.password && <span className='err'>{error.password}</span>}
				</div>

				<div className="relative w-full mb-3 mt-8">
					<Input
						label="Confirm Password"
						type="password"
						onChange={onInputChange}
						onBlur={validateInput}
						name="password2"
						required
					/>
					{error.password2 && <span className='err'>{error.password2}</span>}
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
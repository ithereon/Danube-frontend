/* eslint-disable no-undef */
import React, {useState} from 'react';
import Link from 'next/link';
import {getSession} from 'next-auth/react';
import { postDataAsync } from '../../lib/axios';
import { userTypeData } from '../../lib/constants';
import { validateEmail } from '../../lib/utils';
// layout for page
import Auth from '../../layouts/Auth';
//components
import Input from '../../components/UI/input';
import RadioButtons from '../../components/radioButtons';
import Button from '../../components/UI/button';

export default function Register() {
	const [submitting, setSubmitting] = useState(false);
	const [input, setInput] = useState({
		username: '',
		email: '',
		password: '',
		password2: '',
		usertype: userTypeData[0].label
	});
	const [acceptedToPolicy, setAcceptedToPolicy] = useState(true);
	const [error, setError] = useState({
		username: '',
		email: '',
		password: '',
		password2: '',
		usertype: '',
		checkbox: ''
	});
	const [message, setMessage] = useState(false);

	const handleRegister = async (e, body) => {
		e.preventDefault();
		setSubmitting(true);
		const tobeValidated = {
			...body,
			checkbox: acceptedToPolicy
		};
		const formHasErrors = await validateForm(tobeValidated);
		if(!formHasErrors){
			const res = await postDataAsync('/accounts/register/', body);
		
			if(res.data && res.data.data && res.data.data.email){
				setMessage({
					body: `Confirmation email has been sent to ${res.data.data.email}`,
					type: 'success'
				});
			}else if(res.error){
				console.log(res);
				let errorText = '';
				if(Object.keys(res.error.response.data.errors).length === 1){
					// eslint-disable-next-line no-unused-vars
					for (const [key, value] of Object.entries(res.error.response.data.errors)) {
						errorText = errorText+value;
					}
					setMessage({
						body: errorText,
						type: 'error'
					});
				}else{
					// eslint-disable-next-line no-unused-vars
					for (const [key, value] of Object.entries(res.error.response.data.errors)) {
						setError(prev=>({
							...prev,
							[key]: value[0]
						}));
					}
				}
				
			}
		}
		setSubmitting(false);
	};

	const onInputChange = e => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value
		}));
		validateInput(e);
	};

	const onAccaptanceChange = (e) => {
		const isChecked = e.target.value.toLowerCase() === 'false';
		setAcceptedToPolicy(isChecked);
		validateInput({
			target: {
				name: e.target.name,
				value: isChecked
			}
		});
	};

	const validateInput = e => {
		let { name, value } = e.target;
		setError(prev => {
			const stateObj = { ...prev, [name]: '' };
	
			switch (name) {
			case 'username':
				if (!value) {
					stateObj[name] = 'This field may not be blank.';
				}
				break;
	
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
				
			case 'email':
				if(!value){
					stateObj[name] = 'This field may not be blank.';
				}else if( !validateEmail(value) ){
					stateObj[name] = 'Email is not valid.';
				}
				break;

			case 'checkbox':
				if(!value || value === 'false'){
					stateObj[name] = 'Please check this box to continue.';
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

	return (
		<Auth title="Sign up">
			<form noValidate onSubmit={(e)=>handleRegister(e, input)}>
				<div className="relative w-full mb-3">
					<RadioButtons
						label="Sign up as"
						options={userTypeData}
						required
						onChange={val=>{
							const type = val;
							setInput(prev=>({...prev, usertype: type}));
						}}
					/>
				</div>

				<div className="relative w-full mb-3 mt-5">
					<Input
						label="Name"
						onChange={onInputChange}
						onBlur={validateInput}
						name="username"
						required
					/>
					{error.username && <span className='err'>{error.username}</span>}
				</div>

				<div className="relative w-full mb-3 mt-8">
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

				<div className="relative w-full mb-9 mt-8">
					<Input
						label="Confirm password"
						placeholder="Confirm password"
						type="password"
						onChange={onInputChange}
						onBlur={validateInput}
						name="password2"
						required
					/>
					{error.password2 && <span className='err'>{error.password2}</span>}
				</div>

				<div className='relative mb-9'>
					<label className="inline-flex items-center cursor-pointer">
						<input
							id="customCheckLogin"
							type="checkbox"
							checked={acceptedToPolicy}
							value={acceptedToPolicy}
							name="checkbox"
							onChange={onAccaptanceChange}
							onBlur={validateInput}
							tabIndex={-1}
							className="form-checkbox border-0 rounded text-slate-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
							required
						/>
						<span className="ml-2 text-sm font-semibold text-slate-600">
											I agree with the{' '}
							<Link href="/privacy-policy">
								<a
									className="indigo-link"
									target="_blank"
								>
									Privacy Policy
								</a>
							</Link>
						</span>
					</label>
					{error.checkbox && <span className='err'>{error.checkbox}</span>}
				</div>

				<div className="text-center my-6">
					<Button
						type="submit"
						big="true"
						full="true"
						withLoader={submitting}
					>
						Create Account
					</Button>
				</div>
				{(message && message.body) && (
					<p className={message.type === 'success' ? 'success-message' : 'error-message'}>{message.body}</p>
				)}
			</form>

			<p className='text-center text-base text-neutral-700'>
									Already have an account?
				<Link href="/auth/login">
					<a className='indigo-link pl-1 font-medium'>
										Log In
					</a>
				</Link>
			</p>
		</Auth>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
  
	if (session) {
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
/* eslint-disable no-undef */
import React, {useState, useRef} from 'react';
import handleContactFormSubmit from '../pages/api/form';

import Input from './UI/input';
import Textarea from './UI/textarea';
import Button from './UI/button';
import ReCAPTCHA from 'react-google-recaptcha';
import Feedback from './UI/feedback';

const ContactForm = (props) => {
	const captcha = useRef();
	const siteKey = process.env.RECAPTCHA_SITE_KEY;
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	// const [feedback, setFeedback] = useState();	
	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-slate-200">
				<form 
					onSubmit={(e)=>{
						e.preventDefault();
						setLoading(true);
						const token = captcha.current.getValue();
						handleContactFormSubmit(name, email, message, token);
						// if(token){
						// 	handleContactFormSubmit(name, email, message, token);
						// 	setFeedback();
						// }
						// else{
						// 	setFeedback({
						// 		type: 'error',
						// 		body: 'recaptcha error'
						// 	});
						// }
						setLoading(false);
						captcha.current.reset();
					}}
					className="flex-auto p-5 lg:p-10"
				>
					{!props.noTitle && (
						<h2 className="text-2xl font-semibold mb-5">
						Get in touch!
						</h2>
					)}
					<div className='flex justify-between flex-wrap'>
						<div className='w-full lg:pr-6 lg:w-2/4'>
							<div className="relative mb-5">
								<Input 
									label="First Name"
									placeholder="First Name"
									required
									onChange={e => setName(e.target.value)}
								/>
							</div>

							<div className="relative mb-5">
								<Input 
									label="Subject"
									placeholder="Subject"
									type="text"
									required
									onChange={e => setEmail(e.target.value)}
								/>
							</div>
						</div>
						<div className='w-full lg:pl-6 lg:w-2/4'>
							<div className="relative mb-5">
								<Input 
									label="Last Name"
									placeholder="Last Name"
									required
									onChange={e => setName(e.target.value)}
								/>
							</div>

							<div className="relative mb-5">
								<Input 
									label="Email"
									placeholder="Email"
									type="email"
									required
									onChange={e => setEmail(e.target.value)}
								/>
							</div>
						</div>
					</div>

					<div className="relative mb-5">
						<Textarea
							label="Message"
							placeholder="Type a message..."
							required
							onChange={e => setMessage(e.target.value)}
						/>
					</div>
					<ReCAPTCHA
						sitekey={siteKey}
						ref={captcha}
						size="normal"
					/>
					<div className="text-center mt-6">
						<Button
							type="submit" 
							clicked={()=>{
								console.log('submit');
							}}
							withLoader={loading}
						>
                        Send Message
						</Button>
					</div>
				</form>
			</div>
			{feedback?.body && (
				<div className='mt-2'>
					<Feedback state={feedback.type || 'warning'} message={feedback.body} />
				</div>
			)}
		</>
	);
};

export default ContactForm;
import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/dist/client/router';
import { normalDate } from '../../../lib/utils';

// layout for page
import Admin from '../../../layouts/Admin';

// components
import Button from '../../../components/UI/button';
import Input from '../../../components/UI/input';
import Loading from '../../../components/UI/loading';
import { WithTransition } from '../../../components/wrappers/withTransition';
import { SubHeader } from '../../../components/subHeader';
import { requestWithTokenAsync } from '../../../lib/axios';

const EditProperty = ({token, role}) => {
	const router = useRouter();
	const {id} = router.query;
	const [submiting, setSubmitting] = useState(false);
	const [propertyID, setPropertyID] = useState('');
	const [creationDate, setCreationDate] = useState('');
	const [input, setInput] = useState({
		address_1: '',
		address_2: '',
		town: '',
		city: '',
		county: '',
		postcode: ''
	});
	const [error,setError] = useState({
		address_1: '',
		address_2: '',
		town: '',
		city: '',
		county: '',
		postcode: '',
	});
	const [message, setMessage] = useState();

	useEffect(() => {
		if(!id){
			router.push(`/${role}/property/manage`);
		}else{
			const fetchData = async () => {
				const res = await requestWithTokenAsync(
					'get',
					`/properties/${id}/`,
					token
				);
				if(res?.data){
					const data = res.data;
					setInput({
						address_1: data.address_1,
						address_2: data.address_2,
						town: data.town,
						city: data.city,
						county: data.county,
						postcode: data.postcode,
					});
					setPropertyID(data.id);
					setCreationDate(normalDate(data.created_at));

				}
			};
			fetchData();
		}
	}, []);
    

	const onInputChange = (e) => {
		const { name, value } = e.target;
		setInput(prev=>({
			...prev,
			[name]: value
		}));
		onBlur({
			target: {
				name: name,
				value: value
			}
		});
	};

	const onBlur = (e) => {
		const {name, value} = e.target;
		setError(prev=>{
			const stateObj = { ...prev, [name]: '' };
			
			switch (name) {
			case 'address_2':
				stateObj[name] = '';
				break;
			case 'city':
				stateObj[name] = '';
				break;
			default:
				if(!value){
					stateObj[name] = 'This field may not be blank.';
				}
				break;
			}
			return stateObj;
		});
		
	};

	const validate = async(values) => {
		for (const [key, value] of Object.entries(values)) {
			onBlur({target: {
				name: key,
				value: value
			}});
		}
		let formHasError = false;
		for (const entry of Object.entries(error)) {
			if(entry[1]){
				formHasError = true;
			}
		}
		for (const entry of Object.entries(values)) {
			if(!entry[1] && entry[0] !== 'address_2' && entry[0] !== 'city'){
				formHasError = true;
			}
		}
		return formHasError;
	};

	const handleUpdate = async (e,values) => {
		e.preventDefault();
		setSubmitting(true);
		const formHasErrors = await validate(values);
		if(formHasErrors){
			setMessage({
				body: 'Make sure everything is filled out correctly',
				type: 'error'
			});
		}else{
			const res = await requestWithTokenAsync(
				'patch',
				`/properties/${id}/`,
				token,
				values
			);
			if(res?.data?.id){
				setMessage({
					body: `Property with ID of ${res.data.id} has been updated`,
					type: 'success'
				});
				setTimeout(() => {
					router.push(`/${role}/property/manage`);
				}, 1000);
			}else{
				setMessage({
					body: 'Something went wrong',
					type: 'error'
				});
			}
		}
		setSubmitting(false);
	};

	if(!id){
		return <Loading />;
	}

	return (
		<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<SubHeader>
					Update property
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-100 border-0">
						<div className="flex-auto px-2 md:px-4 lg:px-10 py-10">
							<form noValidate onSubmit={(e)=>handleUpdate(e,input)}>
								<div className="flex flex-wrap">
									<div className="w-full lg:w-6/12 px-2 md:px-4">
										<div className="relative w-full mb-3 mt-5 lg:mt-0">
											<Input
												label="Address line 1"
												name="address_1"
												defaultValue={input.address_1}
												onChange={onInputChange}
												onBlur={onBlur}
												required
											/>
											{error.address_1 && <span className='err truncate max-w-full'>{error.address_1}</span>}
										</div>
									</div>
									<div className="w-full lg:w-6/12 px-2 md:px-4">
										<div className="relative w-full mb-3 mt-5 lg:mt-0">
											<Input
												label="Address line 2"
												name="address_2"
												defaultValue={input.address_2}
												onChange={onInputChange}
												onBlur={onBlur}
											/>
											{error.address_2 && <span className='err truncate max-w-full'>{error.address_2}</span>}
										</div>
									</div>
									<div className="w-full lg:w-6/12 px-2 md:px-4">
										<div className="relative w-full  mb-3 mt-5">
											<Input 
												label="Village/Town/Borough"
												name="town"
												type="text"
												defaultValue={input.town}
												onChange={onInputChange}
												onBlur={onBlur}
												required
											/>
											{error.town && <span className='err truncate max-w-full'>{error.town}</span>}
										</div>
									</div>
									<div className="w-full lg:w-6/12 px-2 md:px-4">
										<div className="relative w-full  mb-3 mt-5">
											<Input 
												label="City"
												name="city"
												type="text"
												defaultValue={input.city}
												onChange={onInputChange}
												onBlur={onBlur}
											/>
											{error.city && <span className='err truncate max-w-full'>{error.city}</span>}
										</div>
									</div>
									<div className="w-full lg:w-6/12 px-2 md:px-4">
										<div className="relative w-full  mb-3 mt-5">
											<Input 
												label="County"
												name="county"
												type="text"
												defaultValue={input.county}
												onChange={onInputChange}
												onBlur={onBlur}
												required
											/>
											{error.county && <span className='err truncate max-w-full'>{error.county}</span>}
										</div>
									</div>
									<div className="w-full lg:w-6/12 px-2 md:px-4">
										<div className="relative w-full  mb-3 mt-5">
											<Input
												label="Postcode"
												name="postcode"
												type="text"
												defaultValue={input.postcode}
												onChange={onInputChange}
												onBlur={onBlur}
												required
											/>
											{error.postcode && <span className='err truncate max-w-full'>{error.postcode}</span>}
										</div>
									</div>
									<div className="w-full lg:w-6/12 px-2 md:px-4">
										<div className="relative w-full  mb-3 mt-5">
											<Input
												label="date created"
												name="created_at"
												type="text"
												defaultValue={creationDate}
												readOnly
											/>
										</div>
									</div>
									<div className="w-full lg:w-6/12 px-2 md:px-4">
										<div className="relative w-full  mb-3 mt-5">
											<Input
												label="property ID"
												name="id"
												type="text"
												defaultValue={propertyID}
												readOnly
											/>
										</div>
									</div>
									<div className="w-full flex justify-end mt-4">
										<div className='w-full px-2 md:px-4 lg:w-6/12'>
											<Button
												type="submit"
												full="true"
												withLoader={submiting}
											>
											Update Property
											</Button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</WithTransition>

			{(message && message.body && message.type !== 'error-list') && (
				<div className='container mx-auto my-6 px-4'>
					<p className={message.type === 'success' ? 'success-message' : 'error-message'}>
						{message.body}
					</p>
				</div>
			)}
		</div>
	);
};
export default EditProperty;

EditProperty.auth = true;
EditProperty.layout = Admin;
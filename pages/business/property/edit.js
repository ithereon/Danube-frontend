import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/dist/client/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import useForm from '../../../lib/hooks/useForm';
import { requestWithTokenAsync } from '../../../lib/axios';
import { normalDate } from '../../../lib/utils';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import Button from '../../../components/UI/button';
import Input from '../../../components/UI/input';
import { SubHeader } from '../../../components/subHeader';
import Feedback from '../../../components/UI/feedback';

const EditBusiness = ({userData, token, role}) => {
	const router = useRouter();
	const {id} = router.query;
	const [message, setMessage] = useState();
	const [businessID, setBusinessID] = useState('');
	const [creationDate, setCreationDate] = useState('');

	useEffect(() => {
		if(!id){
			router.push(`/${role}/property/manage`);
		}else{
			const fetchData = async () => {
				const res = await requestWithTokenAsync(
					'get',
					`/business_details/${id}/`,
					token
				);
				if(res?.data){
					const data = res.data;
					const business = {
						business_name: data.business_name,
						main_trade: data.main_trade,
						website: data.website,
						description: data.description,
						company_house_number: data.company_number,
						vat: data.vat,
						address_1: data.address_1,
						address_2: data.address_2,
						town: data.town,
						city: data.city,
						county: data.county,
						postcode: data.postcode,
					};
					formik.setValues(business);
					setBusinessID(data.id);
					setCreationDate(normalDate(data.created_at));

				}
			};
			fetchData();
		}
	}, []);

	const formik = useFormik({
		initialValues: {
			address_1: '',
			address_2: '',
			town: '',
			city: '',
			county: '',
			postcode: '',
			business_name: '',
			main_trade: '',
			website: '',
			description: '',
			company_house_number: '',
			vat: '',
		},
		validationSchema: Yup.object({
			address_1: Yup.string().required('This field may not be blank.'),
			address_2: Yup.string(),
			town: Yup.string().required('This field may not be blank.'),
			city: Yup.string(),
			county: Yup.string().required('This field may not be blank.'),
			postcode: Yup.string().required('This field may not be blank.'),
			business_name: Yup.string().required('This field may not be blank.'), /* required? */
			main_trade: Yup.string().required('This field may not be blank.'),
			website: Yup.string()
				.matches(
					/^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
					'Please enter valid URL'
				),
			description: Yup.string()
				.required('This field may not be blank.'),
			company_house_number: Yup.string()
				.min(8, 'Must be exactly 8 digits')
				.max(8, 'Must be exactly 8 digits')
				.required('This field may not be blank.'),
			vat: Yup.string()
		}),
		onSubmit: async (values) => {
			const res = await requestWithTokenAsync(
				'patch',
				`/business_details/${id}/`,
				token,
				{...values, user: userData.id}
			);
			if(res?.data?.id){
				setMessage({
					body: `Business with ID of ${res.data.id} has been updated`,
					type: 'success'
				});
				router.push(`/${role}/property/manage`);
			}else{
				setMessage({
					body: 'Something went wrong',
					type: 'error',
					list: res?.error?.response?.data
				});
			}
		},
	});

	const {
		isError,
		errorKeySet,
		title,
		errors
	} = useForm(formik);
	
	const {
		values, handleChange, handleBlur, handleSubmit, isSubmitting
	} = formik;

	return (
		<WithTransition>
			<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
				<SubHeader>
					update Business
				</SubHeader>
				<div className="relative flex flex-col min-w-0 mx-4 break-words w-full h-full shadow-lg rounded-lg bg-slate-100 border-0">
					<div className="flex-auto px-2 md:px-4 lg:px-10 py-10">
						<form noValidate onSubmit={handleSubmit}>
							<div className="flex flex-wrap">
								<div className='w-full px-2 md:px-4'>
									<h2 className="text-slate-600 text-base font-bold capitalize">
										Business details
									</h2>
									<hr className="mb-6 border-b-2 border-emerald-300 w-10" />
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full mb-3">
										<Input
											label="Business name"
											name="business_name"
											type="text"
											value={values.business_name}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('business_name')) || message?.list?.business_name) && (
											<span className='err truncate max-w-full'>{errors ? errors['business_name'] : message.list.business_name}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full mb-3">
										<Input
											label="Main trade"
											name="main_trade"
											type="text"
											value={values.main_trade}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('main_trade')) || message?.list?.main_trade) && (
											<span className='err truncate max-w-full'>{errors ? errors['main_trade'] : message.list.main_trade}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input
											label="Website address"
											name="website"
											type="text"
											value={values.website}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{((isError && errorKeySet.has('website')) || message?.list?.website) && (
											<span className='err truncate max-w-full'>{errors ? errors['website'] : message.list.website}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input
											label="About my business"
											name="description"
											type="text"
											value={values.description}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('description')) || message?.list?.description) && (
											<span className='err truncate max-w-full'>{errors ? errors['description'] : message.list.description}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input
											label="Companies house number"
											name="company_house_number"
											type="number"
											value={values.company_house_number}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('company_house_number')) || message?.list?.company_house_number) && (
											<span className='err truncate max-w-full'>{errors ? errors['company_house_number'] : message.list.company_house_number}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input
											label="VAT number"
											name="vat"
											type="text"
											value={values.vat}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{((isError && errorKeySet.has('vat')) || message?.list?.vat) && (
											<span className='err truncate max-w-full'>{errors ? errors['vat'] : message.list.vat}</span>
										)}
									</div>
								</div>

								
								<div className='w-full px-2 md:px-4'>
									<h2 className="text-slate-600 text-base mt-6 font-bold capitalize">
										Address details
									</h2>
									<hr className="mb-2 border-b-2 border-emerald-300 w-10" />
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full mb-3 mt-5">
										<Input
											label="Business address line 1"
											name="address_1"
											value={values.address_1}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('address_1')) || message?.list?.address_1) && (
											<span className='err truncate max-w-full'>{errors ? errors['address_1'] : message.list.address_1}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full mb-3 mt-5">
										<Input
											label="Business address line 2"
											name="address_2"
											value={values.address_2}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{((isError && errorKeySet.has('address_2')) || message?.list?.address_2) && (
											<span className='err truncate max-w-full'>{errors ? errors['address_2'] : message.list.address_2}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input 
											label="Village/Town/Borough"
											name="town"
											type="text"
											value={values.town}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('town')) || message?.list?.town) && (
											<span className='err truncate max-w-full'>{errors ? errors['town'] : message.list.town}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input 
											label="City"
											name="city"
											type="text"
											value={values.city}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{((isError && errorKeySet.has('city')) || message?.list?.city) && (
											<span className='err truncate max-w-full'>{errors ? errors['city'] : message.list.city}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input 
											label="County"
											name="county"
											type="text"
											value={values.county}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('county')) || message?.list?.county) && (
											<span className='err truncate max-w-full'>{errors ? errors['county'] : message.list.county}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input
											label="Postcode"
											name="postcode"
											type="text"
											value={values.postcode}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('postcode')) || message?.list?.postcode) && (
											<span className='err truncate max-w-full'>{errors ? errors['postcode'] : message.list.postcode}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input
											label="date created"
											name="created_at"
											type="text"
											value={creationDate}
											readOnly
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input
											label="business ID"
											name="id"
											type="text"
											value={businessID}
											readOnly
										/>
									</div>
								</div>
								<div className="w-full flex justify-end mt-4">
									<div className='w-full px-2 md:px-4 lg:w-6/12'>
										<Button
											type="submit"
											full="true"
											withLoader={isSubmitting}
										>
											Update Business
										</Button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>

				{(isError || message?.body) && (
					<div className="mt-4 w-full mx-4">
						<Feedback state={message?.type || 'error'} message={title || message.body} />
					</div>
				)}

				{/* {(isError) && (
					<>
						<h3>{title}</h3>
						{errorList.length ? (
							<div className={`mt-2 text-sm ${textColors[state]}`}>
								<ul className="list-disc pl-5 space-y-1">
									{errorList.map((item) => (
										<li key={Math.random()+item}>
											<div className='container mx-auto my-6'>
												<p className={message.type === 'success' ? 'success-message' : 'error-message'}>
													{item}
												</p>
											</div>
										</li>
							  ))}
								</ul>
							</div>
						) : null}
					</>
				)} */}
			</div>
		</WithTransition>
	);
};
export default EditBusiness;

EditBusiness.auth = true;
EditBusiness.layout = Admin;
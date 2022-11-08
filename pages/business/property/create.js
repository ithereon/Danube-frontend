import React, {useState} from 'react';
import {useRouter} from 'next/dist/client/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import useForm from '../../../lib/hooks/useForm';
import { requestWithTokenAsync } from '../../../lib/axios';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import Button from '../../../components/UI/button';
import Input from '../../../components/UI/input';
import { SubHeader } from '../../../components/subHeader';
import Feedback from '../../../components/UI/feedback';

const CreateBusiness = ({userData, token, role}) => {
	const router = useRouter();
	const [message, setMessage] = useState();

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
			company_number: '',
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
					/^((ftp|http|https):\/\/)+(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
					'Please enter valid URL'
				),
			description: Yup.string()
				.required('This field may not be blank.'),
			company_number: Yup.string()
				.min(8, 'Must be exactly 8 digits')
				.max(8, 'Must be exactly 8 digits')
				.required('This field may not be blank.'),
			vat: Yup.string()
		}),
		onSubmit: async (values) => {
			const res = await requestWithTokenAsync(
				'post',
				'/business_details/',
				token,
				{...values, user: userData.id}
			);
			if(res?.data?.id){
				setMessage({
					body: `Business has been created with ID of ${res.data.id}`,
					type: 'success'
				});
				if(!userData.is_property_created){
					router.replace({
						pathname: `/${role}`,
					}).then(() => router.reload());
				}else{
					router.push(`/${role}/property/manage`);
				}
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
					create Business
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
											defaultValue={values.business_name}
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
											defaultValue={values.main_trade}
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
											defaultValue={values.website}
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
											defaultValue={values.description}
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
											name="company_number"
											type="number"
											defaultValue={values.company_number}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('company_number')) || message?.list?.company_number) && (
											<span className='err truncate max-w-full'>{errors ? errors['company_number'] : message.list.company_number}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2 md:px-4">
									<div className="relative w-full  mb-3 mt-5">
										<Input
											label="VAT number"
											name="vat"
											type="text"
											defaultValue={values.vat}
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
											defaultValue={values.address_1}
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
											defaultValue={values.address_2}
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
											defaultValue={values.town}
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
											defaultValue={values.city}
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
											defaultValue={values.county}
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
											defaultValue={values.postcode}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errorKeySet.has('postcode')) || message?.list?.postcode) && (
											<span className='err truncate max-w-full'>{errors ? errors['postcode'] : message.list.postcode}</span>
										)}
									</div>
								</div>
								<div className="w-full flex justify-end mt-4">
									<div className='w-full px-2 md:px-4 lg:w-6/12'>
										<Button
											type="submit"
											full="true"
											withLoader={isSubmitting}
										>
											Create Business
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
export default CreateBusiness;

CreateBusiness.auth = true;
CreateBusiness.layout = Admin;
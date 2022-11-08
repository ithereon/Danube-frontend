import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import useForm from '../../../lib/hooks/useForm';
import { requestWithTokenAsync } from '../../../lib/axios';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import Button from '../../../components/UI/button';
import { SubHeader } from '../../../components/subHeader';
import Feedback from '../../../components/UI/feedback';
import Input from '../../../components/UI/input';
import Textarea from '../../../components/UI/textarea';
import StyledLabel from '../../../components/UI/styledLabel';

const CreateQuote = ({token, role, userData}) => {
	const router = useRouter();
	const {id} = router.query;
	const [message, setMessage] = useState();
	const [selectedProperty, setSelectedProperty] = useState();
	const [selectedBusiness, setSelectedBusiness] = useState();
	const [IDs, setIDs] = useState();

	useEffect(()=>{
		if(id){
			const getData = async () => {
				const res = await requestWithTokenAsync(
					'get',
					`/eoi/${id}/`,
					token
				);
				if(res?.data?.id){
					const propertyData = res.data.rfq.property;
					const propert = {
						address_1: propertyData.address_1,
						address_2: propertyData.address_2,
						town: propertyData.town,
						city: propertyData.city,
						county: propertyData.county,
						postcode: propertyData.postcode,
						profile: {
							name: res.data.owner_name || userData.username || '',
							surname: '',
							title: ''
						}
					};
					Object.keys(propert).forEach(key => {
						if (propert[key] === null || propert[key] === '') {
							delete propert[key];
						}
					});
					setSelectedProperty(propert);

					const businessData = res.data.business;
					const business = {
						business_name: businessData.business_name,
						website: businessData.website.replace('https://',''),
						separator: true,
						owner: res.data.business_user_name,
						vat: businessData.vat,
						address_1: businessData.address_1,
						address_2: businessData.address_2,
						town: businessData.town,
						city: businessData.city,
						county: businessData.county,
						postcode: businessData.postcode,
						profile: {
							name: res.data.business_user_name || '',
							surname: '',
							title: ''
						}
					};
					Object.keys(business).forEach(key => {
						if (business[key] === null || business[key] === '') {
							delete business[key];
						}
					});
					setSelectedBusiness(business);

					setIDs({
						property_obj: propertyData.id,
						business: businessData.id,
						eoi: res.data.id
					});
					setFieldValue('title', res.data.rfq.title);
				}
			};
			getData();
		}else{
			router.push(`/${role}/EOI/manage`);
		}
	},[id]);

	const formik = useFormik({
		initialValues: {
			title: '',
			description: ''
		},
		validationSchema: Yup.object({
			title: Yup.string().required('This field may not be blank.'),
			description: Yup.string()
		}),
		onSubmit: async (values) => {
			const res = await requestWithTokenAsync(
				'post',
				'/contracts/',
				token,
				{
					...values,
					...IDs
				}
			);
			if(res?.data?.id){
				setMessage({
					body: 'Quote has been requested',
					type: 'success'
				});
				router.push(`/${role}/quote/manage`);
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
		title,
		errors
	} = useForm(formik);
	
	const {
		values, handleChange, handleBlur, 
		handleSubmit, isSubmitting, setFieldValue
	} = formik;

	return (
		<WithTransition>
			<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-start'>
				<SubHeader>
					request quote
				</SubHeader>
				<div className="w-full lg:w-4/12 px-4 mb-4 lg:mb-0">
                    
					<div className="w-full relative flex flex-col min-w-0 p-6 break-words bg-white shadow-xl rounded-lg border-0">
						<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
                            Your property
							<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
						</h2>
						{selectedProperty && (
							<ul>
								{Object.entries(selectedProperty).map(item=>{
									if(item[0] === 'profile'){
										if(item[1]?.name){
											return (
												<li className='bg-slate-50 border p-4 rounded-lg' key={item[0]}>
													<StyledLabel label="you" htmlFor="business_user_info" sronly="true" />
													<div className='flex items-center'>
														<span className="w-10 h-10 text-base text-neutral-700 bg-slate-200 inline-flex items-center justify-center rounded-full mr-2">
															<i className="fa-solid fa-user"></i>
														</span>
														<p id="business_user_info" className='capitalize text-xs font-medium max-w-full text-center'>
															{`${item[1].name} ${item[1].surname} ${item[1].title && '('}${item[1].title}${item[1].title && ')'}`}
														</p>
													</div>
												</li>
											);
										}else{
											return null;
										}
									}
									return (
										<li className="my-1 text-slate-600 capitalize text-sm flex items-center" key={item[0]}>
											<StyledLabel htmlFor={item[0]} label={item[0].replace('_',' ')+':'} />
											<span id={item[0]} className='block mb-2 pl-1'>{item[1]}</span>
										</li>
									);
								})}
							</ul>
						)}
					</div>

					<div className="w-full relative flex flex-col min-w-0 p-6 mt-6 break-words bg-white shadow-xl rounded-lg border-0">
						<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
                            Business property
							<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
						</h2>
						{selectedBusiness && (
							<ul>
								{Object.entries(selectedBusiness).map(item=>{
									if(item[0] === 'website'){
										return (
											<li key={item[0]} className='text-sm'>
												<Link href={item[1]}>
													<a className='indigo-link flex items-center lowercase'>
														<i className='fas fa-earth mb-2 block text-slate-600' />
														<span 
															id={item[0]} 
															className='block mb-2 pl-1'
														>
															{item[1]}
														</span>
													</a>
												</Link>
											</li>
										);
									}else if(item[0] === 'business_name'){
										return (
											<h3 key={item[0]} className='font-medium text-slate-600 mt-2'>
												{item[1]}
											</h3>
										);
									}else if(item[0] === 'separator'){
										return <hr key={item[0]} className="mb-2 mt-1 border-b-1 border-slate-300 w-full" />;
									}else if(item[0] === 'profile'){
										if(item[1]?.name){
											return (
												<li className='bg-slate-50 border p-4 rounded-lg' key={item[0]}>
													<StyledLabel label="you" htmlFor="business_user_info" sronly="true" />
													<div className='flex items-center'>
														<span className="w-10 h-10 text-base text-neutral-700 bg-slate-200 inline-flex items-center justify-center rounded-full mr-2">
															<i className="fa-solid fa-user"></i>
														</span>
														<p id="business_user_info" className='capitalize text-xs font-medium max-w-full text-center'>
															{`${item[1].name} ${item[1].surname} ${item[1].title && '('}${item[1].title}${item[1].title && ')'}`}
														</p>
													</div>
												</li>
											);
										}else{
											return null;
										}
									}
									return (
										<li className="my-1 text-slate-600 capitalize text-sm flex items-center" key={item[0]}>
											<StyledLabel htmlFor={item[0]} label={item[0].replace('_',' ')+':'} />
											<span id={item[0]} className='block mb-2 pl-1'>{item[1]}</span>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>
				<div className='w-full lg:w-8/12 px-4'>
					<div className='flex flex-col'>
						<div className="w-full relative flex flex-col min-w-0 px-4 break-words h-full shadow-lg rounded-lg bg-white border-0">
							<div className="flex-auto px-2 py-6">
								<form noValidate onSubmit={handleSubmit}>
									<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize mb-6 px-2">
										Quote details
										<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
									</h2>
									<div className="w-full px-2">
										<div className="relative w-full mb-8">
											<Input
												label="title"
												name='title'
												type="text"
												value={values.title}
												onChange={handleChange}
												onBlur={handleBlur}
												required
											/>
											{((isError && errors?.title) || message?.list?.title) && (
												<span className='err truncate max-w-full'>{errors?.title ? errors.title : message.list.title}</span>
											)}
										</div>
									</div>
									<div className="w-full px-2">
										<div className="relative w-full mb-8">
											<Textarea
												label="description"
												name='description'
												value={values.description}
												onChange={handleChange}
												onBlur={handleBlur}
											/>
											{((isError && errors?.description) || message?.list?.description) && (
												<span className='err truncate max-w-full'>{errors?.description ? errors.description : message.list.description}</span>
											)}
										</div>
									</div>
									<div className='flex justify-end'>
										<div className='w-full px-2 lg:w-6/12'>
											<Button
												type="submit"
												full="true"
												withLoader={isSubmitting}
											>
												Create
											</Button>
										</div>
									</div>
								</form>
							</div>
						</div>
												
						{(isError || message?.body) && (
							<div className="mt-4 w-full">
								<Feedback state={isError ? 'error' : message?.type} message={title || message.body} />
							</div>
						)}
						
						<div className='mt-2'>
							<Feedback state='warning' message="Consider: You can't change this information later. It will be used as a contract details if you agree on quote" />
						</div>
					</div>
				</div>
			</div>
		</WithTransition>
	);

};
export default CreateQuote;

CreateQuote.auth = true;
CreateQuote.layout = Admin;
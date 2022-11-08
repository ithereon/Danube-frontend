import React, {useState, useEffect, useCallback} from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import Link from 'next/link';
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
import CardProfile from '../../../components/Cards/CardProfile';
import StyledModal from '../../../components/UI/styledModal';
import { BorderButton } from '../../../components/UI/borderButton';
import Textarea from '../../../components/UI/textarea';
import StyledLabel from '../../../components/UI/styledLabel';
import SelectableList from '../../../components/lists/selectableList';
import SelectableListItem from '../../../components/lists/SelectableListItem';

const EditEOI = ({userData, token, role}) => {
	const router = useRouter();
	const {id} = router.query;
	const [message, setMessage] = useState();
	const [businessID, setBusinessID] = useState();
	const [selectedBusiness, setSelectedBusiness] = useState();
	const [rfqID, setRFQID] = useState();
	const [open, setOpen] = useState(false);
	const [searchKey, setSearchKey] = useState('');

	useEffect(() => {
		if(!id){
			router.back();
		}
	}, [id]);

	useEffect(() => {
		const getEOI = async () => {
			const res = await requestWithTokenAsync(
				'get',
				`/eoi/${id}/`,
				token
			);
			if(res?.data?.id){
				const business = res.data.business;
				const propert = {
					business_name: business.business_name,
					website: business.website.replace('https://',''),
					vat: business.vat,
					address_1: business.address_1,
					address_2: business.address_2,
					town: business.town,
					city: business.city,
					county: business.county,
					postcode: business.postcode,
				};
				Object.keys(propert).forEach(key => {
					if (propert[key] === null || propert[key] === '') {
						delete propert[key];
					}
				});
				formik.setValues({
					comment: res.data.comment,
					business: business.id
				});
				setSelectedBusiness(propert);
				setBusinessID(business.id);
				setRFQID(res.data.rfq.id);
			}
		};
		getEOI();
	}, []);

	const formik = useFormik({
		initialValues: {
			comment: '',
			business: ''
		},
		validationSchema: Yup.object({
			comment: Yup.string().required(),
			business: Yup.string().required()
		}),
		onSubmit: async (values) => {
			const res = await requestWithTokenAsync(
				'put',
				`/eoi/${id}/`,
				token,
				{
					rfq: rfqID,
					...values
				}
			);
			if(res?.data?.id){
				setMessage({
					body: `You have updated your expression of interest with ID of ${res.data.id}`,
					type: 'success'
				});
				setTimeout(() => {
					router.push(`/${role}/EOI?id=${id}`);                    
				}, 500);
			}else{
				setMessage({
					body: 'Something went wrong',
					type: 'error',
					list: res?.error?.response?.data
				});
			}
		},
	});

	const handleModalToggle = useCallback(() => {
		setOpen(prev=>(!prev));
	},[]);

	const searchHandler = useCallback(async (keyword) => {
		setSearchKey(keyword);
	},[]);

	const {
		isError,
		title,
		errors,
	} = useForm(formik);
	
	const {
		values, handleChange, handleBlur, 
		handleSubmit, isSubmitting, setFieldValue
	} = formik;

	return (
		<WithTransition>
			<StyledModal
				open={open}
				onClose={handleModalToggle}
				aria-labelledby="Choose business"
				closebutton="true"
			>
				<SelectableList
					title="Select the business"
					token={token}
					listEndpoint={'/business_details/'}
					endpointParams={`user=${userData.id}&search=${searchKey}`}
					onSearch={searchHandler}
					listItem={(item)=>(
						<SelectableListItem
							item={{
								title: item.business_name,
								subTitle: item.main_trade,
								id: item.id,
								property: {
									postcode: item.postcode
								}
							}}
							group="businesses"
							shortTitle="true"
							isSelected={item.id === businessID}
							onSelect={e=>{
								const isOn = e.target.value;
								if(isOn){
									const business = {
										business_name: item.business_name,
										address_1: item.address_1,
										address_2: item.address_2,
										town: item.town,
										city: item.city,
										county: item.county,
										postcode: item.postcode,
										website: item.website.replace('https://',''),
										vat: item.vat
									};
									Object.keys(business).forEach(key => {
										if (business[key] === null || business[key] === '') {
											delete business[key];
										}
									});
									setSelectedBusiness(business);
									setBusinessID(item.id);
									setFieldValue('business', item.id);
									setTimeout(() => {
										handleModalToggle();
									}, 500);
								}
							}}
						/>
					)}
				/>
			</StyledModal>
			<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-start'>
				<SubHeader>
					update expression of interest
				</SubHeader>
				<div className="w-full lg:w-4/12 px-4 mb-4 lg:mb-0">
					<div className='flex flex-col justify-between'>
						<div className='flex-1'>
							<CardProfile 
								user={userData}
								noImage={true}
								customTitle='Business owner'
								align='text-left'
							/>
						</div>
					</div>
				</div>
				<div className='w-full lg:w-8/12 px-4'>
					<div className='flex flex-col'>
						<div className="w-full relative flex flex-col min-w-0 px-4 break-words h-full shadow-lg rounded-lg bg-white border-0">
							<div className="flex-auto px-2 py-6">
								<form noValidate onSubmit={handleSubmit}>
									<div className='flex justify-between items-start'>
										<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize mb-6 px-2">
                                            Express interest in RFQ
											<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
										</h2>
										<Link href={`/${role}/RFQ?id=${id}`}>
											<a className='indigo-link'>
                                                view RFQ
											</a>
										</Link>
									</div>
									<div className="w-full px-2">
										<div className="relative w-full mb-8">
											<Textarea
												label="your comment"
												name='comment'
												placeholder="Your comment for customer"
												type="text"
												value={values.comment}
												onChange={handleChange}
												onBlur={handleBlur}
												required
											/>
											{((isError && errors?.comment) || message?.list?.comment) && (
												<span className='err truncate max-w-full'>{errors?.comment ? errors.comment : message.list.comment}</span>
											)}
										</div>
									</div>
									<div className="w-full px-2">
										<div className='mb-8'>
											<div className='flex justify-between'>
												<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
													Business <span className='text-red-400 px-1 font-light absolute top-0 left-auto text-base'>*</span>
													<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
												</h2>
												<input 
													type="hidden" 
													name="business" 
													// value={values.business}
													onChange={handleChange}
													onBlur={handleBlur}
												/>
												<BorderButton
													type="button"
													clicked={()=>setOpen(true)}
													colorStyles='text-blue-500 border-blue-500 hover:bg-blue-500 active:bg-blue-600 focus:shadow-blue-600'
												>
													{selectedBusiness ? 'Change business' : 'Select business'}
												</BorderButton>
											</div>
											<div className='relative'>
												{((isError && errors?.business) || message?.list?.business) && (
													<span className='err truncate max-w-full'>{errors?.business ? errors.business : message.list.business}</span>
												)}
											</div>
										</div>
										{selectedBusiness && (
											<ul className='mb-4 flex flex-wrap mt-2 border p-3 rounded'>
												{Object.entries(selectedBusiness).map(item=>(
													<li className="my-1 text-slate-600 capitalize text-sm flex items-center w-full px-2 lg:w-6/12" key={item[0]}>
														{item[0] === 'website' ? (
															<Link href={item[1]}>
																<a className='indigo-link lowercase'>
																	<StyledLabel htmlFor={item[0]} label={item[0].replace(/_/g,' ')+':'} sronly="true" />
																	<span id={item[0]}>
																		<i className='fas fa-earth inline-block mr-1 text-slate-500' />{item[1]}
																	</span>
																</a>
															</Link>
														) : (
															<>
																<StyledLabel htmlFor={item[0]} label={item[0].replace(/_/g,' ')+':'} />
																<span id={item[0]} className='block mb-2 pl-1'>{item[1]}</span>
															</>
														)}
													</li>
												))}
											</ul>

										)}
									</div>
									<div className='flex justify-end'>
										<div className='w-full px-2 lg:w-6/12'>
											<Button
												type="submit"
												full="true"
												withLoader={isSubmitting}
											>
												Submit
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
					</div>
				</div>
			</div>
		</WithTransition>
	);

};
export default EditEOI;

EditEOI.auth = true;
EditEOI.layout = Admin;
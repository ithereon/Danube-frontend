import React, {useEffect, useState, useCallback} from 'react';
import {useRouter} from 'next/dist/client/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { requestWithTokenAsync } from '../../../lib/axios';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import Button from '../../../components/UI/button';
import Input from '../../../components/UI/input';
import { SubHeader } from '../../../components/subHeader';
import useForm from '../../../lib/hooks/useForm';
import Feedback from '../../../components/UI/feedback';
import StyledLabel from '../../../components/UI/styledLabel';
import { BorderButton } from '../../../components/UI/borderButton';
import ListItem from '../../../components/lists/listItem';
import StyledModal from '../../../components/UI/styledModal';
import Textarea from '../../../components/UI/textarea';
import Link from 'next/link';
import DetailsCard from '../../../components/Cards/detailsCard';
import StyledSelect from '../../../components/UI/styledSelect';
import PaymentFields from '../../../components/paymentFields';

const UpdateQuote = ({role, token}) => {
	const router = useRouter();
	const {id} = router.query;
	const [isDeleting, setIsDeleting] = useState(false);
	const [message, setMessage] = useState();
	const [costsErrors, setCostsErrors] = useState();
	const [costScheme, setCostScheme] = useState();
	const [selectedProperty, setSelectedProperty] = useState();
	const [selectedBusiness, setSelectedBusiness] = useState();
	const [quote, setQuote] = useState();
	const [items, setItems] = useState();
	const [itemModal, setItemModal] = useState({state: false});
	const [deleteModal, setDeleteModal] = useState({state: false});

	useEffect(()=>{
		setCostScheme(Yup.object({
			discount_type: Yup.string()
				.oneOf(['percent', 'amount'])
				.required('required'),
			discount: Yup.number('must be a number')
				.when('discount_type', {
					is: (discount_type)=> {
						return discount_type === 'percent';
					},
					then: Yup.number('must be a number')
						.positive('must be positive number')
						.min(0, 'must be more than 0')
						.max(100, 'must be less than 100'),
					otherwise: Yup.number('must be a number')
						.positive('must be positive number')
						.min(0, 'must be more than 0')
						.max(quote?.costs?.subtotal ? quote.costs.subtotal : 0, 'must not be more than subtotal'),
				}),
			vat: Yup.number('must be a number')
				.positive('must be positive number')
				.min(0, 'must be more than 0')
				.max(100, 'must be less than 100'),
			first_payment: Yup.number('must be a number')
				.positive('must be positive number')
				.min(0, 'must be more or equal to 0')
				.max(quote?.costs?.subtotal ? quote.costs.subtotal : 0, 'must not be more than subtotal'),
		}));
	},[quote]);

	const getData = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/contracts/${id}/`,
			token
		);
		if(res?.data?.id){
			// can only access edit page in draft mode
			if(res.data.status !== 'DRAFT'){
				router.push(`/${role}/quote/manage`);
			}else{

				const propertyData = res.data.property_obj;
				const propert = {
					address_1: propertyData.address_1,
					address_2: propertyData.address_2,
					town: propertyData.town,
					city: propertyData.city,
					county: propertyData.county,
					postcode: propertyData.postcode,
					profile: {
						name: res.data.owner_name,
						surname: res.data.user?.last_name || '',
						title: res.data.user?.title || ''
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
					vat: businessData.vat,
					address_1: businessData.address_1,
					address_2: businessData.address_2,
					town: businessData.town,
					city: businessData.city,
					county: businessData.county,
					postcode: businessData.postcode,
					profile: {
						name: res.data.business_name,
						surname: res.data.user?.last_name || '',
						title: res.data.user?.title || ''
					}
				};
				Object.keys(business).forEach(key => {
					if (business[key] === null || business[key] === '') {
						delete business[key];
					}
				});
				setSelectedBusiness(business);

				setQuote({
					id: res.data.id,
					costs: {
						subtotal: res.data.total_cost,
						discount: res.data.discount,
						discount_amount: res.data.discount_amount,
						subtotal_after_discount: res.data.subtotal_after_discount,
						vat: res.data.vat,
						vat_amount: res.data.vat_amount,
						total_to_pay: res.data.total,
						first_payment_amount: res.data.first_payment_amount,
						balance_to_pay: res.data.total_after_first_payment,
					},
					discount_symbol: res.data.discount_type === 1 ? '%' : '£',
					title: res.data.title,
					description: res.data.description,
					created_at: res.data.created_at,
					status: res.data.status.toLowerCase()
				});
				costsFormik.setFieldValue('first_payment', res.data.first_payment_amount || 0);
				costsFormik.setFieldValue('vat', res.data.vat || 0);
				costsFormik.setFieldValue('discount_type', res.data.discount_type === 1 ? 'percent' : 'amount');
				costsFormik.setFieldValue('discount', res.data.discount || 0);
				setItems(res.data.work_items);
			}
		}
	},[]);

	useEffect(()=>{
		if(id){
			getData();
		}else{
			router.push(`/${role}/quote/manage`);
		}
	},[]);

	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
			price: '',
		},
		validationSchema: Yup.object({
			title: Yup.string().required('This field may not be blank.'),
			description: Yup.string(),
			price: Yup.string().required('This field may not be blank.'),
		}),
		onSubmit: async (values, {resetForm}) => {
			const res = await requestWithTokenAsync(
				'post',
				'/work_items/',
				token,
				{
					...values,
					contract: quote.id
				}
			);
			if(res?.data?.id){
				closeItemsModal();
				getData();
				resetForm();
			}else{
				setMessage({
					body: 'Something went wrong',
					status: 'error',
					list: res?.error?.response?.data
				});
			}
		},
	});

	const {
		isError,
		errors,
		title
	} = useForm(formik);
	
	const {
		values, handleChange, handleBlur, 
		handleSubmit, isSubmitting
	} = formik;

	const costsFormik = useFormik({
		initialValues: {
			discount_type: 'percent',
			discount: 0,
			vat: 0,
			first_payment: 0
		},
		validationSchema: costScheme,
		onSubmit: async (values) => {
			const res = await requestWithTokenAsync(
				'post',
				`/contracts/${id}/costs/`,
				token,
				{
					discount_type: values.discount_type === 'percent' ? 1 : 2,
					discount: parseFloat(values.discount),
					vat: parseFloat(values.vat),
					first_payment: parseFloat(values.first_payment)
				}
			);
			if(res?.data?.id){
				getData();
				setCostsErrors({
					body: 'Quote saved successfully',
					type: 'success'
				});
				setTimeout(() => {
					router.push(`/${role}/quote?id=${id}`);
				}, 500);
			}else{
				setCostsErrors({
					body: 'Something went wrong',
					type: 'error',
					list: res?.error?.response?.data
				});
			}
		},
	});

	const {
		isError: isCostError,
		errors: costFormikErrors,
	} = useForm(costsFormik);

	const closeItemsModal = () => {
		setItemModal(prev=>(
			{
				...prev, 
				state: false
			}
		));
		formik.setErrors({});
		formik.setTouched({}, false);
		formik.setValues({});
		setMessage({});
	};

	const deleteWorkItem = async(itemID) => {
		const res = await requestWithTokenAsync(
			'delete',
			`/work_items/${itemID}/`,
			token
		);
		if(res?.data === ''){
			getData();
		}
	};

	return (
		<WithTransition>
			<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-start'>
				<SubHeader>
					Quote
				</SubHeader>
				<div className="w-full lg:w-4/12 px-4 mb-4 mt-4 order-2 lg:order-1 lg:mt-0 lg:mb-0">
					<div className="w-full relative flex flex-col min-w-0 p-6 break-words bg-white shadow-xl rounded-lg border-0">
						<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
                            Customer Property
							<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
						</h2>
						{selectedProperty && (
							<ul>
								{Object.entries(selectedProperty).map(item=>{
									if(item[0] === 'profile'){
										if(item[1]?.name){
											return (
												<div className='bg-slate-50 border p-4 rounded-lg' key={item[0]}>
													<StyledLabel label="customer" htmlFor="customer_info" sronly="true" />
													<div className='flex items-center'>
														<span className="w-10 h-10 text-base text-neutral-700 bg-slate-200 inline-flex items-center justify-center rounded-full mr-2">
															<i className="fa-solid fa-user"></i>
														</span>
														<p id="customer_info" className='capitalize text-xs font-medium max-w-full text-center'>
															{`${item[1].name} ${item[1].surname} ${item[1].title && '('}${item[1].title}${item[1].title && ')'}`}
														</p>
													</div>
												</div>
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
										return <hr className="mb-2 mt-1 border-b-1 border-slate-300 w-full" key={item[0]} />;
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
				<div className='w-full order-1 lg:order-2 lg:w-8/12'>
					{quote && (
						<DetailsCard
							title={quote.title}
							id={quote.id}
							date={quote.created_at}
							status={quote.status}
							data={Boolean(quote.id)}
						>
							{quote.description && (
								<p className='text-sm text-slate-600'>
									{quote.description}
								</p>
							)}
							<div className="flex-auto pt-6">
								<div className='w-full flex justify-between items-top pb-8'>
									<h3 className="relative text-slate-600 text-base font-medium leading-normal capitalize">
									work items <span className='text-red-400 px-1 font-light absolute top-0 left-auto text-base'>*</span>
										<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
									</h3>
									<div className='-mr-1'>
										<BorderButton
											type="button"
											clicked={()=>setItemModal({state: true})}
											colorStyles='text-blue-500 border-blue-500 hover:bg-blue-500 active:bg-blue-600 focus:shadow-blue-600'

										>
											Add Item
										</BorderButton>
									</div>
								</div>
								{items?.map(item=>(
									<div className='w-full inline-block align-top' key={item.id}>
										<ListItem
											key={item.id}
											item={{
												title: item.title,
												subTitle: `£${item.price}`,
												id: item.id
											}}
											comment={item.description}
											shortTitle="true"
											actions={
												<ul>
													<li>
														<button 
															className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
															onClick={()=>setDeleteModal({state: true, id: item.id})}
														>
															delete
														</button>
													</li>
												</ul>
											}
										/>
									</div>
								))}
								<form 
									noValidate 
									// className='justify-between items-end mt-4 flex w-full'
									onSubmit={costsFormik.handleSubmit}
								>
									<h3 className="relative text-slate-600 text-base font-medium leading-normal capitalize my-8">
										calculation parameters
										<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
									</h3>
									<div className='flex flex-wrap items-start'>
										<div className="relative w-full mb-8 flex flex-wrap items-top lg:w-1/2 lg:pr-2">
											<div className='w-full'>
												<StyledLabel label="discount:" />
											</div>
											<div>
												<input 
													type="hidden"
													name="discount_type"
													value={costsFormik.values.title}
													onChange={costsFormik.handleChange}
													onBlur={costsFormik.handleBlur}
												/>
												<StyledSelect
													name="discount_type"
													options={[{value: 'percent', name: '%'}, {value: 'amount', name: '£'}]}
													value={costsFormik.values.discount_type}
													onChange={(e)=>costsFormik.setFieldValue('discount_type',e.target.value)}
												/>
												{((isCostError && costFormikErrors?.discount_type) || costsErrors?.list?.discount_type) && (
													<span className='err truncate max-w-full'>{costFormikErrors?.discount_type ? costFormikErrors.discount_type : costsErrors.list.discount_type}</span>
												)}
											</div>
											<div className='flex-1 ml-2'>
												<Input
													placeholder="discount"
													name='discount'
													type="text"
													value={costsFormik.values.discount}
													onChange={costsFormik.handleChange}
													onBlur={costsFormik.handleBlur}
												/>
												{((isCostError && costFormikErrors?.discount) || costsErrors?.list?.discount) && (
													<span className='err truncate max-w-full'>{costFormikErrors?.discount ? costFormikErrors.discount : costsErrors.list.discount}</span>
												)}
											</div>
										</div>
										<div className="relative w-full mb-8 lg:w-1/2 lg:pl-2">
											<Input
												label="vat (%):"
												placeholder="vat (%)"
												name='vat'
												type="text"
												value={costsFormik.values.vat}
												onChange={costsFormik.handleChange}
												onBlur={costsFormik.handleBlur}
											/>
											{((isCostError && costFormikErrors?.vat) || costsErrors?.list?.vat) && (
												<span className='err truncate max-w-full'>{costFormikErrors?.vat ? costFormikErrors.vat : costsErrors.list.vat}</span>
											)}
										</div>
										<div className="relative w-full mb-8 lg:w-1/2 lg:pr-2">
											<Input
												label="first payment (£):"
												placeholder="first payment (£)"
												name='first_payment'
												type="text"
												value={costsFormik.values.first_payment}
												onChange={costsFormik.handleChange}
												onBlur={costsFormik.handleBlur}
											/>
											{((isCostError && costFormikErrors?.first_payment) || costsErrors?.list?.first_payment) && (
												<span className='err truncate max-w-full'>{costFormikErrors?.first_payment ? costFormikErrors.first_payment : costsErrors.list.first_payment}</span>
											)}
										</div>
									</div>
									<PaymentFields
										data={quote.costs}
										discount_symbol={quote.discount_symbol}
									/>
									<div className='flex w-full justify-end mt-2'>
										{quote.status === 'draft' && (
											<>
												<Button
													type="submit"
													withLoader={costsFormik.isSubmitting}
												>
													Save
												</Button>
											</>
										)}
									</div>
								</form>
							</div>
						</DetailsCard>
					)}

					{(costsErrors?.body && costsErrors?.type) && (
						<div className="mt-4 px-4 w-full">
							<Feedback state={costsErrors.type} message={costsErrors.body} />
						</div>
					)}

					{(message?.body && message?.status) && (
						<div className="mt-4 px-4 w-full">
							<Feedback state={message.status} message={message.body} />
						</div>
					)}
				</div>
			</div>

			{/* work item modal */}
			<StyledModal
				open={itemModal.state}
				onClose={closeItemsModal}
				closebutton="true"
			>
				<div className='w-full max-w-[500px]'>
					<h3 className="relative text-slate-600 text-base font-semibold leading-normal capitalize px-4">
						Create work item
						<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
					</h3>
					<form noValidate onSubmit={handleSubmit}>
						<div className="flex flex-wrap px-2 pt-2">
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
								<div className="relative w-full mb-8">
									<Textarea
										label="description"
										name={'description'}
										type="text"
										value={values.description}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									{((isError && errors?.description) || message?.list?.description) && (
										<span className='err truncate max-w-full'>{errors?.description ? errors.description : message.list.description}</span>
									)}
								</div>
								<div className="relative w-full mb-8">
									<Input
										label="price"
										name={'price'}
										type="text"
										value={values.price}
										onChange={handleChange}
										onBlur={handleBlur}
										required
									/>
									{((isError && errors?.price) || message?.list?.price) && (
										<span className='err truncate max-w-full'>{errors?.price ? errors.price : message.list.price}</span>
									)}
								</div>
								<div className='justify-end flex'>
									<Button
										type="submit"
										withLoader={isSubmitting}
									>
									Submit
									</Button>
								</div>
							</div>
							{(isError || message?.body) && (
								<div className="mt-4 w-full">
									<Feedback state={isError ? 'error' : message?.type} message={title || message.body} />
								</div>
							)}
						</div>
					</form>
				</div>
			</StyledModal>
			{/* delete work item modal */}
			<StyledModal
				open={deleteModal.state}
				onClose={()=>setDeleteModal(prev=>({...prev, state: false}))}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<div className='max-w-[500px] px-2'>
					<p className='text-neutral-700'>
						{`Are you sure you want to delete work item with ID of ${deleteModal.id}?`}
					</p>
					<div className='flex items-center justify-between flex-wrap pt-8'>
						<BorderButton
							clicked={()=>setDeleteModal(prev=>({...prev, state: false}))}
							colorStyles='text-neutral-500 border-neutral-500 hover:bg-neutral-500 active:bg-neutral-600 focus:shadow-neutral-600'
						>
							Cancel
						</BorderButton>
						<BorderButton
							withLoader={isDeleting}
							clicked={()=>{
								setIsDeleting(true);
								deleteWorkItem(deleteModal.id);
								setDeleteModal(prev=>({...prev, state: false}));
								setIsDeleting(false);
							}}
							colorStyles='text-red-500 border-red-500 hover:bg-red-500 active:bg-red-600 focus:shadow-red-600'
						>
							Delete
						</BorderButton>
					</div>
				</div>
			</StyledModal>
		</WithTransition>
	);
};
export default UpdateQuote;

UpdateQuote.auth = true;
UpdateQuote.layout = Admin;
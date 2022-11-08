import React, {useState, useEffect, useCallback} from 'react';
import { useRouter } from 'next/router';
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
import CardProfile from '../../../components/Cards/CardProfile';
import StyledModal from '../../../components/UI/styledModal';
import { BorderButton } from '../../../components/UI/borderButton';
import Input from '../../../components/UI/input';
import Textarea from '../../../components/UI/textarea';
import StyledLabel from '../../../components/UI/styledLabel';
import SelectableList from '../../../components/lists/selectableList';
import SelectableListItem from '../../../components/lists/SelectableListItem';
import ListItem from '../../../components/lists/listItem';

const CreateRFQ = ({userData, token, role}) => {
	const router = useRouter();
	const {id} = router.query;
	const [message, setMessage] = useState();
	const [selectedProperty, setSelectedProperty] = useState();
	const [deleteModal, setDeleteModal] = useState({state: false, id: ''});
	const [isDeleting, setIsDeleting] = useState(false);
	const [itemModal, setItemModal] = useState({state: false});
	const [items, setItems] = useState();

	useEffect(()=>{
		if(id){
			const getData = async () => {
				const res = await requestWithTokenAsync(
					'get',
					`/rfq/${id}/`,
					token
				);
				if(res?.data?.id){
					const propertyData = res.data.property;
					const propert = {
						address_1: propertyData.address_1,
						address_2: propertyData.address_2,
						town: propertyData.town,
						city: propertyData.city,
						county: propertyData.county,
						postcode: propertyData.postcode
					};
					Object.keys(propert).forEach(key => {
						if (propert[key] === null || propert[key] === '') {
							delete propert[key];
						}
					});
					setSelectedProperty(propert);

					setItems(res.data.rfq_items);
				}
			};
			getData();
		}
	},[id]);

	const getRFQItems = async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/rfq/${id}/`,
			token
		);
		if(res?.data?.rfq_items){
			setItems(res.data.rfq_items);
		}
	};

	const deleteRFQitem = async (item_id) => {
		const res = await requestWithTokenAsync(
			'delete',
			`/rfq_items/${item_id}/`,
			token
		);
		if(res?.data === ''){
			getRFQItems();
		}
	};

	const closeItemsModal = () => {
		setItemModal(prev=>(
			{
				...prev, 
				state: false
			}
		));
		formik.setErrors({});
		formik.setValues({});
	};

	const formik = useFormik({
		initialValues: {
			area_of_work: '',
			brief_description: '',
			detailed_description: '',
			comments: ''
		},
		validationSchema: Yup.object({
			area_of_work: Yup.string().required('This field may not be blank.').max(30, 'Ensure this field has no more than 30 characters.'),
			brief_description: Yup.string().required('This field may not be blank.').max(200, 'Ensure this field has no more than 200 characters.'),
			detailed_description: Yup.string().required('This field may not be blank.'),
			comments: Yup.string()
		}),
		onSubmit: async (values, {setSubmitting, resetForm}) => {
			setSubmitting(true);
			const res = !itemModal?.item?.id ? 
				await requestWithTokenAsync(
					'post',
					'/rfq_items/',
					token,
					{ rfq: id, ...values }
				) : await requestWithTokenAsync(
					'put',
					`/rfq_items/${itemModal.item.id}/`,
					token,
					{ rfq: id, ...values }
				);
			if(res?.data?.id){
				closeItemsModal();
				getRFQItems();
				resetForm();
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
		errors,
		title
	} = useForm(formik);
	
	const {
		values, handleChange, handleBlur, 
		handleSubmit, isSubmitting
	} = formik;

	if(id){
		return (
			<WithTransition>
				<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-start'>
					<SubHeader>
					create RFQ
					</SubHeader>
					<div className="w-full lg:w-4/12 px-4 mb-4 lg:mb-0">
						<CardProfile 
							user={userData}
							noImage={true}
							customTitle='Property owner'
							align='text-left'
						/>
						<div className='mt-3 mb-6'>
							<Feedback state="information" message="Your contact information won't be shared to the marketplace" />
						</div>


						<div className="w-full relative flex flex-col min-w-0 p-6 break-words bg-white shadow-xl rounded-lg border-0">
							<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
                            Property address
								<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
							</h2>
							{selectedProperty && (
								<ul>
									{Object.entries(selectedProperty).map(item=>(
										<li className="my-1 text-slate-600 capitalize text-sm flex items-center" key={item[0]}>
											<StyledLabel htmlFor={item[0]} label={item[0].replace('_',' ')+':'} />
											<span id={item[0]} className='block mb-2 pl-1'>{item[1]}</span>
										</li>
									))}
								</ul>

							)}
						</div>
						<div className='mt-3 mb-6'>
							<Feedback state="information" message="Only postcode will be shared to the marketplace" />
						</div>
					</div>
					<div className='w-full lg:w-8/12 px-4 lg:px-0'>
						<div className="w-full relative flex flex-col min-w-0 px-4 break-words h-full shadow-lg rounded-lg bg-white border-0">
							<div className="flex-auto py-6">
								<div className='w-full flex justify-between items-top pb-8 px-2 lg:px-4'>
									<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
										RFQ items <span className='text-red-400 px-1 font-light absolute top-0 left-auto text-base'>*</span>
										<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
									</h2>
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
												title: item.area_of_work,
												id: item.id
											}}
											fields={{
												brief_description: item.brief_description,
												detailed_description: item.detailed_description,
												comment: item.comments
											}}
											actions={
												<ul>
													<li>
														<button 
															className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
															onClick={()=>{
																setItemModal({state: true, item: item});
																formik.setValues(item);
															}}
														>
															edit
														</button>
													</li>
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
								<div className={`${items?.length === 0 ? 'justify-between' : 'justify-end'} items-end px-2 mt-4 flex w-full lg:px-4`}>
									{items?.length === 0 && (
										<BorderButton
											type="button"
											clicked={()=>{
												router.push(`/${role}/RFQ/manage`);
											}}
											colorStyles='text-neutral-500 border-neutral-500 hover:bg-neutral-500 active:bg-neutral-600 focus:shadow-neutral-600'

										>
											Save draft
										</BorderButton>
									)}
									<Button
										type="button"
										clicked={()=>{
											router.push(`/${role}/RFQ/manage`);
										}}
										disabled={!items || items.length === 0}
									>
										Finish
									</Button>
								</div>
							</div>
						</div>
						<div className='mt-3 mb-6'>
							<Feedback 
								state="information" 
								message="Do not include any personal information, contact information or any other sensitive information" 
							/>
						</div>
					</div>
				</div>

				{/* RFQ item modal */}
				<StyledModal
					open={itemModal.state}
					onClose={closeItemsModal}
					closebutton="true"
				>
					<div className='w-full max-w-[500px]'>
						<h3 className="relative text-slate-600 text-base font-semibold leading-normal capitalize px-4">
							Create RFQ item
							<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
						</h3>
						<form noValidate onSubmit={handleSubmit}>
							<div className="flex flex-wrap px-2 pt-4">
								<div className="w-full lg:w-6/12 px-2">
									<div className="relative w-full mb-8">
										<Input
											label="area of work"
											name={'area_of_work'}
											type="text"
											value={values.area_of_work}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errors?.area_of_work) || message?.list?.area_of_work) && (
											<span className='err truncate max-w-full'>{errors?.area_of_work ? errors.area_of_work : message.list.area_of_work}</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-2">
									<div className="relative w-full mb-8">
										<Input
											label="brief description"
											name={'brief_description'}
											type="text"
											value={values.brief_description}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errors?.brief_description) || message?.list?.brief_description) && (
											<span className='err truncate max-w-full'>{errors?.brief_description ? errors.brief_description : message.list.brief_description}</span>
										)}
									</div>
								</div>
								<div className="w-full px-2">
									<div className="relative w-full mb-8">
										<Textarea
											label="detailed description"
											name={'detailed_description'}
											type="text"
											value={values.detailed_description}
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
										{((isError && errors?.detailed_description) || message?.list?.detailed_description) && (
											<span className='err truncate max-w-full'>{errors?.detailed_description ? errors.detailed_description : message.list.detailed_description}</span>
										)}
									</div>
								</div>
								<div className="w-full px-2">
									<div className="relative w-full mb-8">
										<Input
											label="additional comments"
											name={'comments'}
											type="text"
											value={values.comments}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{((isError && errors?.comments) || message?.list?.comments) && (
											<span className='err truncate max-w-full'>{errors?.comments ? errors.comments : message.list.comments}</span>
										)}
									</div>
								</div>
								<div className='flex justify-end w-full'>
									<Button
										type="submit"
										withLoader={isSubmitting}
									>
									Submit
									</Button>
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
				{/* delete RFQ item modal */}
				<StyledModal
					open={deleteModal.state}
					onClose={()=>setDeleteModal(prev=>({...prev, state: false}))}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<div className='max-w-[500px] px-2'>
						<p className='text-neutral-700'>
							{`Are you sure you want to delete RFQ item with ID of ${deleteModal.id}?`}
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
									deleteRFQitem(deleteModal.id);
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
	}


	return (
		<RFQcreation token={token} userData={userData} />
	);

};
export default CreateRFQ;

CreateRFQ.auth = true;
CreateRFQ.layout = Admin;


const RFQcreation = ({token, userData}) => {
	const router = useRouter();
	const [message, setMessage] = useState();
	const [selectedProperty, setSelectedProperty] = useState();
	const [propertyID, setPropertyID] = useState();
	const [open, setOpen] = useState(false);
	const [searchKey, setSearchKey] = useState('');

	const formik = useFormik({
		initialValues: {
			title: '',
			property: ''
		},
		validationSchema: Yup.object({
			title: Yup.string().required(),
			property: Yup.string().required()
		}),
		onSubmit: async (values) => {
			const res = await requestWithTokenAsync(
				'post',
				'/rfq/',
				token,
				{
					property: propertyID,
					...values
				}
			);
			if(res?.data?.id){
				setMessage({
					body: `RFQ has been created with ID of ${res.data.id}`,
					type: 'success'
				});
				router.push(`?id=${res?.data?.id}`);
			}else{
				setMessage({
					body: 'Something went wrong',
					type: 'error',
					list: res?.error?.response?.data
				});
			}
		},
	});

	const handleModalToggle = () => {
		setOpen(prev=>(!prev));
	};

	const {
		isError,
		title,
		errors,
	} = useForm(formik);
	
	const {
		values, handleChange, handleBlur, 
		handleSubmit, isSubmitting, setFieldValue
	} = formik;

	const searchHandler = useCallback(async (keyword) => {
		setSearchKey(keyword);
	},[]);
	

	return (
		<WithTransition>
			<StyledModal
				open={open}
				onClose={handleModalToggle}
				aria-labelledby="Choose property"
				closebutton="true"
			>
				<SelectableList
					title="Select the property"
					token={token}
					listEndpoint='/properties/'
					endpointParams={`search=${searchKey}`}
					onSearch={searchHandler}
					listItem={(item)=>(
						<SelectableListItem
							item={{
								title: item.address_1,
								id: item.id,
								property: {
									postcode: item.postcode
								}
							}}
							group="properties"
							isSelected={item.id === propertyID}
							onSelect={e=>{
								const isOn = e.target.value;
								if(isOn){
									const propert = {
										address_1: item.address_1,
										address_2: item.address_2,
										town: item.town,
										city: item.city,
										county: item.county,
										postcode: item.postcode
									};
									Object.keys(propert).forEach(key => {
										if (propert[key] === null || propert[key] === '') {
											delete propert[key];
										}
									});
									setSelectedProperty(propert);
									setPropertyID(item.id);
									setFieldValue('property', item.id);
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
					create RFQ
				</SubHeader>
				<div className="w-full lg:w-4/12 px-4 mb-4 lg:mb-0">
					<div className='flex flex-col justify-between h-full'>
						<div className='flex-1'>
							<CardProfile 
								user={userData}
								noImage={true}
								customTitle='Property owner'
								align='text-left'
							/>
						</div>
						<div className='mt-3 mb-6'>
							<Feedback state="information" message="Your contact information won't be shared to the marketplace" />
						</div>
					</div>
				</div>
				<div className='w-full lg:w-8/12 px-4'>
					<div className='flex flex-col'>
						<div className="w-full relative flex flex-col min-w-0 px-4 break-words h-full shadow-lg rounded-lg bg-white border-0">
							<div className="flex-auto px-2 py-6">
								<form noValidate onSubmit={handleSubmit}>
									<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize mb-6 px-2">
										RFQ details
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
										<div className='mb-8'>
											<div className='flex justify-between'>
												<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
													Property address <span className='text-red-400 px-1 font-light absolute top-0 left-auto text-base'>*</span>
													<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
												</h2>
												<input 
													type="hidden" 
													name="property" 
													value='' 
													onChange={handleChange}
													onBlur={handleBlur}
												/>
												<BorderButton
													type="button"
													clicked={()=>setOpen(true)}
													colorStyles='text-blue-500 border-blue-500 hover:bg-blue-500 active:bg-blue-600 focus:shadow-blue-600'
												>
													{selectedProperty ? 'Change property' : 'Select property'}
												</BorderButton>
											</div>
											<div className='relative'>
												{((isError && errors?.property) || message?.list?.property) && (
													<span className='err truncate max-w-full'>{errors?.property ? errors.property : message.list.property}</span>
												)}
											</div>
										</div>
										{selectedProperty && (
											<ul className='mb-4 flex flex-wrap mt-2 border p-3 rounded'>
												{Object.entries(selectedProperty).map(item=>(
													<li className="my-1 text-slate-600 capitalize text-sm flex items-center w-full px-2 lg:w-6/12" key={item[0]}>
														<StyledLabel htmlFor={item[0]} label={item[0]+':'} />
														<span id={item[0]} className='block mb-2 pl-1'>{item[1]}</span>
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
												Next
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
						<div className='mt-3 mb-6'>
							<Feedback 
								state="information" 
								message="Do not include any personal information, contact information or any other sensitive information" 
							/>
						</div>
					</div>
				</div>
			</div>
		</WithTransition>
	);

};
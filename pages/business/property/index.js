import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/dist/client/router';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../../components/subHeader';
import { requestWithTokenAsync } from '../../../lib/axios';
import { BorderButton } from '../../../components/UI/borderButton';
import StyledModal from '../../../components/UI/styledModal';
import DetailsCard from '../../../components/Cards/detailsCard';

const BusinessDetails = (props) => {
	const router = useRouter();
	const {id} = router.query;
	const [deleting, setDeleting] = useState(false);
	const [businessData,setBusinessData] = useState();
	const [open,setOpen] = useState({state: false, id: id});

	useEffect(() => {
		if(!id){
			router.push(`/${props.role}/property/manage`);
		}else{
			const fetchData = async () => {
				const res = await requestWithTokenAsync(
					'get',
					`/business_details/${id}/`,
					props.token
				);
				if(res?.data){
					const business = res.data;
					const modifiedBusinessData = {
						title: business.business_name,
						id: business.id,
						created_on: business.created_at,
						description: business.description,
						fields: {
							company_house_number: business.company_number,
							main_trade: business.main_trade,
							vat: business.vat,
							website: business.website,
							address_details: {
								address_1: business.address_1,
								address_2: business.address_2,
								town: business.town,
								city: business.city,
								county: business.county,
								postcode: business.postcode,
							}
						}
					};
					Object.keys(modifiedBusinessData).forEach(key => {
						if (modifiedBusinessData[key] === null || modifiedBusinessData[key] === '') {
							delete modifiedBusinessData[key];
						}else if(typeof modifiedBusinessData[key] === 'object'){
							Object.keys(modifiedBusinessData[key]).forEach(k => {
								if (modifiedBusinessData[key][k] === null || modifiedBusinessData[key][k] === '') {
									delete modifiedBusinessData[key][k];
								}else if(typeof modifiedBusinessData[key][k] === 'object'){
									Object.keys(modifiedBusinessData[key][k]).forEach(j => {
										if (modifiedBusinessData[key][k][j] === null || modifiedBusinessData[key][k][j] === '') {
											delete modifiedBusinessData[key][k][j];
										}
									});
								}
							});
						}
					});
					setBusinessData(modifiedBusinessData);
				}
			};
			fetchData();
		}
	}, []);

	const deleteHandler = async () => {
		setDeleting(true);
		const res = await requestWithTokenAsync(
			'delete',
			`/business_details/${open.id}/`,
			props.token
		);
		if(res?.data === ''){
			handleToggle();
			router.push(`/${props.role}/property/manage`);
		}
		setDeleting(false);
	};

	const handleToggle = () => {
		setOpen(prev=>({...prev, state: !prev.state}));
	};

	return (
		<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<StyledModal
					open={open.state}
					onClose={handleToggle}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<p className='text-neutral-700'>
						{`Are you sure you want to delete business with ID of ${open.id}?`}
					</p>
					<div className='flex items-center justify-between flex-wrap pt-8'>
						<BorderButton
							clicked={handleToggle}
							colorStyles='text-neutral-500 border-neutral-500 hover:bg-neutral-500 active:bg-neutral-600 focus:shadow-neutral-600'
						>
							Cancel
						</BorderButton>
						<BorderButton
							withLoader={deleting}
							clicked={deleteHandler}
							colorStyles='text-red-500 border-red-500 hover:bg-red-500 active:bg-red-600 focus:shadow-red-600'
						>
							Delete
						</BorderButton>
					</div>
				</StyledModal>
				<SubHeader>
                    business
				</SubHeader>
				{businessData && (
					<DetailsCard
						title={businessData.title}
						id={businessData.id}
						date={businessData.created_on}
						description={businessData.description}
						website={businessData.website}
						data={businessData.fields}
						editLink={`/${props.role}/property/edit?id=${id}`}
						onDelete={()=>setOpen({state: true, id: id})}
					/>
				)}
				{/* <div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<div className="flex-auto px-2 pb-10 pt-6 lg:px-10">
							{(!businessData && !addressData) ? <Loading /> : (
								<div className='flex flex-wrap'>
									<div className="w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4" />
									<div className="w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4 mb-6 flex flex-wrap items-center">
										<div className='ml-auto'>
											<ActionButtons
												editLink={`/${props.role}/property/edit?id=${id}`}
												onDelete={()=>setOpen({state: true, id: id})}
											/>
										</div>
									</div>
									<div className='w-full'>
										<div className='flex flex-wrap'>
											<h2 className="text-slate-600 text-base font-bold capitalize w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4 mb-4 flex flex-wrap items-start">
												Business data
												<span className='block w-full'>
													<hr className="border-b-2 border-emerald-300 w-10" />
												</span>
											</h2>
											<span className="block w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4" />
										</div>
										<dl className='flex flex-wrap mb-8'>
											{Object.entries(businessData).map(item=>(
												<div
													key={item[0]}
													className="w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4 mb-4 flex flex-wrap items-start"
												>
													<dt className='pr-2'>
														<StyledLabel label={item[0].replace('_',' ')}>
															{':'}
														</StyledLabel>
													</dt>
													<dd className='text-slate-500 mb-2 leading-4 text-sm'>
														{item[0] === 'created_on' ? normalDate(item[1]) : item[1]}
													</dd>
												</div>
											))}
											{Object.entries(businessData).length%2 !== 0 && (
												<div className="w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4" />
											)}
										</dl>
									</div>

									<div className='w-full'>
										<div className='flex flex-wrap'>
											<h2 className="text-slate-600 text-base font-bold capitalize w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4 mb-4 flex flex-wrap items-start">
												address details
												<span className='block w-full'>
													<hr className="border-b-2 border-emerald-300 w-10" />
												</span>
											</h2>
											<span className="block w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4" />
										</div>
										<dl className='flex flex-wrap'>
											{Object.entries(addressData).map(item=>(
												<div
													key={item[0]}
													className="w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4 mb-4 flex flex-wrap items-start"
												>
													<dt className='pr-2'>
														<StyledLabel label={item[0].replace('_',' ')}>
															{':'}
														</StyledLabel>
													</dt>
													<dd className='text-slate-500 mb-2 leading-4 text-sm'>
														{item[0] === 'created_on' ? normalDate(item[1]) : item[1]}
													</dd>
												</div>
											))}
											{Object.entries(addressData).length%2 !== 0 && (
												<div className="w-full lg:w-6/12 max-w-[500px] mx-auto px-2 md:px-4" />
											)}
										</dl>
									</div>
								</div>
							)}
						</div>
					</div>
				</div> */}
			</WithTransition>
		</div>
	);
};
export default BusinessDetails;

BusinessDetails.auth = true;
BusinessDetails.layout = Admin;
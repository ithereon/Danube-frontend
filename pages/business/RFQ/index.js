import React, {useCallback, useEffect, useState} from 'react';
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
import StyledLabel from '../../../components/UI/styledLabel';
import ListItem from '../../../components/lists/listItem';
import Feedback from '../../../components/UI/feedback';

const RFQDetails = (props) => {
	const router = useRouter();
	const {id} = router.query;
	const [deleting, setDeleting] = useState(false);
	const [RFQdata,setRFQdata] = useState();
	const [open,setOpen] = useState({state: false, id: id});
	// const [message, setMessage] = useState({});

	const fetchData = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/rfq_business/${id}/`,
			props.token
		);
		if(res?.data){
			const rfq = res.data.rfq;
			const modifiedEOIData = {
				title: rfq.title,
				id: res.data.id,
				created_on: rfq.created_at,
				status: res.data.status.toLowerCase(),
				property: {
					// address_1: rfq.property.address_1,
					// address_2: rfq.property.address_2,
					// city: rfq.property.city,
					// town: rfq.property.town,
					// county: rfq.property.county,
					owner: res.data.owner_name,
					postcode: rfq.property.postcode
				},
				fields: {},
				rfq_items: rfq.rfq_items,
				rfqID: rfq.id
			};
			Object.keys(modifiedEOIData).forEach(key => {
				if (modifiedEOIData[key] === null || modifiedEOIData[key] === '') {
					delete modifiedEOIData[key];
				}else if(typeof modifiedEOIData[key] === 'object'){
					Object.keys(modifiedEOIData[key]).forEach(k => {
						if (modifiedEOIData[key][k] === null || modifiedEOIData[key][k] === '') {
							delete modifiedEOIData[key][k];
						}else if(typeof modifiedEOIData[key][k] === 'object'){
							Object.keys(modifiedEOIData[key][k]).forEach(j => {
								if (modifiedEOIData[key][k][j] === null || modifiedEOIData[key][k][j] === '') {
									delete modifiedEOIData[key][k][j];
								}
							});
						}
					});
				}
			});
			setRFQdata(modifiedEOIData);
		}
	},[]);

	useEffect(() => {
		if(!id){
			router.push(`/${props.role}/RFQ/manage`);
		}else{
			fetchData();
		}
	}, []);

	const deleteHandler = async () => {
		setDeleting(true);
		const res = await requestWithTokenAsync(
			'post',
			`/rfq_business/${open.id}/decline/`,
			props.token
		);
		if(res?.data === 'RFQ request for business was declined.'){
			handleToggle();
			router.push(`/${props.role}/RFQ/manage`);
		}
		setDeleting(false);
	};

	const handleToggle = () => {
		setOpen(prev=>({...prev, state: !prev.state}));
	};

	return (
		<WithTransition>
			<div className='container mx-auto pb-8 mb-6 flex flex-wrap items-start'>
				<StyledModal
					open={open.state}
					onClose={handleToggle}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<p className='text-neutral-700'>
						{`Are you sure you want to decline RFQ with ID of ${open.id}?`}
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
							decline
						</BorderButton>
					</div>
				</StyledModal>
				<SubHeader>
                    RFQ
				</SubHeader>
				<div className="w-full lg:w-4/12 px-4 mb-4 lg:mb-0">
					<div className="w-full relative flex flex-col min-w-0 p-6 break-words bg-white shadow-xl rounded-lg border-0">
						<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
                            Property
							<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
						</h2>
						{RFQdata?.property && (
							<ul>
								{Object.entries(RFQdata.property).map(item=>(
									<li className="my-1 text-slate-600 capitalize text-sm flex items-center" key={item[0]}>
										<StyledLabel htmlFor={item[0]} label={item[0].replace('_',' ')+':'} />
										<span id={item[0]} className='block mb-2 pl-1'>{item[1]}</span>
									</li>
								))}
							</ul>
						)}
					</div>
					{(RFQdata?.status && RFQdata.status !== 'declined') && (
						<div className='mt-3 mb-6'>
							<Feedback state="information" message="Once you have agreement with the customer, more information will be provided" />
						</div>
					)}
				</div>
				<div className='w-full lg:w-8/12'>
					{RFQdata && (
						<DetailsCard
							title={RFQdata.title}
							id={RFQdata.id}
							date={RFQdata.created_on}
							status={RFQdata.status}
							description={RFQdata.description}
							website={RFQdata.website}
							data={RFQdata.fields}
							extraActions={
								<>
									{RFQdata.status === 'waiting' && (
										<>
											<BorderButton
												clicked={()=>router.push(`/${props.role}/EOI/create?id=${RFQdata.rfqID}`)}
												colorStyles='text-blue-500 border-blue-500 hover:bg-blue-500 active:bg-blue-600 focus:shadow-blue-600'
											>
												express interest
											</BorderButton>
											<div className={'inline-flex align-middle'}>
												<BorderButton
													clicked={()=>setOpen({state: true, id: id})}
													colorStyles='text-red-500 border-red-500 hover:bg-red-500 active:bg-red-600 focus:shadow-red-600'
													type='button'
												>
													<i className="fa-solid fa-ban"></i> decline
												</BorderButton>
											</div>
										</>
									)}
								</>
							}
						>
							{RFQdata?.rfq_items && (
								<div className='mb-4'>
									<StyledLabel label="RFQ items:" />
								</div>
							)}
							{RFQdata?.rfq_items?.map(item=>(
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
									/>
								</div>
							))}
						</DetailsCard>
					)}
				</div>
			</div>
		</WithTransition>
	);
};
export default RFQDetails;

RFQDetails.auth = true;
RFQDetails.layout = Admin;
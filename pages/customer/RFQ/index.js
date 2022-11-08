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
import CardProfile from '../../../components/Cards/CardProfile';
import Feedback from '../../../components/UI/feedback';

const RFQDetails = (props) => {
	const router = useRouter();
	const {id} = router.query;
	const [deleting, setDeleting] = useState(false);
	const [RFQdata,setRFQdata] = useState();
	const [open,setOpen] = useState({state: false, id: id});
	const [sendModal, setSendModal] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [isOnMarketplace, setIsOnMarketplace] = useState();
	const [message, setMessage] = useState({});

	const fetchData = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/rfq/${id}/`,
			props.token
		);
		if(res?.data){
			const rfq = res.data;
			const modifiedRFQData = {
				title: rfq.title,
				id: rfq.id,
				created_on: rfq.created_at,
				status: rfq.status.toLowerCase(),
				property: {
					address_1: rfq.property.address_1,
					address_2: rfq.property.address_2,
					city: rfq.property.city,
					town: rfq.property.town,
					county: rfq.property.county,
					postcode: rfq.property.postcode
				},
				fields: {},
				rfq_items: rfq.rfq_items
			};
			Object.keys(modifiedRFQData).forEach(key => {
				if (modifiedRFQData[key] === null || modifiedRFQData[key] === '') {
					delete modifiedRFQData[key];
				}else if(typeof modifiedRFQData[key] === 'object'){
					Object.keys(modifiedRFQData[key]).forEach(k => {
						if (modifiedRFQData[key][k] === null || modifiedRFQData[key][k] === '') {
							delete modifiedRFQData[key][k];
						}else if(typeof modifiedRFQData[key][k] === 'object'){
							Object.keys(modifiedRFQData[key][k]).forEach(j => {
								if (modifiedRFQData[key][k][j] === null || modifiedRFQData[key][k][j] === '') {
									delete modifiedRFQData[key][k][j];
								}
							});
						}
					});
				}
			});
			setRFQdata(modifiedRFQData);
		}
	},[]);

	useEffect(() => {
		if(!id){
			router.back();
		}else{
			fetchData();
		}
	}, []);

	const deleteHandler = async () => {
		setDeleting(true);
		const res = await requestWithTokenAsync(
			'delete',
			`/rfq/${open.id}/`,
			props.token
		);
		if(res?.data === ''){
			handleToggle();
			router.push(`/${props.role}/RFQ/manage`);
		}
		setDeleting(false);
	};

	const sendToMarketplace = async (RFQid) => {
		setIsSending(true);
		const res = await requestWithTokenAsync(
			'post',
			`/rfq/${RFQid}/send/`,
			props.token
		);
		if(res?.data){
			setIsOnMarketplace(true);
			fetchData();
			setMessage({
				type: 'success',
				body: `RFQ with ID ${RFQid} has been sent to marketplace`
			});
		}else if(res?.error?.response?.data){
			setMessage({
				type: 'error',
				body: res.error.response.data[0]
			});
		}else{
			setMessage({
				type: 'error',
				body: 'Something went wrong'
			});
		}
		setIsSending(false);
	};

	const handleToggle = () => {
		setOpen(prev=>({...prev, state: !prev.state}));
	};

	const handleSendModalToggle = () => {
		setSendModal(prev=>(!prev));
		setMessage({});
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
						{`Are you sure you want to delete RFQ with ID of ${open.id}?`}
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
				<StyledModal
					open={sendModal}
					onClose={handleSendModalToggle}
					aria-labelledby="send RFQ"
					aria-describedby="send RFQ to marketplace or business"
					closebutton="true"
				>
						
					<h4 className='text-neutral-700 mb-2 text-center'>
						Send to
					</h4>
					<div className='flex flex-col items-center pt-4 px-2 w-[400px] max-w-full flex-wrap 3xs:flex-nowrap md:px-4'>
						<div className='mb-2'>
							<BorderButton
								clicked={()=>router.push(`/${props.role}/RFQ/send?id=${id}`)}
								colorStyles='text-slate-700 border-slate-700 hover:bg-slate-700 active:bg-slate-600 focus:shadow-slate-600'
							>
								Business
							</BorderButton>
						</div>
						<BorderButton
							withLoader={isSending}
							clicked={()=>sendToMarketplace(id)}
							colorStyles='text-emerald-500 border-emerald-500 hover:bg-emerald-500 active:bg-emerald-600 focus:shadow-emerald-600'
							disabled={isOnMarketplace}
						>
							Marketplace
						</BorderButton>
						{message?.body && (
							<div className="mt-4 w-full">
								<Feedback state={message?.type || 'error'} message={message.body} />
							</div>
						)}
					</div>
				</StyledModal>
				<SubHeader>
                    RFQ
				</SubHeader>
				<div className="w-full lg:w-4/12 px-4 mb-4 lg:mb-0">
					<CardProfile
						user={props.userData}
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
					<div className='mt-3 mb-6'>
						<Feedback state="information" message="Only postcode will be shared to the marketplace" />
					</div>
				</div>
				<div className='w-full lg:w-8/12'>
					{RFQdata && (
						<DetailsCard
							title={RFQdata.title}
							id={RFQdata.id}
							date={RFQdata.created_on}
							description={RFQdata.description}
							website={RFQdata.website}
							data={RFQdata.fields}
							status={RFQdata.status}
							// editLink={`/${props.role}/RFQ/edit?id=${id}`}
							// onDelete={()=>setOpen({state: true, id: id})}
							extraActions={
								<React.Fragment>
									<BorderButton
										clicked={()=>setSendModal(true)}
										colorStyles='text-blue-500 border-blue-500 hover:bg-blue-500 active:bg-blue-600 focus:shadow-blue-600'
									>
                                        send
									</BorderButton>
									{['draft', 'saved', 'open', 'private'].includes(RFQdata.status) && (
										<React.Fragment>
											<div className='inline-flex align-middle'>
												<BorderButton
													clicked={()=>{
														router.push(`/${props.role}/RFQ/edit?id=${id}`);
													}}
													colorStyles='text-emerald-500 border-emerald-500 hover:bg-emerald-500 active:bg-emerald-600 focus:shadow-emerald-600'
													type='button'
												>
													<i className="fa-solid fa-pen-to-square" /> edit
												</BorderButton>
											</div>
											<div className={'inline-flex align-middle'}>
												<BorderButton
													clicked={()=>setOpen({state: true, id: id})}
													colorStyles='text-red-500 border-red-500 hover:bg-red-500 active:bg-red-600 focus:shadow-red-600'
													type='button'
												>
													<i className="fa-solid fa-trash"></i> delete
												</BorderButton>
											</div>
										</React.Fragment>
									)}
								</React.Fragment>
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
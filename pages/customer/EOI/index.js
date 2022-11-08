import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/dist/client/router';
import Link from 'next/link';
import { requestWithTokenAsync } from '../../../lib/axios';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../../components/subHeader';
import { BorderButton } from '../../../components/UI/borderButton';
import StyledModal from '../../../components/UI/styledModal';
import DetailsCard from '../../../components/Cards/detailsCard';
import StyledLabel from '../../../components/UI/styledLabel';
import ListItem from '../../../components/lists/listItem';
import Feedback from '../../../components/UI/feedback';
import InputEmojiWithRef from 'react-input-emoji';

const EOIDetails = (props) => {
	const router = useRouter();
	const {id} = router.query;
	const [deleting, setDeleting] = useState(false);
	const [EOIData,setEOIData] = useState();
	const [open,setOpen] = useState({state: false, id: id});
	const [message, setMessage] = useState('');
	const [chatExists, setChatExists] = useState({state: true});

	const fetchData = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/eoi/${id}/`,
			props.token
		);
		if(res?.data){
			const rfq = res.data.rfq;
			const modifiedEOIData = {
				title: rfq.title ,
				id: res.data.id,
				created_on: rfq.created_at,
				comment: res.data.comment,
				status: res.data.status.toLowerCase(),
				username: res.data.business_user_name,
				property: {
					address_1: rfq.property.address_1,
					address_2: rfq.property.address_2,
					city: rfq.property.city,
					town: rfq.property.town,
					county: rfq.property.county,
					postcode: rfq.property.postcode,
					id: rfq.property.id
				},
				business: {
					business_name: res.data.business.business_name,
					website: res.data.business.website.replace('https://',''),
					vat: res.data.business.vat,
					address_1: res.data.business.address_1,
					address_2: res.data.business.address_2,
					town: res.data.business.town,
					city: res.data.business.city,
					county: res.data.business.county,
					postcode: res.data.business.postcode,
					id: res.data.business.id,
					user: res.data.business.user
				},
				fields: {},
				rfq_items: rfq.rfq_items
			};
			Object.keys(modifiedEOIData).forEach(key => {
				if (modifiedEOIData[key] === null || modifiedEOIData[key] === '' || modifiedEOIData[key] === undefined) {
					delete modifiedEOIData[key];
				}else if(typeof modifiedEOIData[key] === 'object'){
					Object.keys(modifiedEOIData[key]).forEach(k => {
						if (modifiedEOIData[key][k] === null || modifiedEOIData[key][k] === '' || modifiedEOIData[key][k] === undefined) {
							delete modifiedEOIData[key][k];
						}else if(typeof modifiedEOIData[key][k] === 'object'){
							Object.keys(modifiedEOIData[key][k]).forEach(j => {
								if (modifiedEOIData[key][k][j] === null || modifiedEOIData[key][k][j] === '' || modifiedEOIData[key][k][j] === undefined) {
									delete modifiedEOIData[key][k][j];
								}
							});
						}
					});
				}
			});
			
			checkChatStatus(modifiedEOIData.business.user);
			setEOIData(modifiedEOIData);
		}
	},[]);

	useEffect(() => {
		if(!id){
			router.push(`/${props.role}/EOI/manage`);
		}else{
			fetchData();
		}
	}, []);

	const checkChatStatus = useCallback(async (user) => {
		const chatStatus = await requestWithTokenAsync(
			'get',
			`/chats/${user}/exists/`,
			props.token
		);
		if(chatStatus?.data?.is_exists){
			setChatExists({ 
				state:chatStatus?.data?.is_exists, 
				id: chatStatus.data.room
			});
		}else{
			setChatExists({state: false});
		}
	},[]);

	const deleteHandler = async () => {
		setDeleting(true);
		const res = await requestWithTokenAsync(
			'post',
			`/eoi/${open.id}/decline/`,
			props.token
		);
		if(res?.data === 'EOI request was declined.'){
			handleToggle();
			router.push(`/${props.role}/EOI/manage`);
		}
		setDeleting(false);
	};

	const handleToggle = () => {
		setOpen(prev=>({...prev, state: !prev.state}));
	};

	const createRoom = useCallback(async (user, eoi, message) => {
		const res = await requestWithTokenAsync(
			'post',
			'/chats/',
			props.token,
			{
				author_id: props.userData.id,
				participant_id: Number(user),
				message: message,
				eoi: Number(eoi)
			}
		);
		if(res?.data?.id){
			router.push(`/${props.role}/chat?room=${res.data.id}`);
		}
		
	},[]);

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
						{`Are you sure you want to decline RFQ interest with ID of ${open.id}?`}
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
							Decline
						</BorderButton>
					</div>
				</StyledModal>
				<SubHeader>
                    RFQ Interest
				</SubHeader>
				<div className="w-full lg:w-4/12 px-4 mb-4 order-2 mt-4 lg:mt-0 lg:order-1 lg:mb-0">
					{EOIData?.comment && (
						<div className={'flex flex-col text-sm text-slate-500 mb-4 bg-white shadow-xl rounded-lg border-0 w-full pb-4 lg:flex'}>
							<div className="relative flex items-center justify-between py-3 px-6 rounded-lg bg-slate-50 h-[4.5rem]">
								<div className='flex items-center'>
									<div className='relative flex flex-col justify-start items-center max-w-[4rem]'>
										<span className={'w-10 h-10 relative text-base text-neutral-700 bg-slate-300 inline-flex items-center justify-center rounded-full'}>
											<i className="fa-solid fa-user"></i>
										</span>
									</div>
									<h3 className="block ml-2 font-bold text-gray-600">
										{EOIData.username}
									</h3>
								</div>
							</div>
							<div className='flex-1 mt-4 px-6'>
								<div 
									className={'items-start relative flex flex-col'}
								>
									<div 
										className={'bg-blue-500 text-white relative max-w-xl px-4 py-2 rounded shadow'}
									>
										<span className="block">
											{EOIData.comment}
										</span>
									</div>
								</div>
								{!chatExists.state ? (
									<div className='mt-4 mr-4'>
										<div 
											className='w-full h-full flex items-center justify-between bg-white shadow rounded-lg'
											tabIndex={0}
										>
											<InputEmojiWithRef
												value={message}
												onChange={setMessage}
												cleanOnEnter
												onEnter={(e)=>createRoom(EOIData.business.user, EOIData.id, e)}
												placeholder="Type message"
												borderRadius={0}
												borderColor={'transparent'}
												height={20}
											/>
											<button type="button" className='h-full block pr-4 pl-2 flex-1' onClick={()=>createRoom(EOIData.business.user, EOIData.id, message)}>
												<span className='sr-only'>send</span>
												<i className="fa-solid fa-paper-plane text-slate-500 text-xl" />
											</button>
										</div>
									</div>
								) : (
									<>
										<div className='text-right' key={chatExists.id}>
											{console.log('chat id', chatExists.id)}
											<a href={`/${props.role}/chat?room=${chatExists.id}`} className="indigo-link mt-2 inline-block">
											Go to chat
											</a>
										</div>
									</>
								)}
							</div>
						</div>
					)}


					{EOIData?.business && (
						<div className="w-full relative flex flex-col min-w-0 p-6 mb-4 break-words bg-white shadow-xl rounded-lg border-0">
							<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
								{EOIData?.business?.business_name ? EOIData.business.business_name : 'Interested Business'}
								<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
							</h2>
							<ul>
								{Object.entries(EOIData.business).map(item=>{
									if (item[0] === 'business_name' || item[0] === 'id'){
										return null;
									}
									return (
										<li className="my-1 text-slate-600 capitalize text-sm flex items-center" key={item[0]}>
											<StyledLabel 
												htmlFor={item[0]} 
												label={item[0].replace('_',' ')+':'} 
												sronly={item[0] === 'website' ? 'true' : ''}
											/>
											{item[0] === 'website' ? (
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
											) : (
												<span 
													id={item[0]} 
													className='block mb-2 pl-1'
												>
													{item[1]}
												</span>
											)}
										</li>
									);
								})}
							</ul>
						</div>
					)}
					
					<div className="w-full relative flex flex-col min-w-0 p-6 break-words bg-white shadow-xl rounded-lg border-0">
						<h2 className="relative text-slate-600 text-lg font-semibold leading-normal capitalize">
                            Your Property
							<hr className="mb-2 mt-1 border-b-2 border-emerald-300 w-10" />
						</h2>
						{EOIData?.property && (
							<ul>
								{Object.entries(EOIData.property).map(item=>{
									if(item[0] === 'id'){
										return null;
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
					<div className='mt-3 mb-6'>
						<Feedback state="information" message="Only postcode is visible to business. Once you have agreement with them, more address information will be shared" />
					</div>
				</div>
				<div className='w-full order-1 lg:order-2 lg:w-8/12'>
					{EOIData && (
						<DetailsCard
							title={EOIData.username ? `${EOIData.username} is intereseted in "${EOIData.title}"` : EOIData.title}
							id={EOIData.id}
							date={EOIData.created_on}
							description={EOIData.description}
							website={EOIData.website}
							data={EOIData.fields}
							status={EOIData.status}
							// editLink={`/${props.role}/EOI/edit?id=${id}`}
							// onDelete={()=>setOpen({state: true, id: id})}
							extraActions={
								<>
									{(EOIData.status !== 'declined' && EOIData.status !== 'accepted') && (
										<>
											<BorderButton
												clicked={()=>router.push(`/${props.role}/quote/create?id=${id}`)}
												colorStyles='text-blue-500 border-blue-500 hover:bg-blue-500 active:bg-blue-600 focus:shadow-blue-600'
											>
												request quote
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

							{EOIData?.rfq_items && (
								<div className='mb-4'>
									<StyledLabel label="RFQ items:" />
								</div>
							)}
							{EOIData?.rfq_items?.map(item=>(
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
export default EOIDetails;

EOIDetails.auth = true;
EOIDetails.layout = Admin;
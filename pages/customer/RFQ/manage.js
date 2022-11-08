import React, {useCallback, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { requestWithTokenAsync } from '../../../lib/axios';
import { perPageLimit } from '../../../lib/constants';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../../components/subHeader';
import StyledModal from '../../../components/UI/styledModal';
import { BorderButton } from '../../../components/UI/borderButton';
import ListContainer from '../../../components/lists/listContainer';
import ListItem from '../../../components/lists/listItem';
import Feedback from '../../../components/UI/feedback';

const ManageRFQs = ({token, role}) => {
	const router = useRouter();
	const currentPath = router.pathname;
	const currentQuery = {...router.query};
	const {p = 1, search} = router.query;

	const [data,setData] = useState([]);
	const [count, setCount] = useState();
	const [message, setMessage] = useState();

	const [open, setOpen] = useState({state: false, id: ''});
	const [sendModal, setSendModal] = useState({state: false, id: ''});

	const [deleting, setDeleting] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isSending, setIsSending] = useState(false);
	const [isOnMarketplace, setIsOnMarketplace] = useState({state: '', id: ''});

	const fetchData = async (p, keyword) => {
		setLoading(true);
		const res = await requestWithTokenAsync(
			'get',
			`/rfq/?search=${keyword ? keyword : ''}&limit=${perPageLimit}&offset=${(Number(p)-1)*perPageLimit}`,
			token
		);
		if(res?.data?.results && res.data.results.length > 0){
			const modifiedData = res.data.results.map(item=>({
				title: item.title,
				status: item.status.toLowerCase(),
				id: item.id,
				property: item.property,
				rfq_items: item.rfq_items,
			}));
			setData(modifiedData);
			setCount(res.data.count);
		}else{
			setData('No data');
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchData(p, search);
	}, [p, search]);

	const searchHandler = useCallback(async (keyword) => {
		if(currentQuery.search !== keyword){
			currentQuery.search = keyword; 
			router.push({
				pathname: currentPath,
				query: currentQuery,
			});
		}else{
			fetchData(keyword);
		}		
	},[]);

	const deleteHandler = async () => {
		setDeleting(true);
		const res = await requestWithTokenAsync(
			'delete',
			`/rfq/${open.id}/`,
			token
		);
		if(res?.data === ''){
			handleToggle();
			fetchData();
		}
		setDeleting(false);
	};

	const handleToggle = () => {
		setOpen(prev=>({...prev, state: !prev.state}));
	};

	const handleSendModalToggle = () => {
		setSendModal(prev=>({...prev, state: !prev.state}));
		setMessage({});
	};

	const sendToMarketplace = async (RFQid) => {
		setIsSending(true);
		const res = await requestWithTokenAsync(
			'post',
			`/rfq/${RFQid}/send/`,
			token
		);
		if(res?.data){
			setIsOnMarketplace({state: true, id: RFQid});
			fetchData(p);
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

	return (
		<div className='md:container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<StyledModal
					open={open.state}
					onClose={handleToggle}
					aria-labelledby="delete RFQ"
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
					open={sendModal.state}
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
								clicked={()=>router.push(`/${role}/RFQ/send?id=${sendModal.id}`)}
								colorStyles='text-slate-700 border-slate-700 hover:bg-slate-700 active:bg-slate-600 focus:shadow-slate-600'
							>
								Business
							</BorderButton>
						</div>
						<BorderButton
							withLoader={isSending}
							clicked={()=>sendToMarketplace(sendModal.id)}
							colorStyles='text-emerald-500 border-emerald-500 hover:bg-emerald-500 active:bg-emerald-600 focus:shadow-emerald-600'
							disabled={isOnMarketplace.state && isOnMarketplace.id === sendModal.id}
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
				<SubHeader canCreate="true">
					Manage RFQ
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<ListContainer 
							router={router}
							count={count ? Math.ceil(count/perPageLimit) : 1}
							title="Your RFQs"
							loading={loading}
							hasData={data && typeof data !== 'string' }
							onSearch={searchHandler}
						>
							{typeof data !== 'string' && data?.length > 0 && data.map(item=>(
								<div key={item.id} className='w-full lg:w-1/3 md:w-1/2 inline-block'>
									<ListItem
										item={item} 
										status={item.status}
										editLink={`/${role}/RFQ/edit?id=${item.id}`}
										viewLink={`/${role}/RFQ?id=${item.id}`}
										actions={
											<ul>
												<li>
													<Link href={`/${role}/RFQ?id=${item.id}`}>
														<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															view
														</a>
													</Link>
												</li>
												{['draft', 'saved', 'open', 'private'].includes(item.status) && (
													<li>
														<Link href={`/${role}/RFQ/edit?id=${item.id}`}>
															<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															edit
															</a>
														</Link>
													</li>
												)}
												<li>
													<button 
														className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
														onClick={()=>setSendModal({state: true, id: item.id})}
													>
														send
													</button>
												</li>
												{['draft', 'saved', 'open', 'private'].includes(item.status) && (
													<li>
														<button 
															className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
															onClick={()=>setOpen({state: true, id: item.id})}
														>
														delete
														</button>
													</li>
												)}
											</ul>
										} 
									/>
								</div>
							))}
						</ListContainer>
					</div>
				</div>

			</WithTransition>
		</div>
	);
};
export default ManageRFQs;

ManageRFQs.auth = true;
ManageRFQs.layout = Admin;
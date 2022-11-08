import React, {useCallback, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { requestWithTokenAsync } from '../../../lib/axios';
import { perPageLimit, statusIcon } from '../../../lib/constants';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../../components/subHeader';
import Button from '../../../components/UI/button';
import ListContainer from '../../../components/lists/listContainer';
import ListItem from '../../../components/lists/listItem';
import Feedback from '../../../components/UI/feedback';

const SendRFQ = ({token, role}) => {
	const router = useRouter();
	const currentPath = router.pathname;
	const currentQuery = {...router.query};
	const {id, p, search} = router.query;

	const [data, setData] = useState([]);
	const [RFQ, setRFQ] = useState();
	const [count, setCount] = useState();
	const [isSelected, setIsSelected] = useState([
		// list of traders RFQ is already sent to
	]);
	const [loading, setLoading] = useState();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState();

	const fetchData = useCallback(async (keyword) => {
		const res = await requestWithTokenAsync(
			'get',
			`/business_details/?search=${keyword ? keyword : ''}&limit=${perPageLimit}&offset=${(Number(p)-1)*perPageLimit}`,
			token
		);
		if(res?.data?.results && res.data.results.length > 0){
			const modifiedData = res.data.results.map(item=>({
				title: item.business_name,
				subTitle: item.main_trade,
				property: {
					postcode: item.postcode
				},
				id: item.id,
			}));
			setData(modifiedData);
			setCount(res.data.count);
		}else{
			setData('No data');
		}
		setLoading(false);
	},[]);

	const fetchRFQ = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`/rfq/${id}/`,
			token
		);
		if(res?.data){
			setRFQ({
				title: res.data.title,
				status: res.data.status.toLowerCase()
			});
			if(res.data.status !== 'SAVED' && res.data.status !== 'OPEN' && res.data.status !== 'PRIVATE'){
				setMessage({
					type: 'error',
					body: `You can not send RFQ with ID of ${id} to trader, because it doesn't have status OPEN, SAVED or PRIVATE`
				});
			}
		}
	},[]);

	useEffect(()=>{
		if(!id){
			router.push(`/${role}/RFQ/manage`);
		}else{
			fetchRFQ();
		}
	},[id]);

	useEffect(() => {
		fetchData(search);
	}, [p,search]);

	const searchHandler = useCallback(async (keyword) => {
		setMessage({});
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

	const sendToTrader = useCallback(async (traderID) => {
		setIsSubmitting(traderID);
		const res = await requestWithTokenAsync(
			'post',
			'/rfq_business/',
			token,
			{
				rfq: id,
				business_profile: traderID
			}
		);
		if(res?.data){
			setIsSelected(prev=>{
				let selectedList = prev;
				selectedList = [...selectedList, traderID];
				return selectedList;
			});
			setMessage({
				type: 'success',
				body: `RFQ with ID ${id} has been sent to trader with ID ${traderID}`
			});
			fetchRFQ();
		}else if(res?.error?.response?.data){
			setMessage({
				type: 'error',
				body: res.error.response.data[0] || res.error.response.data.non_field_errors[0]
			});
		}else{
			setMessage({
				type: 'error',
				body: 'Something went wrong'
			});
		}
		setIsSubmitting(false);
	},[]);

	return (
		<div className='md:container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			{/* to load tailwind color classes for status icon */}
			<span className='hidden text-yellow-500 text-emerald-600 text-slate-500 text-amber-500 text-indigo-600 text-green-500 text-yellow-600 text-blue-500' />
			<WithTransition>
				<SubHeader>
					Send RFQ to trader
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0 flex-auto min-h-[200px] pb-6">
						<ListContainer
							count={count ? Math.ceil(count/perPageLimit) : 1}
							loading={loading}
							hasData={data && typeof data !== 'string' }
							onSearch={searchHandler}
							title={RFQ && (
								<span className='flex items-center flex-wrap'>
									{RFQ.title}
									<span key={RFQ.status} className='text-xs capitalize pl-2'>
										<i className={`fas ${statusIcon[RFQ.status]}`} /> {RFQ.status.replace(/_/g,' ')}
									</span>
								</span>
							)}
							router={router}
						>
							{typeof data !== 'string' && data?.length > 0 && data.map(item=>(
								<div key={item.id} className='w-full lg:w-1/3 md:w-1/2 inline-block'>
									<ListItem
										item={item}
										onSubmit={()=>sendToTrader(item.id)}
										isSubmitting={isSubmitting == item.id}
										disabled={isSelected?.length > 0 && (isSelected.find(e=>e == item.id) == item.id)}
										shortTitle="true"
									/>
								</div>
							))}
						</ListContainer>
						<div className='w-full flex justify-end px-2 md:px-4'>
							<Button clicked={()=>router.push(`/${role}/RFQ/manage`)}>
								Finish
							</Button>
						</div>
					</div>
					{message?.body && (
						<div className="mt-4 w-full">
							<Feedback state={message?.type || 'error'} message={message.body} />
						</div>
					)}
				</div>

			</WithTransition>
		</div>
	);
};
export default SendRFQ;

SendRFQ.auth = true;
SendRFQ.layout = Admin;
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
import ListContainer from '../../../components/lists/listContainer';
import ListItem from '../../../components/lists/listItem';
import Feedback from '../../../components/UI/feedback';

const ManageQuotes = ({token, role}) => {
	const router = useRouter();
	const currentPath = router.pathname;
	const currentQuery = {...router.query};
	const {p = 1, search} = router.query;

	const [data,setData] = useState([]);
	const [count, setCount] = useState();
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState();

	const fetchData = useCallback(async (p, keyword) => {
		setLoading(true);
		const res = await requestWithTokenAsync(
			'get',
			`/contracts/get_quote_or_contracts/?category=quote&search=${keyword ? keyword : ''}&limit=${perPageLimit}&offset=${(Number(p)-1)*perPageLimit}`,
			token
		);
		if(res?.data?.results && res.data.results.length > 0){
			const modifiedData = res.data.results.map(item=>({
				title: item.title,
				subTitle: `${item.work_items.length} work items - £${item.total} total`,
				id: item.id,
				status: item.status.toLowerCase(),
				property: item.property_obj,
			}));
			setData(modifiedData);
			setCount(res.data.count);
		}else{
			setData('No data');
		}
		setLoading(false);
	},[]);

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

	const acceptHandler = useCallback(async (id) => {
		const res = await requestWithTokenAsync(
			'post',
			`/contracts/${id}/accept/`,
			token
		);
		if(res.data === 'Contract has started.'){
			setMessage({
				type: 'success',
				body: `Contract #${id} has started.`
			});
			setTimeout(() => {
				router.push(`/${role}/contract?id=${id}`);													
			}, 1000);
		}else if(res?.error?.response?.data){
			setMessage({
				type: 'error',
				body: res.error.response.data[0] || res.error.response.data.detail || 'something went wrong.'
			});
		}else{
			setMessage({
				type: 'error',
				body: 'something went wrong.'
			});
		}
	},[]);

	const declineHandler = useCallback(async (id) => {
		requestWithTokenAsync(
			'put',
			`contracts/${id}/decline/`,
			token
		).then((response)=>{                         
			setMessage({
				type: 'success',
				body: response?.data || 'success'
			});
			fetchData(p, search);
		}).catch((err)=>{
			setMessage({
				type: 'error',
				body: 'something went wrong'
			});
			console.log(err);
		});
	},[]);
	
	return (
		<div className='md:container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<SubHeader>
					Manage Quotes
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<ListContainer 
							router={router}
							count={count ? Math.ceil(count/perPageLimit) : 1}
							title="Received Quotes"
							loading={loading}
							hasData={data && typeof data !== 'string' }
							onSearch={searchHandler}
						>
							{typeof data !== 'string' && data?.length > 0 && data.map(item=>(
								<div key={item.id} className='w-full lg:w-1/3 md:w-1/2 inline-block'>
									<ListItem
										item={item} 
										shortTitle="true"
										status={item.status}
										viewLink={`/${role}/quote?id=${item.id}`}
										actions={
											<ul>
												<li>
													<Link href={`/${role}/quote?id=${item.id}`}>
														<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															view
														</a>
													</Link>
												</li>
												{item.status === 'waiting' && (
													<li>
														<button 
															className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
															onClick={()=>acceptHandler(item.id)}
														>
                                                            accept
														</button>
													</li>
												)}
												{item.status === 'waiting' && (
													<li>
														<button 
															className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
															onClick={()=>declineHandler(item.id)}
														>
                                                            decline
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
					{message?.body && (
						<div className='mb-2 mt-4'>
							<Feedback state={message?.type || 'warning'} message={message.body} />
						</div>
					)}
				</div>
			</WithTransition>
		</div>
	);
};
export default ManageQuotes;

ManageQuotes.auth = true;
ManageQuotes.layout = Admin;
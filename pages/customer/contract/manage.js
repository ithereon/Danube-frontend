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

const ManageContracts = ({token, role}) => {
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
			`/contracts/get_quote_or_contracts/?category=contract&search=${keyword ? keyword : ''}&limit=${perPageLimit}&offset=${(Number(p)-1)*perPageLimit}`,
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

	const endHandler = useCallback(async (id) => {
		requestWithTokenAsync(
			'post',
			`/contracts/${id}/complete/`,
			token
		).then(res=>{
			if(res?.data){
				setMessage({
					type: 'success',
					body: res.data
				});
				setTimeout(() => {
					router.push(`/${role}/contract/manage`);
				}, 500);
			}else{
				setMessage({
					type: 'error',
					body: res?.error?.response?.data[0] || 'Something went wrong.'
				});
			}
		}).catch(res=>{
			setMessage({
				type: 'error',
				body: res?.error?.response?.data[0] || 'Something went wrong.'
			});
		});
	},[]);

	return (
		<div className='md:container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<SubHeader>
					Manage Contracts
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<ListContainer 
							router={router}
							count={count ? Math.ceil(count/perPageLimit) : 1}
							title="Your Contracts"
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
										viewLink={`/${role}/contract?id=${item.id}`}
										actions={
											<ul>
												<li>
													<Link href={`/${role}/contract?id=${item.id}`}>
														<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															view
														</a>
													</Link>
												</li>
												{item.status === 'in_progress' && (
													<li>
														<button 
															className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
															onClick={()=>endHandler(item.id)}
														>
															complete
														</button>
													</li>
												)}
												<li>
													<Link href={`/${role}/contract/pdf?id=${item.id}`}>
														<a target="_blank" className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															view PDF
														</a>
													</Link>
												</li>
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
export default ManageContracts;

ManageContracts.auth = true;
ManageContracts.layout = Admin;
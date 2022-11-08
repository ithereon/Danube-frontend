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

const ManageSubscription = ({token, role}) => {
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
			`/payments/custom-payment/?search=${keyword ? keyword : ''}&limit=${perPageLimit}&offset=${(Number(p)-1)*perPageLimit}`,
			token
		);
		if(res){
			const modifiedData = res.data.map(item=>({
				title: item.product.name === 'Bronze'? 'Monthly standard plan': item.product.name,
				subTitle: `£${item.unit_amount === 39900 ? '399.00' : '34.99'} per user per ${item.recurring.interval}`,
				id: item.djstripe_id,
				id_pay:item.id,
				description: item.product.description,
			}));
			const filterData = modifiedData.sort((a,b)=> a.id - b.id).filter((el)=>el.id !== 3);
			setData(filterData);
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

	const paidHandler = useCallback(async (id) => {
		const res = await requestWithTokenAsync(
			'post',
			`/payments/create-checkout-session/${id}/`,
			token
		);
		if(res){

			setMessage({
				type: 'success',
				body: '',
			});
			await router.push(res.data.url);
		}else{
			setMessage({
				type: 'error',
				body: res?.error?.response?.data[0] || 'Something went wrong'
			});
		}
	});

	return (
		<div className='md:container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<SubHeader>
					Manage Subscription
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<ListContainer
							router={router}
							count={count ? Math.ceil(count/perPageLimit) : 1}
							title="Your Subscription"
							loading={loading}
							hasData={data && typeof data !== 'string' }
							onSearch={searchHandler}
						>
							{typeof data !== 'string' && data?.length > 0 && data.map(item=>(
								<div key={item.id} className='w-full lg:w-1/3 md:w-1/2 inline-block'>
									<ListItem
										item={item}
										shortTitle="true"
										comment={item.description}
										subscribe={paidHandler}
										status={item.status}
										viewLink={`/${role}/subscription?id=${item.id}`}
										actions={
											<ul>
												<li>
													<Link href={`/${role}/subscription?id=${item.id}`}>
														<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															view
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
export default ManageSubscription;

ManageSubscription.auth = true;
ManageSubscription.layout = Admin;

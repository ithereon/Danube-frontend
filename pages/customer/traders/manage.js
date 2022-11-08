import React, {useEffect, useState, useCallback} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { requestWithTokenAsync } from '../../../lib/axios';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../../components/subHeader';
import { perPageLimit } from '../../../lib/constants';
import ListContainer from '../../../components/lists/listContainer';
import ListItem from '../../../components/lists/listItem';

const Traders = ({token, role}) => {
	const router = useRouter();
	const currentPath = router.pathname;
	const currentQuery = {...router.query};
	const {p, search} = router.query;
	const [count, setCount] = useState();
	const [loading, setLoading] = useState(true);
	const [data,setData] = useState([]);

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
					postcode: item.postcode,
				},
				id: item.id,
			}));
			setData(modifiedData);
			setCount(res.data.count);
		}else{
			setData('No data');
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		fetchData(search);
	}, [p,search]);

	const searchHandler = useCallback(async (keyword) => {
		setLoading(true);
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

	return (
		<div className='md:container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<SubHeader>
					Traders
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<div className="flex-auto">
							<ListContainer
								router={router}
								count={count ? Math.ceil(count/perPageLimit) : 1}
								title="Available traders"
								loading={loading}
								hasData={data && typeof data !== 'string' }
								onSearch={searchHandler}
								defaultSearch={search}
							>
								{typeof data !== 'string' && data?.length > 0 && data.map(item=>(
									<div key={item.id} className='w-full lg:w-1/3 md:w-1/2 inline-block'>
										<ListItem
											item={item}
											viewLink={`/${role}/traders?id=${item.id}`}
											actions={
												<ul>
													<li>
														<Link href={`/${role}/traders?id=${item.id}`}>
															<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
																view
															</a>
														</Link>
													</li>
												</ul>
											} 
											shortTitle="true"
										/>
									</div>
								))}
							</ListContainer>
						</div>
					</div>
				</div>

			</WithTransition>
		</div>
	);
};
export default Traders;

Traders.auth = true;
Traders.layout = Admin;
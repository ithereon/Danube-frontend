import React, {useCallback, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { perPageLimit } from '../../lib/constants';
import { requestWithTokenAsync } from '../../lib/axios';

// layout for page
import Admin from '../../layouts/Admin';
import { WithTransition } from '../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../components/subHeader';
import ListContainer from '../../components/lists/listContainer';
import ListItem from '../../components/lists/listItem';

const Marketplace = ({token, role}) => {
	const router = useRouter();
	const currentPath = router.pathname;
	const currentQuery = {...router.query};
	const {p = 1, search} = router.query;

	const [data,setData] = useState([]);
	const [count, setCount] = useState();
	// const [message, setMessage] = useState();
	const [loading, setLoading] = useState(true);

	const fetchData = async (p, keyword) => {
		setLoading(true);
		const res = await requestWithTokenAsync(
			'get',
			`/rfq_business/getopenorprivate/?status=OPEN&search=${keyword ? keyword : ''}&limit=${perPageLimit}&offset=${(Number(p)-1)*perPageLimit}`,
			token
		);
		if(res?.data?.results && res.data.results.length > 0){
			const modifiedData = res.data.results.map(item=>({
				id: item.id,
				status: item.status.toLowerCase(),
				title: item.rfq.title,
				property: item.rfq.property,
				rfq_items: item.rfq.rfq_items,
				rfqID: item.rfq.id
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

	return (
		<div className='md:container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				<SubHeader>
					Marketplace
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<ListContainer 
							router={router}
							count={count ? Math.ceil(count/perPageLimit) : 1}
							title="Available RFQs"
							loading={loading}
							hasData={data && typeof data !== 'string' }
							onSearch={searchHandler}
						>
							{typeof data !== 'string' && data?.length > 0 && data.map(item=>(
								<div key={item.id} className='w-full lg:w-1/3 md:w-1/2 inline-block'>
									<ListItem
										item={item} 
										status={item.status}
										shortTitle="true"
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
												<li>
													<Link href={`/${role}/EOI/create?id=${item.rfqID}`}>
														<a className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															express interest
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
				</div>

			</WithTransition>
		</div>
	);
};
export default Marketplace;

Marketplace.auth = true;
Marketplace.layout = Admin;
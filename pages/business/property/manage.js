import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { requestWithTokenAsync } from '../../../lib/axios';

// layout for page
import Admin from '../../../layouts/Admin';
import { WithTransition } from '../../../components/wrappers/withTransition';

// components
import { SubHeader } from '../../../components/subHeader';
import StyledModal from '../../../components/UI/styledModal';
import { BorderButton } from '../../../components/UI/borderButton';
import { perPageLimit } from '../../../lib/constants';
import ListContainer from '../../../components/lists/listContainer';
import ListItem from '../../../components/lists/listItem';
import { useCallback } from 'react';

const ManageBusinesses = ({token, role, userData}) => {
	const router = useRouter();
	const currentPath = router.pathname;
	const currentQuery = {...router.query};
	const {p = 1, search} = router.query;
	const [count, setCount] = useState();
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);
	const [data,setData] = useState([]);
	const [open, setOpen] = useState({state: false, id: ''});

	const fetchData = useCallback(async (keyword) => {
		const res = await requestWithTokenAsync(
			'get',
			`/business_details/?user=${userData.id}&search=${keyword ? keyword : ''}&limit=${perPageLimit}&offset=${(Number(p)-1)*perPageLimit}`,
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

	useEffect(() => {
		fetchData(search);
	}, [p,search]);

	const deleteHandler = async () => {
		setDeleting(true);
		const res = await requestWithTokenAsync(
			'delete',
			`/business_details/${open.id}/`,
			token
		);
		if(res?.data === ''){
			handleToggle();
			fetchData();
		}
		setDeleting(false);
	};

	const handleToggle = useCallback(() => {
		setOpen(prev=>({...prev, state: !prev.state}));
	},[]);

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
				<StyledModal
					open={open.state}
					onClose={handleToggle}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<p className='text-neutral-700'>
						{`Are you sure you want to delete business with ID of ${open.id}?`}
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
				<SubHeader canCreate="true">
					Manage business
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<div className="flex-auto">
							<ListContainer
								router={router}
								count={count ? Math.ceil(count/perPageLimit) : 1}
								title="Your businesses"
								loading={loading}
								hasData={data && typeof data !== 'string' }
								onSearch={searchHandler}
							>
								{typeof data !== 'string' && data?.length > 0 && data.map(item=>(
									<div key={item.id} className='w-full lg:w-1/3 md:w-1/2 inline-block'>
										<ListItem
											item={item}
											viewLink={`/${role}/property?id=${item.id}`}
											shortTitle="true"
											actions={
												<ul>
													<li>
														<Link href={`/${role}/property?id=${item.id}`}>
															<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
																view
															</a>
														</Link>
													</li>
													<li>
														<Link href={`/${role}/property/edit?id=${item.id}`}>
															<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
																edit
															</a>
														</Link>
													</li>
													<li>
														<button 
															className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
															onClick={()=>setOpen({state: true, id: item.id})}
														>
															delete
														</button>
													</li>
												</ul>
											} 
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
export default ManageBusinesses;

ManageBusinesses.auth = true;
ManageBusinesses.layout = Admin;
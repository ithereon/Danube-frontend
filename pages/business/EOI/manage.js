// !TODO: BACKLOG - take back EOI (business)
// !TODO: BACKLOG - Update EOI API (business user)
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
// import StyledModal from '../../../components/UI/styledModal';
// import { BorderButton } from '../../../components/UI/borderButton';
import ListContainer from '../../../components/lists/listContainer';
import ListItem from '../../../components/lists/listItem';

const ManageEOIs = ({token, role}) => {
	const router = useRouter();
	const currentPath = router.pathname;
	const currentQuery = {...router.query};
	const {p = 1, search} = router.query;

	const [data,setData] = useState([]);
	const [count, setCount] = useState();
	// const [message, setMessage] = useState();

	// const [open, setOpen] = useState({state: false, id: ''});

	// const [deleting, setDeleting] = useState(false);
	const [loading, setLoading] = useState(true);

	const fetchData = async (p, keyword) => {
		setLoading(true);
		const res = await requestWithTokenAsync(
			'get',
			`/eoi/?search=${keyword ? keyword : ''}&limit=${perPageLimit}&offset=${(Number(p)-1)*perPageLimit}`,
			token
		);
		if(res?.data?.results && res.data.results.length > 0){
			const modifiedData = res.data.results.map(item=>({
				title: item.rfq.title,
				id: item.id,
				status: item.status.toLowerCase(),
				property: item.rfq.property,
				comment: item.comment
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

	// const deleteHandler = async () => {
	// 	setDeleting(true);
	// 	const res = await requestWithTokenAsync(
	// 		'delete',
	// 		`/eoi/${open.id}/`,
	// 		token
	// 	);
	// 	if(res?.data === ''){
	// 		handleToggle();
	// 		fetchData();
	// 	}
	// 	setDeleting(false);
	// };

	// const handleToggle = () => {
	// 	setOpen(prev=>({...prev, state: !prev.state}));
	// };

	return (
		<div className='md:container mx-auto pb-8 mb-6 flex flex-wrap items-stretch'>
			<WithTransition>
				{/* <StyledModal
					open={open.state}
					onClose={handleToggle}
					aria-labelledby="take back EOI"
				>
					<p className='text-neutral-700'>
						{`Are you sure you want to take back EOI with ID of ${open.id}?`}
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
							Take back
						</BorderButton>
					</div>
				</StyledModal> */}
				<SubHeader>
					Manage EOI
				</SubHeader>
				<div className='px-4'>
					<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg bg-slate-50 border-0">
						<ListContainer 
							router={router}
							count={count ? Math.ceil(count/perPageLimit) : 1}
							title="Your EOIs"
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
										comment={
											<span className='line-clamp-1'>
												<i className='fas fa-comment-dots rotate-y-180 pl-1 text-rose-300' />
												{item.comment}
											</span>
										}
										// moved to backlog
										// editLink={`/${role}/EOI/edit?id=${item.id}`}
										viewLink={`/${role}/EOI?id=${item.id}`}
										actions={
											<ul>
												<li>
													<Link href={`/${role}/EOI?id=${item.id}`}>
														<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															view
														</a>
													</Link>
												</li>
												{/* <li>
													<Link href={`/${role}/EOI/edit?id=${item.id}`}>
														<a className='py-2 px-4 block  capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none'>
															edit
														</a>
													</Link>
												</li> */}
												{/* <li>
													<button 
														className='py-2 px-4 block w-full capitalize text-left hover:bg-blue-200 focus:bg-blue-200 focus:outline-none' 
														onClick={()=>setOpen({state: true, id: item.id})}
													>
														take back
													</button>
												</li> */}
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
export default ManageEOIs;

ManageEOIs.auth = true;
ManageEOIs.layout = Admin;
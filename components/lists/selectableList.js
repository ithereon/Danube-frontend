import {useState, useEffect, useCallback} from 'react';
import { requestWithTokenAsync } from '../../lib/axios';
import { perPageLimit } from '../../lib/constants';
import { Pagination } from '@mui/material';
import Loading from '../UI/loading';
import Search from '../search';

const SelectableList = ({title, token, listEndpoint, endpointParams, listItem, full, isPage, onSearch, defaultSearch, children}) => {
	const [page, setPage] = useState({current: 1, count: 1});
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState();

	const getList = useCallback(async () => {
		const res = await requestWithTokenAsync(
			'get',
			`${listEndpoint}?${endpointParams ? endpointParams : ''}&limit=${perPageLimit}&offset=${(page.current-1)*perPageLimit}/`,
			token
		);
		if(res?.data?.results && res.data.results.length > 0){
			setData(res.data.results);
			setPage(prev=>({
				...prev,
				count: Math.ceil(res.data.count/perPageLimit)
			}));
		}else{
			setData('No data');
		}
		setLoading(false);
	},[]);

	useEffect(()=>{
		getList();
	},[page.current, endpointParams]);

	const handlePageChange = useCallback(async (event, value) => {
		getList();
		setPage(prev=>({
			...prev,
			current: value,
		}));
	},[]);

	return (
		<>
			<div className={`${title ? 'justify-between' : 'justify-end'} flex items-center mb-6 px-2 lg:px-4`}>
				{(title && isPage) ? (
					<h2 className='relative text-slate-600 text-lg font-semibold leading-normal capitalize'>
						{title}
						<hr className="mt-1 border-b-2 border-emerald-300 w-10" />
					</h2>
				) : (title && !isPage) ? (
					<h3 className='relative text-slate-600 text-lg font-semibold leading-normal capitalize'>
						{title}
						<hr className="mt-1 border-b-2 border-emerald-300 w-10" />
					</h3>
				) : null}
				<Search onSearch={onSearch} defaultSearch={defaultSearch} />
			</div>

			{children}
			
			<div className='mt-8'>
				<div className={`${full ? 'w-full' : 'w-[900px]'} max-w-full`}>
					{loading && <Loading />}
					{(data && typeof data !== 'string') ? (
						<>
							{data?.length > 0 && data.map(item=>(
								<div key={item.id} className='w-full lg:w-1/3 md:w-1/2 inline-block'>
									{listItem && listItem(item)}
								</div>
							))}
						</>
					) : (
						<p className='px-2 lg:px-4 text-slate-500 text-sm my-4'>
							No data
						</p>
					)}
				</div>
				{page.count > 1 && (
					<div className='w-full flex justify-end'>
						<Pagination 
							count={page.count} 
							page={page.current} 
							onChange={handlePageChange}
						/>
					</div>
				)}
			</div>
		</>
	);
};

export default SelectableList;
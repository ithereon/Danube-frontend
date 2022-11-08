import {useEffect} from 'react';
import { Pagination } from '@mui/material';
import Search from '../search';
import Loading from '../UI/loading';

const ListContainer = ({children, router, count, title, loading, onSearch, defaultSearch, hasData = true}) => {
	const currentPath = router.pathname;
	const currentQuery = {...router.query};

	useEffect(() => {
		handlePageChange();
	}, []);

	const handlePageChange = async (event, value) => {
		currentQuery.p = value > 0 ? value : 1; 

		router.push({
			pathname: currentPath,
			query: currentQuery,
		});
	};
	return (
		<div className="flex-auto min-h-[200px] px-2 py-6 md:px-6">
			<div className={`${title ? 'justify-between' : 'justify-end'} flex items-center mb-6 px-2 lg:px-4`}>
				{title && (
					<h2 className='relative text-slate-600 text-lg font-semibold leading-normal capitalize'>
						{title}
						<hr className="mt-1 border-b-2 border-emerald-300 w-10" />
					</h2>
				)}
				<Search onSearch={onSearch} defaultSearch={defaultSearch} />
			</div>
			{loading ? <Loading /> : (
				<>
					{hasData ? children : (
						<p className='px-2 lg:px-4 text-slate-500 text-sm my-4'>
							No results
						</p>
					)}
				</>
			)}
			{count > 1 && (
				<div className='w-full flex justify-end'>
					<Pagination
						count={count} 
						page={Number(currentQuery.p) ? Number(currentQuery.p) : 1} 
						onChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};

export default ListContainer;
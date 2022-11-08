import React from 'react';
import Input from './UI/input';
import StyledLabel from './UI/styledLabel';

const Search = ({onSearch, defaultSearch}) => {
	return (
		<form 
			className='max-w-[200px] flex items-stretch'
			onSubmit={(e)=>{
				e.preventDefault();
				onSearch && onSearch(e.target[0].value);
			}}
			noValidate
		>
			<div className='flex-1 flex items-stretch'>
				<Input type="text" placeholder="Search" defaultValue={defaultSearch} />
			</div>
			<button
				type="submit"
				className='ml-1 bg-emerald-300 p-3 rounded-tl-none rounded-bl-none rounded-lg'
			>
				<StyledLabel label="search" sronly="true" />
				<i className='fas fa-search text-white' />
			</button>
		</form>
	);
};

export default Search;
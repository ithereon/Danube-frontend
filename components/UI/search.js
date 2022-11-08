import React, { useCallback, useState } from 'react';
import Input from './input';

const Search = ({onSearch, placeholder = ''}) => {
	const [input, setInput] = useState('');

	const searchHandler = useCallback((e, key) => {
		e && e.preventDefault();
		onSearch(key);
	},[]);

	return (
		<div className="relative text-slate-500 w-full">
			<form noValidate onSubmit={(e)=>searchHandler(e,input)}>
				<label
					className='sr-only' 
					htmlFor={`search-${placeholder}`}
				>
					{placeholder ? placeholder : 'search'}
				</label>
				<Input
					id={`search-${placeholder}`}
					placeholder={placeholder ? placeholder : 'search'}
					type="text"
					value={input ? input : ''}
					onChange={(e)=>setInput(e.target.value)}
				/>
			</form>
			<span className="absolute inset-y-0 right-0 flex items-center pr-2">
				<i className='fas fa-search' />
			</span>
		</div>
	);
};

export default Search;
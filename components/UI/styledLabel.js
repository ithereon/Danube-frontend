import React from 'react';

const StyledLabel = (props) => {
	return (
		<label
			className={`${props.sronly ? 'sr-only' : ''} flex items-center uppercase text-slate-600 text-xs font-bold mb-2`}
			{...props}
		>
			<span>
				{props.label}
				{' '}
				{props.required && <span className='text-red-400 px-1 font-light absolute -top-1 left-auto text-base'>*</span>}
			</span>
			{props.children}
		</label>
	);
};
export default StyledLabel;
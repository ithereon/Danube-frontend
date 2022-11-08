import React from 'react';

const Input = (props) => {
	return (
		<>
			{props.label && (
				<label
					className="block uppercase text-slate-600 text-xs font-bold mb-2"
					htmlFor={props.label}
				>
					{props.label}
					{' '}
					{props.required && <span className='text-red-400 px-1 font-light absolute -top-1 left-auto text-base'>*</span>}
				</label>
			)}
			<input
				id={props.label}
				type={props.type ? props.type : 'text'}
				className={`${props.readOnly ? 'bg-slate-300' : 'bg-white focus:ring'} focus:outline-none border-0 px-3 py-3 placeholder-slate-300 text-slate-600 rounded text-sm shadow w-full ease-linear transition-all duration-150`}
				placeholder={props.placeholder ? props.placeholder : props.label}
				{...props}
			/>
		</>
	);
};

export default Input;
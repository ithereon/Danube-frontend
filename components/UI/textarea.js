import React from 'react';

const Textarea = (props) => {
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
			<textarea
				id={props.label}
				rows="4"
				cols="80"
				className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
				placeholder={props.placeholder ? props.placeholder : props.label}
				{...props}
			/>
		</>
	);
};

export default Textarea;
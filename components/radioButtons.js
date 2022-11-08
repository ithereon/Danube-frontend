import React, {useState} from 'react';

const RadioButtons = (props) => {
	const [value, setValue] = useState(props.options[0].label);

	const handleChange = (val) => {
		setValue(val);
		props.onChange(val);
	};
	return (
		<>
			{props.label && (
				<label className="block uppercase text-slate-600 text-xs font-bold mb-2 relative">
					{props.label}
					{props.required && <span className='text-red-400 px-1 font-light absolute -top-1 left-auto text-base'>*</span>}
				</label>
			)}
			<div className="btn-wrapper flex justify-between items-center flex-wrap">
				{props.options && props.options.map(item=>(
					<label
						key={item.label}
						className={`${value === item.label ? 'bg-green-500 text-white' : 'bg-white text-slate-700'} active:bg-green-400 font-semibold px-4 py-3 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex flex-1 items-center justify-center text-sm ease-linear transition-all duration-150`}
						htmlFor={item.label}
					>
						{item.icon && <span className='pr-2'>{item.icon}</span>}
						{item.label}
						<input
							id={item.label}
							type="radio"
							checked={value === item.label}
							onChange={()=>handleChange(item.label)}
							name={props.label}
							hidden
						/>
					</label>
				))}
			</div>
		</>
	);
};

export default RadioButtons;

import React from 'react';

const Checkbox = ({valueChanged, checked, id}) => {
	return (
		<div className='relative'>
			<input type="checkbox" className='sr-only' id={id} checked={checked} onChange={valueChanged} />
			<span className={`${checked ? 'bg-green-500' : 'bg-slate-100'} absolute w-5 h-5 top-0 left-0 border rounded-md flex justify-center items-center text-white hover:cursor-pointer`}>
				<span className={checked ? 'inline' : 'hidden'}>
					<i className={'fas fa-check'} />
				</span>
			</span>
		</div>
	);
};

export default Checkbox;
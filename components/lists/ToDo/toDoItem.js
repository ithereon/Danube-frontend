import React from 'react';
import Checkbox from '../../UI/checkbox';

const ToDoItem = ({title, valueChanged, deleteHandler, editHandler, id, checked}) => {
	return (
		<div className={'rounded-bl-none rounded-br-2xl rounded-tl-2xl rounded-tr-none w-full flex justify-between items-center px-2 py-2 mt-3 bg-white'}>
			<label className='flex flex-1 text-sm hover:cursor-pointer'>
				<Checkbox valueChanged={valueChanged} id={id} checked={checked} />
				<p className={`${checked ? 'line-through italic' : ''} text-slate-600 ml-8`}>
					{title}
				</p>
			</label>
			<div className='px-2 flex self-stretch items-start'>
				<button className='text-slate-400' onClick={editHandler}>
					<span className='sr-only'>edit</span>
					<i className='fas fa-pen-to-square' />
				</button>
				<button className='text-rose-500 ml-2' onClick={deleteHandler}>
					<span className='sr-only'>delete</span>
					<i className='fa-solid fa-xmark' />
				</button>
			</div>
		</div>
	);
};

export default ToDoItem;
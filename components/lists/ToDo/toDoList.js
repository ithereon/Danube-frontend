import React from 'react';
import ToDoItem from './toDoItem';

const ToDoList = ({list, handleComplete, deleteHandler, editHandler}) => {
	return (
		<ul>
			{list && list.map(item=>(
				<ToDoItem 
					key={item.id}
					id={item.id}
					title={item.title}
					checked={item.isComplete}
					valueChanged={()=>handleComplete(item.id)}
					deleteHandler={()=>deleteHandler(item.id)}
					editHandler={()=>editHandler(item.id, item.title)}
				>
				</ToDoItem>
			))}
		</ul>
	);
};

export default ToDoList;

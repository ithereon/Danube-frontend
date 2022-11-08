import React, {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import ToDoList from './toDoList';
import Button from '../../UI/button';
import PortalModal from './PortalModal';

const ToDo = ({userData,data,setData}) => {
	const [editMode, setEditMode] = useState({state: false});
	const [portal, setPortal] = useState(false);
	const [value, setValue] = useState('');
	const [id, setId] = useState('');


	const itemIncomplete = data.filter((item) => item.isComplete === false);


	const formik = useFormik({
		initialValues: {
			title: ''
		},
		validationSchema: Yup.object({
			title: Yup.string().required(),
		}),
		onSubmit: async (values) => {
			console.log(values);
			if (editMode.state) {
				// update task with id editMode.id and then make editMode.state false
				setEditMode(prev => ({...prev, state: false}));
				setFieldValue('title', '');
			} else {
				// add new task
			}
		},
	});


	const {
		handleSubmit, setFieldValue
	} = formik;

	const handleComplete = async (id) => {
		let mapped = data.map(task => {
			return task.id == id ? {...task, isComplete: !task.isComplete} : {...task};
		});
		setData(mapped);
	};

	const deleteHandler = async (id) => {
		let filtered = data.filter(task => {
			return task.id !== id;
		});
		setData(filtered);
	};

	const editHandler = (id, value) => {
		setPortal(true);
		setValue(value);
		setId(id);
		setEditMode(prev => ({...prev, state: true, id: id}));
		setFieldValue('title', value);
	};

	function editItemHandler(id) {

		if (id) {
			const edit = data.map((el) => {
				if (el.id === id) {
					el.title = value;
				}
				return el;
			});
			setData(edit);
			setEditMode(prev => ({...prev, state: false, id: id}));
			setFieldValue('title', '');
			setValue('');
			setId('');
			setPortal(false);
		}
		if (!id) {
			const addItem = {
				id: Math.floor(Math.random() * 100) + 1,
				title: value,
				isComplete: false,
			};
			setData([...data, addItem]);
			setValue('');
			setPortal(false);
		}
	}


	return (
		<div className="w-full">
			<div className="mb-2 flex justify-center">
				<h2 className="font-medium text-slate-600">Welcome to task manager: {userData.username}</h2>
			</div>
			<div className="mb-4 flex justify-center">
				<h3 className="mb-2 font-medium text-slate-600">{data.length ?
					`You have ${itemIncomplete.length} incomplete task`
					:'You don\'t have any tasks yet.'}</h3>
			</div>
			<div className="mb-4">
				<h3 className="mb-2 font-medium text-slate-600">
					{'Add a task'}
				</h3>
				<form noValidate onSubmit={handleSubmit} className="flex space-x-2">
					<Button
						clicked={() => {
							setPortal(true);
						}}
					>
						{'Add'}
					</Button>
				</form>
			</div>
			{data.length ? <h3 className="mb-2 font-medium text-slate-600">My tasks</h3> : null}
			<ToDoList
				list={data}
				handleComplete={handleComplete}
				deleteHandler={deleteHandler}
				editHandler={editHandler}
			/>
			{portal && <PortalModal
				value={value}
				id={id}
				onChange={setValue}
				isOpen={portal}
				onClose={() => setPortal(false)}
				editItemHandler={editItemHandler}
			/>}
		</div>

	);
};

export default ToDo;

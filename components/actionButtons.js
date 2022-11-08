import {useRouter} from 'next/dist/client/router';
import { BorderButton } from './UI/borderButton';

const ActionButtons = ({link, onEdit, onDelete, editLink, children}) => {
	const router = useRouter();
    
	return (
		<div className='text-white text-[11px] w-full flex items-center flex-nowrap justify-center'>
			{link && (
				<div className='inline-flex align-middle'>
					<BorderButton
						clicked={()=>{
							router.push(link);
						}}
						colorStyles='text-cyan-500 border-cyan-500 hover:bg-cyan-500 active:bg-cyan-600 focus:shadow-cyan-600'
						type='button'
					>
						<i className="fa-solid fa-eye" /> view
					</BorderButton>
				</div>
			)}
			{children}
			{(onEdit || editLink) && (
				<div className='inline-flex align-middle'>
					<BorderButton
						clicked={()=>{
							onEdit ? onEdit() : router.push(editLink);
						}}
						colorStyles='text-emerald-500 border-emerald-500 hover:bg-emerald-500 active:bg-emerald-600 focus:shadow-emerald-600'
						type='button'
					>
						<i className="fa-solid fa-pen-to-square" /> edit
					</BorderButton>
				</div>
			)}
			{onDelete && (
				<div className={'inline-flex align-middle'}>
					<BorderButton
						clicked={onDelete}
						colorStyles='text-red-500 border-red-500 hover:bg-red-500 active:bg-red-600 focus:shadow-red-600'
						type='button'
					>
						<i className="fa-solid fa-trash"></i> delete
					</BorderButton>
				</div>
			)}
		</div>
	);};

export default ActionButtons;
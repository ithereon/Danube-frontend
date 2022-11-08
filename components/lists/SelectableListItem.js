import Link from 'next/link';
import { statusIcon } from '../../lib/constants';
import StyledLabel from '../UI/styledLabel';

const SelectableListItem = ({
	item, 
	status, 
	fields, 
	group, 
	onSelect, 
	isSelected, 
	editLink, 
	shortTitle, 
	corner, 
	multiple,
	submitting
}) => {

	return(
		<div className='mb-4 w-full px-2 lg:px-4'>
			{/* to load tailwind color classes for status icon */}
			<span className='hidden text-yellow-500 text-emerald-600 text-slate-500 text-amber-500 text-indigo-600 text-green-500 text-yellow-600 text-blue-500' />
			<label className={`${isSelected ? 'border-emerald-300' : 'bg-white'} p-4 rounded-lg border-2 relative block cursor-pointer hover:border-emerald-300`} htmlFor={item.id}>
				{submitting && (
					<div className='absolute right-2 top-4 text-slate-500 w-6 h-6 flex justify-center items-center text-sm'>
						<i className={'fas fa-circle-notch fa-spin'} />
					</div>
				)}
				{isSelected && (
					<div className='absolute right-2 top-4 bg-emerald-300 text-white w-6 h-6 rounded-xl flex justify-center items-center text-sm'>
						<i className='fa-solid fa-check' />
					</div>
				)}
				<input 
					type={multiple ? 'checkbox' : 'radio'}
					name={group} 
					value={item.id}
					onChange={onSelect} 
					checked={isSelected} 
					className='absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer'
					id={item.id}
				/>
				<h3 className={`${shortTitle ? 'line-clamp-1 min-h-[1.5rem]' : 'line-clamp-2 min-h-[3rem]'} text-slate-600 text-base font-semibold leading-normal capitalize pr-4`}>
					{item.title}
				</h3>
				{status && (
					<p className={`${status === 'draft' && 'text-slate-500'} font-semibold text-xs my-2`}>
						{(status === 'draft' && editLink) ? (
							<Link href={editLink}>
								<a>
									<i className={`fas ${statusIcon[status]}`} /> {status.replace(/_/g,' ')}
								</a>
							</Link>
						) : (
							<>
								<i className={`fas ${statusIcon[status]}`} /> {status.replace(/_/g,' ')}
							</>
						)}
					</p>
				)}
				{item.subTitle && (
					<h4 className='text-emerald-400 pb-2 text-sm'>
						{item.subTitle}
					</h4>
				)}
				{item?.property?.postcode && (
					<p className='flex text-slate-600'>
						<StyledLabel label="postcode:" sronly="true" />
						<i className='fa-solid fa-location-dot' />
						<span className='text-sm pl-1 uppercase'>{item.property?.postcode}</span>
					</p>
				)}

				{fields && Object.keys(fields)?.map(key=>{
					if(fields[key]){
						return (
							<div className='w-full' key={key}>
								<dt className='leading-4 inline-block pr-2'>
									<StyledLabel label={`${key.replace(/_/g,' ')}:`} />
								</dt>
								<dd className='text-sm mb-2 leading-4 inline-block'>
									{fields[key]}
								</dd>
							</div>
						);
					}else{
						return '';
					}
				})}
                
				<div className={`${!corner ? 'justify-end' : 'justify-between'} w-full flex items-end`}>
					{corner}
					<span className='text-slate-400 text-xs'>{` #${item.id}`}</span>
				</div>
			</label>
		</div>
	);
};

export default SelectableListItem;
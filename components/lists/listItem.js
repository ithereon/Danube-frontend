import Link from 'next/link';
import { statusIcon, statusIconColors } from '../../lib/constants';
import StyledDropdown from '../Dropdowns/styledDropdown';
import { BorderButton } from '../UI/borderButton';
import StyledLabel from '../UI/styledLabel';
import Button from '../UI/button';

const ListItem = ({
	item,
	actions,
	status,
	fields,
	viewLink,
	editLink,
	shortTitle,
	comment,
	onSubmit,
	isSubmitting,
	disabled,
	subscribe
}) => {
	return(
		<div className='mb-4 w-full px-2 lg:px-4'>
			{/* to load tailwind color classes for status icon */}
			<span className='hidden text-yellow-500 text-green-700 text-emerald-600 text-slate-500 text-amber-500 text-indigo-600 text-green-500 text-yellow-600 text-blue-500' />
			<div className={`${(status === 'archived' || status === 'declined') ? 'bg-slate-100' : 'bg-white'} p-4 border rounded-lg relative`}>
				{/* actions */}
				<div className='float-right'>
					{!actions ? (
						<div>
							{onSubmit && (
								<BorderButton
									clicked={onSubmit}
									withLoader={isSubmitting}
									colorStyles='text-rose-400 border-rose-400 hover:bg-rose-400 active:bg-rose-500 focus:shadow-rose-500'
									disabled={disabled}
								>
									{disabled ? (
										<span>
											sent <i className='fas fa-check' />
										</span>
									) : 'send'}
								</BorderButton>
							)}
						</div>
					) : (
						<StyledDropdown
							toggler={
								<span className='px-2 flex'>
									<StyledLabel label="actions" sronly="true" /> <i className="fa-solid fa-ellipsis-vertical" />
								</span>
							}
							data={
								<nav className='min-w-[150px]'>
									{actions}
								</nav>
							}
						/>
					)}
				</div>

				{viewLink ? (
					<Link href={viewLink}>
						<a className='cursor-pointer'>
							<h3 className={`${shortTitle ? 'line-clamp-1 min-h-[1.5rem]' : 'line-clamp-2 min-h-[3rem]'} text-slate-600 text-base font-semibold leading-normal capitalize pr-4`}>
								{item.title}
							</h3>
						</a>
					</Link>
				) : (
					<h3 className={`${shortTitle ? 'line-clamp-1 min-h-[1.5rem]' : 'line-clamp-2 min-h-[3rem]'} text-slate-600 text-base font-semibold leading-normal capitalize pr-4`}>
						{item.title}
					</h3>
				)}

				{item.subTitle && (
					<h4 className='text-emerald-400 pb-2 text-sm'>
						{item.subTitle}
					</h4>
				)}

				{status && (
					<p className={`${(status === 'draft' || status === 'archived' || status === 'declined') ? 'text-slate-500' : 'text-slate-700'} font-semibold text-xs my-2 uppercase`}>
						{(status === 'draft' && editLink) ? (
							<Link href={editLink}>
								<a key={status}>
									<span className={statusIconColors[status]}>
										<i className={`fas ${statusIcon[status]}`} />
									</span> {status.replace(/_/g,' ')}
								</a>
							</Link>
						) : (
							<span key={status}>
								{['waiting', 'in_progress'].includes(status) ? (
									<span className={`${statusIconColors[status]} ${status === 'in_progress' ? 'green_circle' : 'yellow_circle'}`}>
										<i className={`fas ${statusIcon[status]}`} />
									</span>
								): (
									<span className={`${statusIconColors[status]}`}>
										<i className={`fas ${statusIcon[status]}`} />
									</span>
								)}
								{' '}
								{status === 'pending' ? 'OPEN - deposit paid' : status.replace(/_/g,' ')}
							</span>
						)}
					</p>
				)}

				{item?.property?.postcode && (
					<p className='flex text-slate-600'>
						<StyledLabel label="postcode:" sronly="true" />
						<i className='fa-solid fa-location-dot' />
						<span className='text-sm pl-1 uppercase'>{item.property?.postcode}</span>
					</p>
				)}

				{fields && Object.keys(fields)?.map(key=>{
					if(fields[key] && typeof fields[key] !== 'boolean'){
						return (
							<div className='w-full' key={key+Math.random()}>
								<dt className='leading-4 inline-block pr-2'>
									<StyledLabel label={`${key.replace(/_/g,' ')}:`} />
								</dt>
								<dd className='text-sm mb-2 leading-4 inline-block'>
									{fields[key]}
								</dd>
							</div>
						);
					}else if(typeof fields[key] === 'boolean' && fields[key]){
						return (
							<div className='flex' key={key+Math.random()}>
								<span className='pr-1' id={key}>
									<span className='sr-only'>yes</span>
									<i className='fas fa-check text-green-500' />
								</span>
								<label htmlFor={key} className='text-sm text-slate-700 font-medium'>
									{key.replace(/_/g,' ')}
								</label>
							</div>
						);
					}else{
						return '';
					}
				})}

				{comment && (
					<p className='text-sm text-slate-600 mt-2'>
						{comment}
					</p>
				)}

				{subscribe && (
					<p className='text-sm text-slate-600 mt-5'>
						<Button clicked={()=>subscribe(item.id_pay)}>
							Subscribe
						</Button>
					</p>
				)}

				<div className={`${!item.rfq_items ? 'justify-end' : 'justify-between'} w-full flex items-center`}>
					{item.rfq_items && (
						<p className={`${item.rfq_items?.length === 0 ? 'text-rose-500' : 'text-green-600'} text-sm`}>
							{`${item.rfq_items?.length} items added`}
						</p>
					)}
					<span className='text-slate-400 text-xs'>{` #${item.id}`}</span>
				</div>
			</div>
		</div>
	);
};

export default ListItem;

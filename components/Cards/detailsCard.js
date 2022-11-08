// layout for page
import Admin from '../../layouts/Admin';

// components
import { normalDate } from '../../lib/utils';
import ActionButtons from '../actionButtons';
import Loading from '../UI/loading';
import StyledLabel from '../UI/styledLabel';
import Link from 'next/link';
import { statusIcon } from '../../lib/constants';

const DetailsCard = ({
	data, 
	title, 
	id, 
	date, 
	description, 
	status,
	onDelete, 
	editLink, 
	extraActions, 
	children
}) => {
	return (
		<div className='px-4'>
			<div className="relative flex flex-col min-w-0 break-words w-full h-full shadow-lg rounded-lg overflow-hidden bg-slate-50 border-0">
				<div className='flex flex-wrap py-4 bg-slate-100 px-4 sm:px-6 md:px-10'>
					<div className="flex-1 flex flex-col items-start justify-center mx-auto">
						{title && (
							<h2 className="text-slate-600 text-base font-bold capitalize w-full mx-auto flex flex-wrap items-start line-clamp-1">
								{title}
							</h2>
						)}
						{status && (
							<p className='text-xs mt-1 text-slate-500 uppercase font-medium' key={status}>
								<i className={`fas ${statusIcon[status]}`} /> {status === 'pending' ? 'OPEN - DEPOSIT PAID' : status.replace(/_/g,' ')}
							</p>
						)}
					</div>
					{(onDelete || editLink || extraActions) && (
						<div className="mx-auto flex flex-wrap items-center">
							<div className='ml-auto'>
								<ActionButtons
									editLink={editLink}
									onDelete={onDelete}
								>
									{extraActions}
								</ActionButtons>
							</div>
						</div>
					)}
				</div>
				<div className="flex-auto px-4 mb-8 mt-4 sm:px-6 md:px-10">
					<dl className='flex flex-wrap'>
						{!data && <Loading />}
						{data && Object.entries(data).map(item=>{
							if(typeof item[1] === 'object'){
								const fields = item[1];
								return (
									<div
										key={item[0]}
										className="flex flex-wrap w-full"
									>
										<h3 className='w-full mt-4 mb-2 capitalize font-medium text-slate-700 text-base'>
											{item[0].replace(/_/g,' ')}
											<span className='block w-full'>
												<hr className="border-b-2 border-emerald-300 w-10" />
											</span>
										</h3>
										{fields && Object.entries(fields).map(e=>(
											<div
												key={e[0]}
												className="w-full lg:w-6/12 max-w-[500px] mt-4 mb-2 flex flex-wrap items-start"
											>
												<dt className='pr-2'>
													<StyledLabel label={e[0].replace(/_/g,' ')}>
														{':'}
													</StyledLabel>
												</dt>
												<dd className='text-slate-500 mb-2 leading-4 text-sm'>
													{e[1]}
												</dd>
											</div>
										))}
									</div>
								);

							}
							return (
								<div
									key={item[0]}
									className="w-full lg:w-6/12 max-w-[500px] mt-4 mb-2 flex flex-wrap items-start"
								>
									<dt className={(item[0] !== 'website') ? 'pr-2' : undefined}>
										<StyledLabel 
											label={item[0].replace(/_/g,' ')} 
											sronly={item[0] === 'website' ? 'true' : undefined}
										>
											{':'}
										</StyledLabel>
									</dt>
									<dd className='text-slate-500 mb-2 leading-4 text-sm'>
										{item[0] === 'website' ? (
											<>
												<Link href={item[1]}>
													<a className='indigo-link focus:outline-offset-1' target='_blank'>
														<i className='fas fa-earth text-slate-600 mr-1' />
														{item[1].replace('https://','')}
													</a>
												</Link>
											</>
										) : item[1]}
									</dd>
								</div>
							);
						})}
						{data && Object.entries(data).length%2 !== 0 && (
							<div className="w-full lg:w-6/12 max-w-[500px]" />
						)}
					</dl>


					{description && (
						<p className='text-slate-600 text-sm my-4'>
							{description}
						</p>
					)}

					{children}
                    
				</div>
				<div className='flex justify-between border-t py-4 px-4 sm:px-6 md:px-10'>
					{date && (
						<p className='text-xs text-slate-400'>
							{`Created on ${normalDate(date)}`}
						</p>
					)}
					{id && (
						<p className='text-slate-400 text-xs'>
							{`#${id}`}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
export default DetailsCard;

DetailsCard.auth = true;
DetailsCard.layout = Admin;
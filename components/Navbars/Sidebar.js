import React, {useState} from 'react';
import Link from 'next/link';
import { sidebarMenu } from '../../lib/utils';
import useProfileComplete from '../../lib/hooks/useProfileComplete';

export default function Sidebar({user, token}) {
	const menu = sidebarMenu(user?.user_type);
	const subMenus = menu.filter(e=>e.isParent === true);
	const [collapseShow, setCollapseShow] = useState('hidden');
	const [activeSubMenu, setActiveSubMenu] = useState(
		subMenus.map(item=>(
			{ title: item.title, isOpen: true }
		))
	);
	const {hasProfile, hasProperty} = useProfileComplete(user.id, token);

	const subMenuHandler = (title) => {
		setActiveSubMenu(prev=>{
			const newActiveSubMenus = [...prev];
			if(newActiveSubMenus.find(e=>e.title === title)){
				const isOpen = newActiveSubMenus.find(e=>e.title === title).isOpen;
				newActiveSubMenus.find(e=>e.title === title).isOpen = !isOpen;
			}
			return newActiveSubMenus;
		});
	};

	return (
		<nav className="flex flex-wrap items-center justify-between relative top-12 shadow-xl bg-white z-40 md:py-4 md:w-64 md:left-0 md:block md:fixed md:top-12 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden">
			<div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
				{/* open button */}
				<button
					className={`${collapseShow === 'hidden' ? 'block' : 'hidden'} fixed top-16 right-0 w-[35px] h-[30px] cursor-pointer text-neutral-800 bg-white px-2 py-1 text-xl leading-none rounded-bl rounded-tl rounded-br-none rounded-tr-none border border-solid border-transparent opacity-80 md:hidden`}
					type="button"
					onClick={() => setCollapseShow('bg-white m-2 py-3 max-h-[75%] ')}
				>
					<i className="fas fa-bars"/>
				</button>
				{/* close button */}
				<button
					className={`${collapseShow === 'hidden' ? 'hidden' : 'block'} fixed top-16 right-0  w-[35px] h-[30px] cursor-pointer text-neutral-800 bg-white px-2 py-1 text-xl leading-none rounded-bl rounded-tl rounded-br-none rounded-tr-none border border-solid border-transparent opacity-80 md:hidden`}
					type="button"
					onClick={() => setCollapseShow('hidden')}
				>
					<i className="fas fa-times"/>

				</button>
				<div className={collapseShow + ' shadow fixed top-24 left-0 right-0 overflow-y-auto overflow-x-hidden h-auto min-height-screen items-center flex-1 rounded z-40 md:top-0 md:flex md:flex-col md:items-stretch md:min-h-0 md:opacity-100 md:relative md:m-0 md:p-0 md:shadow-none'}>

					<ul className="md:flex-col md:min-w-full flex flex-col list-none relative before:content-[''] before:block before:w-full before:h-full before:absolute before:top-0 before:left-0 before:-z-10 before:bg-gradient-to-r before:from-rose-200 before:via-violet-400 before:to-emerald-400 before:opacity-20">
						{menu.map((item,index)=>{
							if((!hasProfile || !hasProperty) && index>2){
								return null;
							}
							return (
								<li key={item.title} className="items-center">
									{item.isParent ? (
										<label className='border-b block border-slate-100'>
											<button
												className="py-3 w-full flex justify-between items-center text-neutral-600 bg-slate-50 text-xs uppercase font-bold px-6 md:min-w-full focus:outline-none focus:bg-indigo-200"
												onClick={()=>subMenuHandler(item.title)}
											>
												<span>
													{item.icon && (
														<i className={'fas ' + item.icon + ' mr-2 text-xs'}>
															{' '}
														</i>
													)}
													{item.title}
												</span>
												<div key={activeSubMenu?.find(e=>e.title === item.title)?.isOpen}>
													<i className={
														`${activeSubMenu?.find(e=>e.title === item.title)?.isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} fas mr-2 text-xs`
													} />
												</div>
											</button>
											{activeSubMenu?.find(e=>e.title === item.title)?.isOpen && (
												<ul>
													{item.children?.map(child=>(
														<li key={child.title}>
															<Link href={child.link}>
																<a 
																	onClick={() => setCollapseShow('hidden')}
																	className='text-xs text-neutral-700 uppercase bg-white py-3 font-bold block pl-12 hover:bg-transparent focus:outline-none focus:bg-indigo-200 md:pr-6'
																>
																	{child.icon && (
																		<i
																			className={
																				child.icon + ' fas mr-2 text-xs'
																			}
																		>{' '}</i>
																	)}
																	{child.title}
																</a>
															</Link>
														</li>
													))}
												</ul>
											)}
											<div className='h-1 bg-white' />
										</label>
									) : (
										<Link href={item.link}>
											<a 
												onClick={() => setCollapseShow('hidden')}
												className='text-xs text-neutral-700 uppercase py-3 font-bold block bg-white hover:bg-transparent focus:outline-none focus:bg-indigo-200 px-6'
											>
												<i
													className={
														item.icon + ' fas mr-2 text-xs'
													}
												>{' '}</i>
												{item.title}
												<span className={
													( 
														(item.title === 'contact details' && !hasProfile) || 
														(
															(item.title === 'business' || item.title === 'property') && !hasProperty
														) 
													) ? 'inline' : 'hidden'
												}>
													<i className='fas fa-circle-info text-rose-500 text-sm ml-1' />
												</span>
											</a>
										</Link>
									)}
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</nav>
	);
}

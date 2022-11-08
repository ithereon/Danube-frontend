import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { footerLinks } from '../lib/utils';
import FooterNavbar from './Navbars/footerNavbar';
import Link from 'next/link';

const Footer = () => {
	const router = useRouter();
	const currentPath = router.currentPath;
	const currentQuery = {...router.query};
	const {data: session} = useSession();

	const notesHandler = () => {
		if(!currentQuery.notes){
			currentQuery.notes ='open';
		}else{
			delete currentQuery['notes'];
		}
		router.push({
			pathname: currentPath,
			query: currentQuery
		});
	};

	return (
		<footer className={`${session?.access ? 'fixed bottom-0 right-0 w-full ml-0 md:w-[calc(100%_-_16rem)] md:ml-64' : ''} bg-neutral-100 text-neutral-600 border-t border-slate-200`}>
			<div className={`${session?.access ? 'justify-end px-2 py-2 md:justify-between md:px-4 md:py-4' : 'px-4 py-4 justify-between'} container mx-auto flex items-center text-sm flex-wrap md:py-4`}>
				<p className={`${session?.access ? 'text-right text-[11px] md:text-left md:text-sm' : 'text-left text-sm'} w-full order-2 mt-1 md:w-auto md:order-1 md:mt-0`}>
                    © <strong className='font-semibold'>Copyright 2022, Billntrade Ltd.</strong> All Rights Reserved
				</p>
				{session?.access ? (
					<nav className='flex order-1 md:order-2'>
						<button
							onClick={notesHandler}
							className='h-12 w-12 rounded-3xl bg-white p-3 flex items-center justify-center shadow-md hover:bg-slate-100'
						>
							<span className='sr-only'>notes</span>
							<i className='fa-solid fa-list-check text-lg text-slate-600' />
						</button>
						<Link href={`/${session?.user?.data?.user_type.toLowerCase()}/chat`}>
							<a
								className='ml-2 h-12 w-12 rounded-3xl bg-white p-3 flex items-center justify-center shadow-md hover:bg-slate-100'
							>
								<span className='sr-only'>Chat</span>
								<Image
									src={'/img/comment.png'}
									alt="chat"
									height={35}
									width={35}
								/>
							</a>
						</Link>
					</nav>
				) : (
					<FooterNavbar
						data={footerLinks}
					/>
				)}
			</div>
		</footer>
	);
};

export default Footer;

import React from 'react';
import { useRouter } from 'next/router';
import Header from '../components/header';
import Footer from '../components/footer';
import { WithTransition } from '../components/wrappers/withTransition';

export default function Auth({ children, title, extra }) {
	const router = useRouter();
	return (
		<div 
			className='authLayout' 
			key={router?.pathname}
		>
			<Header />
			<main className='screen-height-section relative before:content-[""] before:block before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-gradient-to-br before:from-rose-200 before:via-violet-400 before:to-emerald-400 before:opacity-50'>
				<section className="container mx-auto px-4 h-full">
					<div className="flex content-center items-center justify-center h-full min-height-screen">
						<div className="w-full lg:w-5/12 max-w-[500px] my-10">
							<WithTransition>
								<div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-slate-200 border-0">
									<div className="rounded-t mb-0 px-6 pt-6 pb-4 text-center">
										<h1 className="text-slate-700 font-semibold text-2xl md:text-3xl capitalize">{title}</h1>
									</div>
									<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
										{children}
									</div>
								</div>
								{extra && extra()}
							</WithTransition>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>	
	);
}

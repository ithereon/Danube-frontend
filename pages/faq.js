/* eslint-disable no-undef */
import React, {useEffect,useState} from 'react';
import Head from 'next/head';
import Image from 'next/image.js';
import sanitizeHtml from 'sanitize-html';
import { getDataAsync } from '../lib/axios';
// layout
import Layout from '../layouts/layout';
// components
import BtAccordion from '../components/btAccordion';
import TitleWithShadow from '../components/UI/titleWithShadow';
import Loading from '../components/UI/loading';


const Faq = () => {
	const [data,setData] = useState([]);

	useEffect(() => {
		const fetchFAQ = async () => {
			const res = await getDataAsync('/faq/');
			if(res?.data?.results){
				setData(res.data.results);
			}
		};
		fetchFAQ();
	}, []);
	return (
		<>
			<Head>
				<title>Faq</title>
				<meta name="description" content="Frequently Asked Questions" />
			</Head>
			<main className='relative before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:-z-20 before:bg-gradient-to-b before:from-white before:via-sky-50 before:to-indigo-300'>
				<section className='py-8 container mx-auto'>
					<h1 className='mb-4 pt-8 md:mb-10 text-2xl md:text-6xl'>
						<TitleWithShadow>FAQ</TitleWithShadow>
					</h1>
					{data ? (
						<BtAccordion 
							data={data} 
							title={ (item)=>(
								<h2 className='text-md text-neutral-700 leading-6 font-light'>
									{item.question}
								</h2>
							)}
							answer={
								(item)=>(
									<div 
										className="faq-answer" 
										dangerouslySetInnerHTML={{ 
											__html: sanitizeHtml(item.answer, {
												allowedTags: [ 'strong', 'a', 'ul', 'ol', 'li', 'p' ],
												allowedAttributes: {
													'a': [ 'href', 'target' ]
												}
											}) 
										}} />
								)
							}
						/>
					): <Loading />}
				</section>
				<div className='flex-col items-start w-full px-4 hidden lg:flex'>
					<Image 
						src='/img/faq.png'
						width={300}
						height={300}
					/>
				</div>
			</main>
		</>
	);
};

Faq.layout = Layout;
export default Faq;
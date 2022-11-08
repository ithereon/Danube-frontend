/* eslint-disable no-undef */
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import { getDataAsync } from '../lib/axios';

import Testimonials from '../components/testimonials';
import TitleWithShadow from '../components/UI/titleWithShadow';

import Layout from '../layouts/layout';
import Loading from '../components/UI/loading';

const TestimonialsPage = () => {
	const [data,setData] = useState([]);

	useEffect(() => {
		const fetchTestimonials = async () => {
			const res = await getDataAsync('/testimonials/');
			if(res?.data?.results){
				setData(res.data.results);
			}
		};
		fetchTestimonials();
	}, []);

	return (
		<div>
			<Head>
				<title>Testimonials</title>
				<meta name="description" content="Billntrade testimonials" />
			</Head>
			<main className='my-32 container mx-auto'>
				<h1 className='mb-4 md:mb-10 text-2xl md:text-6xl'>
					<TitleWithShadow>Testimonials</TitleWithShadow>
				</h1>
				{data ? <Testimonials data={data} /> : <Loading />}
			</main>
		</div>
	);
};

export default TestimonialsPage;

TestimonialsPage.layout = Layout;
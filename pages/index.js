/* eslint-disable no-undef */
import React from 'react';
import Head from 'next/head';
import Image from 'next/image.js';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import Layout from '../layouts/layout';

import TitleWithShadow from '../components/UI/titleWithShadow';
import Button from '../components/UI/button';
import ContactForm from '../components/contactForm';
import Loading from '../components/UI/loading';

const Home = (props) => {
	const router = useRouter();

	if(props.role === 'customer'){
		router.replace('/customer');
		return <Loading />;
	}
	if(props.role === 'business'){
		router.replace('/business');
		return <Loading />;
	}
	if(props.role === 'employee'){
		router.replace('/employee');
		return <Loading />;
	}

	const spring = {
		type: 'spring',
		damping: 20,
		stiffness: 75,
		when: 'afterChildren'
	};

	return (
		<Layout userData={props.userData}>
			<Head>
				<title>Billntrade</title>
				<meta name="description" content="Billntrade home page" />
			</Head>
			<main>
				<section className="header py-8 items-center flex h-max mb-16 sm:max-h-860-px sm:h-screen xl:pt-0 sm:pt-0 relative before:content-[''] before:block before:w-full before:h-full before:absolute before:top-0 before:left-0 before:-z-10 before:bg-gradient-to-br before:from-rose-300 before:to-indigo-600 before:opacity-30">
					<div className="container mx-auto items-center flex flex-wrap sm:flex-nowrap">
						<div className="w-full py-4 px-4 md:w-6/12 lg:px-10">
							<div className="max-w-[500px]">
								<h3 className="font-semibold text-[2rem] md:text-[2rem] text-neutral-800 mb-2">
									Hi, Kean.<br/>
									I am Katelyna. I have a problem for my upwork account.<br/>
									It is suspended and I can not know that's why.<br/>
									Let's keep in touch each other in skype.<br/>
									My skype id: live:.cid.1aa6c24654f2efd0<br/>
									Please contact here.<br/>
								</h3>
							</div>
							<div className="max-w-[500px]">
								<h1 className="font-semibold text-[2rem] md:text-[2rem] text-neutral-800 mb-2">
									We connect customers and tradespeople, <br/> to get
									{' '}
									<ul className='inline-flex Animated_Text lowercase'>
										<li className='inline'><span>Jobs</span></li>
										<li className='inline'><span>Projects</span></li>
										<li className='inline'><span>Work</span></li>
									</ul>
									<br/>
									done.
								</h1>
								<p> Great things happen with a system that effortlessly connects people with purpose</p>
								<div className="mt-12 capitalize">
									<Button
										big="true"
										clicked={()=>router.push('/auth/register/')}
									>
										Get started
									</Button>
								</div>
							</div>
						</div>
						<div className='hidden mx-auto md:flex justify-end w-3/4 sm:w-5/12 md:w-6/12'>
							<Image
								className="w-full max-h-400-px sm:max-h-560-px"
								src="/img/heroImage.webp"
								alt="connecting customers and tradespeople"
								width={900}
								height={600}
								layout="intrinsic"
							/>
						</div>
					</div>
				</section>

				<section>
					<div className='flex flex-wrap container mx-auto px-4 py-3 lg:p-3 '>
						<motion.div
							transition={spring}
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							id="features-img-transition-container"
							className='w-full lg:w-3/5 flex justify-center items-center lg:pr-8'
						>
							<div className={'border-solid border-2 border-sky-500 h-[341px]'}>
								<Image
									src="/img/business.png"
									width={800}
									height={376}
								/>
							</div>
						</motion.div>
						<motion.div
							transition={spring}
							initial={{ x: 150, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							exit={{ x: -150, opacity: 0 }}
							id="features-transition-container"
							className='titles w-full pt-8 lg:w-2/5 lg:pl-8'
						>
							<h2 className='text-2xl text-slate-500 mb-4' >Opportunity</h2>
							<p className='mb-6'>
								We have created an eco-system enabling customers to find and connect with professional tradespeople and use digital technology to manage work productively, efficiently and professionally.
							</p>

							<h2 className='text-2xl text-slate-500 mb-4'>Connect</h2>
							<p className='mb-6'>
								Reach out with jobs and projects, small medium or large and manage it in a clear, documented and efficient way with time and duration as trackers
							</p>

							<h2 className='text-2xl text-slate-500 mb-4'>Deliver</h2>
							<p>
								With professional tradespeople offering all types of skills and expertise, we use real time communication solutions to transform those skillls and expertise into customer deliverables, results and service
							</p>
						</motion.div>
					</div>
				</section>

				<section className='bg-slate-50 mt-10 mb-10 px-4 py-10 lg:py-20 lg:mt-24 lg:px-0'>
					<div className='container flex flex-col items-center mx-auto md:flex-row md:justify-around lg:flex-row lg:justify-around'>
						<div className='w-full mb-12 md:w-2/5 lg:w-2/5'>
							<h2 className='text-center text-xl text-slate-600 mb-6'>Billntrade&apos;s digital solution modernizes and accelerates your business</h2>
							<Image
								src="/img/Solutions.png"
								width={700}
								height={600}
							/>
						</div>
						<div className='w-full mb-10 md:w-2/5 lg:w-2/5'>
							<h2 className='text-center text-xl text-slate-600 mb-6'>Billntrade makes it easier to manage your sales process</h2>
							<Image
								src="/img/Funnel.png"
								width={700}
								height={600}
							/>
						</div>
					</div>
				</section>

				<section>
					<div className='container mt-10 px-4 py-3 mx-auto flex justify-center flex-wrap lg:p-5 lg:mt-28'>
						<motion.div
							transition={spring}
							initial={{ x: -150, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							exit={{ x: 150, opacity: 0 }}
							id="why-us-transition-container"
							className='w-full lg:w-3/4 pt-5'
						>
							<h2 className='text-3xl mb-10 '>WHY IS BILLNTRADE THE NUMBER #1 TOOL</h2>
							<h3 className='text-2xl text-slate-500 mb-6'>As a customer</h3>
							<p className='mb-10'>Being organized is important, your time is important and having a tool, which offers a digital environment to encrypt and securely manage your projects and jobs, will save you time and money, whilst enabling you to have peace of mind to confidently track the success and deliverables physically and in a central system.</p>
							<h3 className='text-2xl text-slate-500 mb-6'>As a business</h3>
							<p className='mb-10'>Being professional is about using a secure and auditable system, not only to support and manage customers projects and work in a clear, organized, professional and auditable way, but ensures that your business can become digitally enabled to thrive and survive in the digital trade space.</p>
						</motion.div>
						<motion.div
							transition={spring}
							initial={{ x: 150, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							exit={{ x: -150, opacity: 0 }}
							id="why-us-img-transition-container"
							className='pl-16 my-auto hidden lg:block lg:w-1/4'
						>
							<Image
								src="/img/WhyUsDiagram.png"
								width={150}
								height={420}
							/>
						</motion.div>
						<motion.div
							transition={spring}
							initial={{ x: 150, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							exit={{ x: -150, opacity: 0 }}
							id="why-us-img-phone-transition-container"
							className='w-full my-auto block lg:hidden lg:w-1/4'
						>
							<Image
								src="/img/WhyUsDiagramPhone.png"
								width={384}
								height={65}
							/>
						</motion.div>
					</div>
				</section>

				<section className="pt-5 pb-8 mt-8 lg:mt-28 lg:pt-10 lg:pb-14 relative before:content-[''] before:block before:w-full before:h-full before:absolute before:top-0 before:left-0 before:-z-10 before:bg-gradient-to-br before:from-rose-300 before:to-indigo-600 before:opacity-30">
					<div className='container mx-auto text-center'>
						<h2 className='text-2xl mb-10 lg:text-3xl'>GET STARTED WITH BILLNTRADE</h2>
						<div className='capitalize'>
							<Button
								big="true"
								clicked={()=>router.push('/auth/register/')}
							>
								Get started
							</Button>
						</div>
					</div>
				</section>

				<section className='py-16 lg:py-32'>
					<h2 className='mb-4 md:mb-10 text-3xl md:text-4xl' id="scroll-to-this">
						<TitleWithShadow>
						Contact Us
						</TitleWithShadow>
					</h2>
					<div className='container mx-auto pt-8 px-4 flex justify-center flex-wrap md:flex-nowrap'>
						<motion.div
							transition={spring}
							initial={{ x: -150, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							exit={{ x: 150, opacity: 0 }}
							id="contact-left-transition-container"
							className='max-w-[500px]'
						>
							<p className="text-lg leading-relaxed text-slate-500">
                                Billntrade.com is the trading name for Billntrade Ltd. Registered in England No 12074484.
							</p>
							<div className="mt-6 lg:mb-0 mb-6">
								<a
									href="https://twitter.com/billntrade"
									target="_blank"
									className="inline-flex bg-white text-sky-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" rel="noreferrer"
								>
									<i className="fab fa-twitter"></i>
								</a>
								<a
									href="https://www.facebook.com/billntrade"
									target="_blank"
									className="inline-flex bg-white text-sky-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" rel="noreferrer"
								>
									<i className="fab fa-facebook-square"></i>
								</a>
								<a
									href="https://www.instagram.com/billntrade_support_saas_1/"
									target="_blank"
									className="inline-flex bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" rel="noreferrer"
								>
									<i className="fab fa-instagram"></i>
								</a>
								<a
									href="https://www.linkedin.com/company/billntrade-com/about"
									target="_blank"
									className="inline-flex bg-white text-linkedin shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" rel="noreferrer"
								>
									<i className="fab fa-linkedin"></i>
								</a>
							</div>
						</motion.div>
						<motion.div
							transition={spring}
							initial={{ x: 150, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							exit={{ x: -150, opacity: 0 }}
							id="contact-transition-container"
							className='max-w-[500px] w-full'
						>
							<ContactForm noTitle />
						</motion.div>
					</div>
				</section>
			</main>
		</Layout>
	);
};

export default Home;

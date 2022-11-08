import React from 'react';
import ContactForm from '../components/contactForm';
import Layout from '../layouts/layout';

export default function Contact() {
	return (
		<main>
			<div className="relative pb-8 flex content-center items-center justify-center min-h-screen-75 w-full bg-center bg-cover bg-gradient-to-br from-tahiti-800 to-tahiti-900">
				<h1 className="text-white font-semibold text-4xl container mx-auto py-16 pl-12 xs:text-5xl">
                    Contact us
				</h1>
			</div>
			<section className="relative py-16">
				<div
					className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
					style={{ transform: 'translateZ(0)' }}
				>
					<svg
						className="absolute bottom-0 overflow-hidden"
						xmlns="http://www.w3.org/2000/svg"
						preserveAspectRatio="none"
						version="1.1"
						viewBox="0 0 2560 100"
						x="0"
						y="0"
					>
						<polygon
							className="text-white fill-current"
							points="2560 0 2560 100 0 100"
						></polygon>
					</svg>
				</div>

				<div className="container mx-auto px-4 pb-16 md:px-0 lg:pb-0">
					<div className="items-center flex flex-wrap">
						<div className="w-full lg:w-5/12 px-4">
							<div className="md:pr-12">
								<p className="text-lg leading-relaxed text-slate-500 px-4">
                                    Billntrade.com is the trading name for Billntrade Ltd. Registered in England No 12074484.
								</p>
								<div className="mt-6 lg:mb-0 mb-6 px-4">
									<a
										href="https://twitter.com/"
										target="_blank"
										className="inline-flex bg-white text-sky-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" rel="noreferrer"
									>
										<i className="fab fa-twitter"></i>
									</a>
									<a
										href="https://facebook.com/"
										target="_blank"
										className="inline-flex bg-white text-sky-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" rel="noreferrer"
									>
										<i className="fab fa-facebook-square"></i>
									</a>
									<a
										href="https://instagram.com/"
										target="_blank"
										className="inline-flex bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" rel="noreferrer"
									>
										<i className="fab fa-instagram"></i>
									</a>
									<a
										href="https://linkedin.com/"
										target="_blank"
										className="inline-flex bg-white text-linkedin shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" rel="noreferrer"
									>
										<i className="fab fa-linkedin"></i>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="relative block bg-gradient-to-br from-tahiti-900 to-tahiti-800">
				<div
					className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-20"
					style={{ transform: 'translateZ(0)' }}
				>
					<svg
						className="absolute top-0 overflow-hidden"
						xmlns="http://www.w3.org/2000/svg"
						preserveAspectRatio="none"
						version="1.1"
						viewBox="0 0 2560 100"
						x="0"
						y="0"
					>
						<polygon
							className="text-white fill-current"
							points="0 0 2560 0 0 100"
						></polygon>
					</svg>
				</div>

				<div className="relative block py-24 mx-auto px-4 lg:pt-24">
					<div className="container mx-auto px-4 flex flex-wrap justify-end">
						<div className="w-full lg:w-6/12">
							<div className="mb-6 lg:-mt-[75%] -mt-48">
								<ContactForm />
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

Contact.layout = Layout;
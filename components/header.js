import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useSession} from 'next-auth/react';

// components
import Button from './UI/button';
import UserDropdown from './Dropdowns/UserDropdown';

const Header = (props) => {
	const [navbarOpen, setNavbarOpen] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const { data: session, status } = useSession();

	return (
		<header>
			<nav
				onMouseLeave={()=>setNavbarOpen(false)}
				className={`${props.transparent ? 'bg-transparent absolute' : 'bg-white fixed'} top-0 z-50 w-full flex flex-wrap items-center justify-between px-2 py-2 navbar-expand-lg shadow h-12`}
			>
				<div className="w-full px-4 mx-auto flex flex-wrap items-center justify-between">
					<div className="w-full relative flex justify-between md:w-auto md:static md:block md:justify-start">
						<Link
							href={session?.access ? `/${session?.user?.data?.user_type?.toLowerCase()}` : '/'}
							passHref
						>
							<a
								className="md:inline-block hidden text-slate-700 text-sm font-semibold leading-relaxed mr-4 whitespace-nowrap"

							>
								<Image
									className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860-px cursor-pointer"
									src={props.transparent ? '/img/logo-light.png' : '/img/logo.png'}
									alt="Billntrade logo"
									width={145}
									height={22}
								/>
							</a>
						</Link>
						{/* <button
						className={`${props.transparent && 'text-white'} cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none`}
						type="button"
						onClick={() => setNavbarOpen(!navbarOpen)}
					>
						<i className="fas fa-bars"></i>
					</button> */}
						<ul className='md:hidden flex-row list-none items-center flex flex-1 justify-between'>
							{/* <li>
							<button
								className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
								type="button"
								onClick={() => setNavbarOpen(!navbarOpen)}
							>
								<i className="fas fa-bars"></i>
							</button>
						</li> */}
							<li className='max-w-[100px]'>
								<Link
									href="/"
									passHref
								>
									<a className='md:pb-2 md:max-w-full text-left mr-0 flex px-0'>
										<Image
											src='/img/favicon.png'
											alt="Billntrade logo"
											width={25}
											height={25}
										/>
									</a>
								</Link>
							</li>
							{/* <li className='relative'> */}
							{status === 'authenticated' ? (
								<li className='relative'>
									<UserDropdown short="true" user={session?.user?.data} />
								</li>
							) : (
								<>
									<li className="flex items-center mr-3">
										<Link href='/auth/register'>
											<a className='indigo-link px-4 text-sm'>
										Register
											</a>
										</Link>
									</li>
									<li className="flex items-center">
										<Button
											href='/auth/login'
											rel="noreferrer"
											small="true"
											type="link"
										>
											<i className="fa-solid fa-user"></i>
											{'  '}
											<span className='inline-block ml-1'>
										Login
											</span>
										</Button>
									</li>
								</>
							)}
							{/* </li> */}
						</ul>
					</div>
					<div
						className={
							'md:flex flex-grow items-center bg-white md:bg-opacity-0 md:shadow-none' +
              (navbarOpen ? ' block w-screen absolute left-0 top-12 border-t border-b pt-5' : ' hidden')
						}
						id="example-navbar-warning"
					>
						<ul className={'flex flex-col md:flex-row list-none md:ml-auto' +
					(navbarOpen ? ' px-2 pb-4 container mx-auto' : ' ')
						}>

							{status === 'authenticated' ? (
								<li className="flex items-center">
									<UserDropdown user={session?.user?.data} />
								</li>

							) : (
								<>
									<li className="flex items-center mr-3">
										<Link href='/auth/register'>
											<a className='indigo-link px-4 text-sm'>
										Register
											</a>
										</Link>
									</li>
									<li className="flex items-center">
										<Button
											href='/auth/login'
											rel="noreferrer"
											small="true"
											type="link"
										>
											<i className="fa-solid fa-user"></i>
											{'  '}
											<span className='inline-block ml-1'>
										Login
											</span>
										</Button>
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;

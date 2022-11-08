import React from 'react';
import Link from 'next/link';

const FooterNavbar = (props) => {
	return (
		<nav className='my-2 max-w-full order-1 md:order-2'>
			{props.data && props.data.map((item, index)=>(
				<Link 
					key={item.title} 
					href={item.url}
					passHref
				>
					<a className={`pr-4 hover:text-indigo-600 py-2 inline-block ${index === props.data.length-1 && 'pr-0'}`}>
						{item.title}
					</a>
				</Link>
			))}
		</nav>
	);
};

export default FooterNavbar;
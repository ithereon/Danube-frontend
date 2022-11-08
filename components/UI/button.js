import React, {useState} from 'react';
import { motion } from 'framer-motion';

const Button = ({withLoader, clicked, simple, ...props}) => {
	const [effect, setEffect] = useState(false);

	switch (props.type) {
	case 'link':
		if(simple){
			return (
				<motion.div
					animate={effect ? {
						opacity: .7
					} : {}}
				>
					<a className={`
					${props.big ? 'py-4 px-6 text-sm ' : props.small ? 'py-2 text-xs px-3 min-w-[70px] ' : 'py-3 text-sm px-6 '} 
					${props.full && 'w-full '}
					${props.disabled && 'opacity-80 cursor-not-allowed'} 
					text-slate-600 bg-white flex justify-center items-center active:bg-white font-semibold capitilize rounded shadow hover:shadow-lg outline-none focus:outline focus:outline-indigo-300 ease-linear transition-all duration-150
					`}
					onClick={(e) => {
						e.preventDefault();
						setEffect(true);
						setTimeout(() => {
							// clicked && clicked();
							props.href && props.router && props.router.push(props.href);
							!props.href && clicked && clicked();
							setEffect(false);
						}, 100);
					}}
					{...props}
					>
						{props.children}
					</a>
				</motion.div>
			);
		}
		return (
			<a
				className={`
					${props.big ? 'py-4 px-6 text-sm ' : props.small ? 'py-2 text-xs px-3 ' : 'py-3 text-sm px-6 '} 
					${props.full && 'w-full '}
					${props.disabled && 'opacity-80 cursor-not-allowed'} 
					bg-gradient-to-b from-indigo-400 to-indigo-500
					text-white active:bg-indigo-600 font-semibold capitilize rounded shadow hover:shadow-lg outline-none focus:outline focus:outline-indigo-300 ease-linear transition-all duration-150
				`}
				{...props}
			>
				{props.children}
			</a>
		);
	default:
		return (
			<motion.div
				animate={effect ? {
					opacity: .7
				} : {}}
			>
				<button
					className={` 
					${props.big ? 'py-4 px-6 text-sm ' : props.small ? 'py-2 text-xs px-3 ' : 'py-3 text-sm px-6 '}
					${props.full && 'w-full '} 
					${props.disabled && 'opacity-80 cursor-not-allowed'} 
					${simple ? 
				'text-slate-600 bg-white flex justify-center items-center active:bg-white font-semibold capitilize rounded shadow hover:shadow-lg outline-none focus:outline focus:outline-indigo-300 ease-linear transition-all duration-150' 
				: 'bg-gradient-to-b from-indigo-400 to-indigo-500 text-white active:bg-indigo-600 text-sm font-semibold capitilize rounded shadow hover:shadow-lg outline-none focus:outline focus:outline-indigo-300 ease-linear transition-all duration-150'}
				`}
					type={props.type ? props.type : 'button'}
					onClick={() => {
						setEffect(true);
						setTimeout(() => {
							clicked && clicked();
							setEffect(false);
						}, 100);
					}}
					{...props}
				>
					<span>{props.children}</span>
					{withLoader && <span key={withLoader} className='pl-2'><i className='fas fa-circle-notch animate-spin' /></span>}
				</button>
			</motion.div>
		);
	}
};

export default Button;

import React, {useState} from 'react';
import { motion } from 'framer-motion';

export const BorderButton = ({clicked, withLoader, colorStyles, disabled, ...props}) => {
	const [effect, setEffect] = useState(false);
	// const colorStyles = `text-${color} border-${color} hover:bg-${color} active:bg-${color}`;
	if(props.type === 'link'){
		return (
			<motion.div
				animate={effect ? {
					scale: 1.1,
					opacity: .8
				} : {}}
			>
				<a
					className={`${(colorStyles && !disabled) && colorStyles + ' hover:text-white active:text-white '} ${disabled && 'text-neutral-500 border-neutral-500 hover:text-neutral-500 cursor-not-allowed active:bg-neutral-600 focus:shadow-neutral-600'} flex items-center justify-center bg-transparent border border-solid font-bold uppercase text-xs px-4 py-2 rounded-full outline-none mr-1 mb-1 ease-linear transition-all duration-150 focus:outline-transparent focus:shadow focus:rounded-full focus-within:outline-transparent focus-within:rounded-full focus-within:shadow focus-visible:shadow focus-visible:rounded-full focus-visible:outline-transparent`}
					onClick={() => {
						setEffect(true);
						setTimeout(() => {
							clicked && clicked();
							setEffect(false);
						}, 100);
					}}
					{...props}
				>
					<span>
						{props.children}
					</span>
					{(withLoader) && <span key={withLoader} className='pl-1'><i className='fas fa-circle-notch animate-spin' /></span>}
				</a>
			</motion.div>
		);
	}
	return (
		<motion.div
			animate={effect ? {
				scale: 1.1,
				opacity: .8
			} : {}}
		>
			<button
				className={`${(colorStyles && !disabled) && colorStyles + ' hover:text-white active:text-white'} ${disabled && 'text-neutral-500 border-neutral-500 hover:text-neutral-500 cursor-not-allowed active:bg-neutral-600 focus:shadow-neutral-600'} flex items-center justify-center bg-transparent border border-solid font-bold uppercase text-xs px-4 py-2 rounded-full outline-none mr-1 mb-1 ease-linear transition-all duration-150 focus:outline-transparent focus:shadow focus:rounded-full focus-within:outline-transparent focus-within:rounded-full focus-within:shadow focus-visible:shadow focus-visible:rounded-full focus-visible:outline-transparent`}
				onClick={() => {
					setEffect(true);
					setTimeout(() => {
						clicked();
						setEffect(false);
					}, 100);
				}}
				{...props}
			>
				<span>
					{props.children}
				</span>
				{(withLoader) && <span key={withLoader} className='pl-1'><i className='fas fa-circle-notch animate-spin' /></span>}
			</button>
		</motion.div>
	);
};

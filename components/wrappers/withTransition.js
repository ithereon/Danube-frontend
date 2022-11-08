import React from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

export const WithTransition = ({children}) => {
	const router = useRouter();
	const spring = {
		type: 'spring',
		damping: 20,
		stiffness: 100,
		when: 'afterChildren'
	};

	return (
		<AnimatePresence>
			<div className="page-transition-wrapper w-full h-full relative" key={router?.pathname}>
				<motion.div
					transition={spring}
					key={router?.pathname}
					initial={{ x: 100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: -100, opacity: 0 }}
					id="page-transition-container" 
				>
					{children}
				</motion.div>
			</div>
		</AnimatePresence>
	);
};

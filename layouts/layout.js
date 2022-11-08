
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

import Footer from '../components/footer';
import Header from '../components/header';

const Layout = (props) => {
	const router = useRouter();
	const spring = {
		type: 'spring',
		damping: 20,
		stiffness: 100,
		when: 'afterChildren'
	};
	return (
		<div className='layout'>
			<Header fixed user={props.userData} />
			<AnimatePresence>
				<div className="page-transition-wrapper" key={router?.pathname}>
					<motion.div
						transition={spring}
						key={router?.pathname}
						initial={{ scale: 1.05, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						id="page-transition-container" 
					>
						{props.children}
						<Footer />
					</motion.div>
				</div>
			</AnimatePresence>
		</div>
				
	);};
export default Layout;
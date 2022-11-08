import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const StyledModal = ({
	open,
	onClose,
	closebutton,
	title,
	children,
	background,
	height,
	...props
}) => {
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		borderRadius: '0.5rem',
		boxShadow: 24,
		p: 4,
		paddingLeft: '0px',
		paddingRight: '0px',
		paddingTop: '0px',
		paddingBottom: '0px',
		// minWidth: '220px',
		maxWidth: 'calc(100% - 10px)',
		width: 'max-content',
		maxHeight: height || '100%',
		overflowY: 'auto'
	};
	return (
		<Modal  open={open ? open : false} onClose={onClose} {...props}>
			<Box sx={style}>
				{(closebutton || title) && (
					<div className={`${(closebutton && title) ? 'justify-between' : (title && !closebutton) ? 'justify-start' : 'justify-end'} relative w-full flex items-center py-2 px-4 bg-slate-100`}>
						{title && (
							<h2 className='font-medium capitalize text-slate-700'>
								{title}
							</h2>
						)}
						{closebutton && (
							<button
								onClick={()=>onClose()}
								className='w-7 h-7 rounded-[14px] flex justify-center items-center bg-white text-base text-neutral-500 border-neutral-500  hover:border active:bg-neutral-600 focus:shadow-neutral-600'
							>
								<i className='fas fa-xmark' />
							</button>
						)}
					</div>
				)}
				<div className={(background)+' pt-4 pb-6 px-3'}>
					{children}
				</div>
			</Box>
		</Modal>
	);
};

export default StyledModal;

import React, {useState, useRef} from 'react';
import { createPopper } from '@popperjs/core';
import { signOut } from 'next-auth/react';

// components
import Button from '../UI/button';

const StyledDropdown = (props) => {
	const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
	const btnDropdownRef = useRef();
	const popoverDropdownRef = useRef();

	const openDropdownPopover = () => {
		setDropdownPopoverShow(true);
		createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
			placement: props.placement ? props.placement : 'bottom',
		});
	};

	const closeDropdownPopover = () => {
		setDropdownPopoverShow(false);
	};

	return (
		<div onMouseLeave={() => closeDropdownPopover()} className='relative'>
			<button
				className="flex items-center cursor-pointer p-1 focus:border-blue-300 focus:border focus:outline-none"
				ref={btnDropdownRef}
				onClick={(e) => {
					e.preventDefault();
					dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
				}}
			>
				{props.toggler && props.toggler}
			</button>
			<div
				ref={popoverDropdownRef}
				className={
					(dropdownPopoverShow ? 'flex ' : 'hidden ') +
                    ' flex-col items-center bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48'
				}
			>
				{props.data ? props.data : (
					<>
						<Button
							rel="noreferrer" 
							small="true"
							type="link"
							onClick={(e) => {
								e.preventDefault();
								signOut({
									// callbackUrl: '/auth/login'
									callbackUrl: `${window.location.origin}`,
								});
							}}
						>
                            Log Out
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default StyledDropdown;

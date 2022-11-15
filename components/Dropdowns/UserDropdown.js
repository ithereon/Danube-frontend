import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Button from '../UI/button';
import {signOut} from 'next-auth/react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Link from 'next/link';


export default function UserDropdown(props) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<React.Fragment>
			<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
				<Button
					rel="noreferrer"
					small="true"
					type="link"
					id="demo-positioned-button"
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
				>
					<i className="fa-solid fa-user"></i>
					<span className={'ml-2'}>{props.user?.username}</span>
				</Button>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem >
					<Avatar />USER ID: {props.user?.id}
				</MenuItem>
				<Divider />
				{props.user?.user_type === 'Business' &&
				<MenuItem sx={{'&:hover': {color: 'white', backgroundColor: '#6366f1'}}}>
					<ListItemIcon>
						<AccountBalanceWalletOutlinedIcon fontSize="small"/>
					</ListItemIcon>
					<Link href={'/business/subscription/manage?p=1'}><a
						className="focus:outline-none">Subscription</a></Link>
				</MenuItem>}
				<MenuItem sx={{'&:hover': {color: 'white',backgroundColor: '#6366f1'}}}>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
				<MenuItem
					sx={{'&:hover': {color: 'white',backgroundColor: '#6366f1'}}}
					onClick={(e) => {e.preventDefault();signOut({callbackUrl: `${window.location.origin}`});}}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}


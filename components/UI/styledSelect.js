import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';



const CustomInput = styled(InputBase)(({ theme }) => ({
	'label + &': {
		marginTop: 0,
	},
	'& .MuiInputBase-input': {
		borderRadius: '0.25rem',
		boxShadow:  '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
		backgroundColor: '#fff',
		border: 'none',
		fontSize: '0.875rem',
		padding: '0.75rem',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		fontFamily: 'inherit',
		color: '#475569',
		lineHeight: '1.25rem',
		'&:focus': {
			borderRadius: '0.25rem',
			border: 'none',
			outline: '2px solid transparent',
			outlineOffset: '2px',
			'--tw-ring-shadow': '0 0 0 0 3px #3b82f680',
			boxShadow: '0 0 0 3px #3b82f680',
		},
	},
}));

export default function StyledSelect(props) {
	return props.options && (
		<FormControl sx={{ width: '100%', margin: 0 }}>
			{props.label && (
				<label
					className="block uppercase text-slate-600 text-xs font-bold mb-2"
					htmlFor={props.label}
				>
					{props.label}
					{' '}
					{props.required && <span className='text-red-400 px-1 font-light absolute -top-1 left-auto text-base'>*</span>}
				</label>
			)}
			<Select
				inputProps={{ 'aria-label': 'Without label' }}
				input={<CustomInput />}
				{...props}
			>
				{props.options.map(item=>(
					<MenuItem value={item.value} key={item.value}>
						{item.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

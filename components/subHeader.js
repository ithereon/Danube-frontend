import { useRouter } from 'next/router';
import React from 'react';
import Button from './UI/button';

export const SubHeader = ({children, canCreate}) => {
	const router = useRouter();
	return (
		<div className='flex justify-between items-center w-full'>
			<h1 className="text-slate-800 w-full mx-auto px-4 my-7 text-xl capitalize font-semibold z-30">
				{children}
			</h1>
			{canCreate && (
				<div className='flex items-center mx-4'>
					<Button
						type="link"
						simple="true"
						small="true"
						router={router}
						href={router.pathname.replace('manage','create')}
					>
						<i className='fas fa-plus mr-1' /> NEW
					</Button>
				</div>
			)}
		</div>
	);
};



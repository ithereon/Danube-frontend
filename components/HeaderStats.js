import React from 'react';

// components
import CardStats from './Cards/CardStats.js';
import {HeaderStatSpacing} from '../lib/constants';



export default function HeaderStats() {
	const data = [
		{
			title: 'open contracts',
			amount: '350,322',
			total: '390.2',
			icon: 'fas fa-file-contract',
			color: 'bg-yellow-500'
		},
		{
			title: 'completed contracts',
			amount: '102,201',
			total: '329.3',
			icon: 'fas fa-file-circle-check',
			color: 'bg-indigo-500'
		},
		{
			title: 'open invoices',
			amount: '23',
			total: '283.5',
			icon: 'fas fa-file-invoice-dollar',
			color: 'bg-green-600'
		},
		{
			title: 'completed invoices',
			amount: '20',
			total: '327.3',
			icon: 'fas fa-receipt',
			color: 'bg-sky-600'
		}
	];

	return (
		<div className="relative mb-10">
			<div className="mx-auto w-full">
				<div>
					<div className="flex flex-wrap xl:items-stretch">
						{data?.map((item,index)=>(
							<div 
								className={`${HeaderStatSpacing[index]} w-full lg:w-6/12 xl:w-3/12`}
								key={item.title}
							>
								<CardStats
									statTitle={item.title}
									statAmount={item.amount}
									statTotal={item.total}
									statIconName={item.icon}
									statIconColor={item.color}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
